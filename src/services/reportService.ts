import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Product, StockMovement, MovementType } from "@/types";

// Extender el tipo jsPDF para incluir autoTable
declare module "jspdf" {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

export class ReportService {
  // Generar reporte de productos con stock bajo en PDF
  static generateLowStockPDF(products: Product[], username: string) {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(20);
    doc.text("Reporte de Stock Bajo", 20, 20);

    doc.setFontSize(12);
    doc.text(`Generado por: ${username}`, 20, 30);
    doc.text(
      `Fecha: ${format(new Date(), "dd/MM/yyyy HH:mm", { locale: es })}`,
      20,
      40
    );
    doc.text(`Total productos: ${products.length}`, 20, 50);

    // Tabla
    const tableData = products.map((product) => [
      product.code,
      product.name,
      product.stock.toString(),
      product.min_stock.toString(),
      product.stock === 0 ? "Sin stock" : "Stock bajo",
    ]);

    doc.autoTable({
      head: [["Código", "Producto", "Stock Actual", "Stock Mínimo", "Estado"]],
      body: tableData,
      startY: 60,
      styles: {
        fontSize: 10,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [59, 130, 246], // blue-500
        textColor: 255,
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251], // gray-50
      },
      didDrawCell: (data: any) => {
        // Colorear filas según el estado
        if (data.column.index === 4 && data.cell.raw === "Sin stock") {
          data.cell.styles.textColor = [220, 38, 38]; // red-600
          data.cell.styles.fontStyle = "bold";
        } else if (data.column.index === 4 && data.cell.raw === "Stock bajo") {
          data.cell.styles.textColor = [217, 119, 6]; // yellow-600
          data.cell.styles.fontStyle = "bold";
        }
      },
    });

    // Footer
    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(
        `Página ${i} de ${pageCount}`,
        doc.internal.pageSize.width - 30,
        doc.internal.pageSize.height - 10
      );
    }

    // Descargar
    doc.save(`stock-bajo-${format(new Date(), "yyyy-MM-dd")}.pdf`);
  }

  // Generar reporte de productos con stock bajo en Excel
  static generateLowStockExcel(products: Product[], username: string) {
    const data = products.map((product) => ({
      Código: product.code,
      Producto: product.name,
      "Stock Actual": product.stock,
      "Stock Mínimo": product.min_stock,
      Estado: product.stock === 0 ? "Sin stock" : "Stock bajo",
      "Fecha Creación": format(new Date(product.createdAt), "dd/MM/yyyy"),
    }));

    // Agregar información del reporte
    const reportInfo = [
      {
        Código: "REPORTE DE STOCK BAJO",
        Producto: "",
        "Stock Actual": "",
        "Stock Mínimo": "",
        Estado: "",
        "Fecha Creación": "",
      },
      {
        Código: `Generado por: ${username}`,
        Producto: "",
        "Stock Actual": "",
        "Stock Mínimo": "",
        Estado: "",
        "Fecha Creación": "",
      },
      {
        Código: `Fecha: ${format(new Date(), "dd/MM/yyyy HH:mm")}`,
        Producto: "",
        "Stock Actual": "",
        "Stock Mínimo": "",
        Estado: "",
        "Fecha Creación": "",
      },
      {
        Código: `Total productos: ${products.length}`,
        Producto: "",
        "Stock Actual": "",
        "Stock Mínimo": "",
        Estado: "",
        "Fecha Creación": "",
      },
      {
        Código: "",
        Producto: "",
        "Stock Actual": "",
        "Stock Mínimo": "",
        Estado: "",
        "Fecha Creación": "",
      },
      ...data,
    ];

    const ws = XLSX.utils.json_to_sheet(reportInfo);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Stock Bajo");

    // Ajustar ancho de columnas
    const colWidths = [
      { wch: 15 }, // Código
      { wch: 30 }, // Producto
      { wch: 12 }, // Stock Actual
      { wch: 12 }, // Stock Mínimo
      { wch: 12 }, // Estado
      { wch: 15 }, // Fecha Creación
    ];
    ws["!cols"] = colWidths;

    XLSX.writeFile(wb, `stock-bajo-${format(new Date(), "yyyy-MM-dd")}.xlsx`);
  }

  // Generar reporte de inventario completo en PDF
  static generateInventoryPDF(products: Product[], username: string) {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(20);
    doc.text("Inventario Completo", 20, 20);

    doc.setFontSize(12);
    doc.text(`Generado por: ${username}`, 20, 30);
    doc.text(
      `Fecha: ${format(new Date(), "dd/MM/yyyy HH:mm", { locale: es })}`,
      20,
      40
    );
    doc.text(`Total productos: ${products.length}`, 20, 50);

    // Calcular valor total (si tuviéramos precios)
    const totalItems = products.reduce((sum, p) => sum + p.stock, 0);
    doc.text(`Total unidades: ${totalItems}`, 20, 60);

    // Tabla
    const tableData = products.map((product) => [
      product.code,
      product.name,
      product.stock.toString(),
      product.min_stock.toString(),
      product.stock === 0
        ? "Sin stock"
        : product.stock <= product.min_stock
        ? "Stock bajo"
        : "En stock",
    ]);

    doc.autoTable({
      head: [["Código", "Producto", "Stock Actual", "Stock Mínimo", "Estado"]],
      body: tableData,
      startY: 70,
      styles: {
        fontSize: 9,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [34, 197, 94], // green-500
        textColor: 255,
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251], // gray-50
      },
    });

    doc.save(`inventario-completo-${format(new Date(), "yyyy-MM-dd")}.pdf`);
  }

  // Generar reporte de inventario completo en Excel
  static generateInventoryExcel(products: Product[], username: string) {
    const data = products.map((product) => ({
      Código: product.code,
      Producto: product.name,
      "Stock Actual": product.stock,
      "Stock Mínimo": product.min_stock,
      Estado:
        product.stock === 0
          ? "Sin stock"
          : product.stock <= product.min_stock
          ? "Stock bajo"
          : "En stock",
      "Fecha Creación": format(new Date(product.createdAt), "dd/MM/yyyy"),
    }));

    // Calcular estadísticas
    const totalItems = products.reduce((sum, p) => sum + p.stock, 0);
    const lowStockCount = products.filter(
      (p) => p.stock <= p.min_stock && p.stock > 0
    ).length;
    const outOfStockCount = products.filter((p) => p.stock === 0).length;

    // Agregar información del reporte
    const reportInfo = [
      {
        Código: "INVENTARIO COMPLETO",
        Producto: "",
        "Stock Actual": "",
        "Stock Mínimo": "",
        Estado: "",
        "Fecha Creación": "",
      },
      {
        Código: `Generado por: ${username}`,
        Producto: "",
        "Stock Actual": "",
        "Stock Mínimo": "",
        Estado: "",
        "Fecha Creación": "",
      },
      {
        Código: `Fecha: ${format(new Date(), "dd/MM/yyyy HH:mm")}`,
        Producto: "",
        "Stock Actual": "",
        "Stock Mínimo": "",
        Estado: "",
        "Fecha Creación": "",
      },
      {
        Código: `Total productos: ${products.length}`,
        Producto: "",
        "Stock Actual": "",
        "Stock Mínimo": "",
        Estado: "",
        "Fecha Creación": "",
      },
      {
        Código: `Total unidades: ${totalItems}`,
        Producto: "",
        "Stock Actual": "",
        "Stock Mínimo": "",
        Estado: "",
        "Fecha Creación": "",
      },
      {
        Código: `Stock bajo: ${lowStockCount}`,
        Producto: "",
        "Stock Actual": "",
        "Stock Mínimo": "",
        Estado: "",
        "Fecha Creación": "",
      },
      {
        Código: `Sin stock: ${outOfStockCount}`,
        Producto: "",
        "Stock Actual": "",
        "Stock Mínimo": "",
        Estado: "",
        "Fecha Creación": "",
      },
      {
        Código: "",
        Producto: "",
        "Stock Actual": "",
        "Stock Mínimo": "",
        Estado: "",
        "Fecha Creación": "",
      },
      ...data,
    ];

    const ws = XLSX.utils.json_to_sheet(reportInfo);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Inventario");

    ws["!cols"] = [
      { wch: 15 },
      { wch: 30 },
      { wch: 12 },
      { wch: 12 },
      { wch: 12 },
      { wch: 15 },
    ];

    XLSX.writeFile(
      wb,
      `inventario-completo-${format(new Date(), "yyyy-MM-dd")}.xlsx`
    );
  }

  // Generar reporte de movimientos por período en PDF
  static generateMovementsPDF(
    movements: StockMovement[],
    dateFrom: string,
    dateTo: string,
    username: string
  ) {
    const doc = new jsPDF();

    // Header
    doc.setFontSize(20);
    doc.text("Reporte de Movimientos", 20, 20);

    doc.setFontSize(12);
    doc.text(`Generado por: ${username}`, 20, 30);
    doc.text(
      `Fecha: ${format(new Date(), "dd/MM/yyyy HH:mm", { locale: es })}`,
      20,
      40
    );
    doc.text(`Período: ${dateFrom} - ${dateTo}`, 20, 50);
    doc.text(`Total movimientos: ${movements.length}`, 20, 60);

    // Estadísticas
    const entradas = movements.filter((m) => m.type === MovementType.IN).length;
    const salidas = movements.filter((m) => m.type === MovementType.OUT).length;
    const ajustes = movements.filter(
      (m) => m.type === MovementType.ADJUST
    ).length;

    doc.text(
      `Entradas: ${entradas} | Salidas: ${salidas} | Ajustes: ${ajustes}`,
      20,
      70
    );

    // Tabla
    const tableData = movements.map((movement) => [
      format(new Date(movement.created_at), "dd/MM/yyyy HH:mm"),
      movement.type === "entrada"
        ? "Entrada"
        : movement.type === "salida"
        ? "Salida"
        : "Ajuste",
      movement.quantity.toString(),
      movement.reason || "Sin razón",
      movement.product_id?.substring(0, 8) + "..." || "N/A", // ID corto
    ]);

    doc.autoTable({
      head: [["Fecha", "Tipo", "Cantidad", "Razón", "Producto ID"]],
      body: tableData,
      startY: 80,
      styles: {
        fontSize: 8,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [168, 85, 247], // purple-500
        textColor: 255,
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [249, 250, 251],
      },
    });

    doc.save(`movimientos-${dateFrom}-${dateTo}.pdf`);
  }

  // Generar reporte de movimientos por período en Excel
  static generateMovementsExcel(
    movements: StockMovement[],
    dateFrom: string,
    dateTo: string,
    username: string
  ) {
    const data = movements.map((movement) => ({
      Fecha: format(new Date(movement.created_at), "dd/MM/yyyy HH:mm"),
      Tipo:
        movement.type === "entrada"
          ? "Entrada"
          : movement.type === "salida"
          ? "Salida"
          : "Ajuste",
      Cantidad: movement.quantity,
      Razón: movement.reason || "Sin razón",
      "Producto ID": movement.product_id,
      "Usuario ID": movement.user_id,
    }));

    // Estadísticas
    const entradas = movements.filter((m) => m.type === MovementType.IN).length;
    const salidas = movements.filter((m) => m.type === MovementType.OUT).length;
    const ajustes = movements.filter(
      (m) => m.type === MovementType.ADJUST
    ).length;

    const reportInfo = [
      {
        Fecha: "REPORTE DE MOVIMIENTOS",
        Tipo: "",
        Cantidad: "",
        Razón: "",
        "Producto ID": "",
        "Usuario ID": "",
      },
      {
        Fecha: `Generado por: ${username}`,
        Tipo: "",
        Cantidad: "",
        Razón: "",
        "Producto ID": "",
        "Usuario ID": "",
      },
      {
        Fecha: `Fecha: ${format(new Date(), "dd/MM/yyyy HH:mm")}`,
        Tipo: "",
        Cantidad: "",
        Razón: "",
        "Producto ID": "",
        "Usuario ID": "",
      },
      {
        Fecha: `Período: ${dateFrom} - ${dateTo}`,
        Tipo: "",
        Cantidad: "",
        Razón: "",
        "Producto ID": "",
        "Usuario ID": "",
      },
      {
        Fecha: `Total movimientos: ${movements.length}`,
        Tipo: "",
        Cantidad: "",
        Razón: "",
        "Producto ID": "",
        "Usuario ID": "",
      },
      {
        Fecha: `Entradas: ${entradas}`,
        Tipo: "",
        Cantidad: "",
        Razón: "",
        "Producto ID": "",
        "Usuario ID": "",
      },
      {
        Fecha: `Salidas: ${salidas}`,
        Tipo: "",
        Cantidad: "",
        Razón: "",
        "Producto ID": "",
        "Usuario ID": "",
      },
      {
        Fecha: `Ajustes: ${ajustes}`,
        Tipo: "",
        Cantidad: "",
        Razón: "",
        "Producto ID": "",
        "Usuario ID": "",
      },
      {
        Fecha: "",
        Tipo: "",
        Cantidad: "",
        Razón: "",
        "Producto ID": "",
        "Usuario ID": "",
      },
      ...data,
    ];

    const ws = XLSX.utils.json_to_sheet(reportInfo);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Movimientos");

    ws["!cols"] = [
      { wch: 18 },
      { wch: 10 },
      { wch: 10 },
      { wch: 25 },
      { wch: 15 },
      { wch: 15 },
    ];

    XLSX.writeFile(wb, `movimientos-${dateFrom}-${dateTo}.xlsx`);
  }
}

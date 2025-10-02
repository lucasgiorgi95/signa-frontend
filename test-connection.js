// Script simple para probar la conexión con el backend
const API_URL = 'http://localhost:8000/api/v1';

async function testConnection() {
  console.log('🧪 Probando conexión con el backend...\n');
  
  try {
    // Test 1: Verificar que el servidor esté corriendo
    console.log('1. Verificando servidor...');
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        username: 'testuser',
        password: 'testpass123'
      })
    });
    
    if (response.ok) {
      console.log('✅ Servidor backend funcionando correctamente');
      const data = await response.json();
      console.log('   Usuario creado:', data.username);
    } else if (response.status === 400) {
      console.log('✅ Servidor backend funcionando (usuario ya existe)');
    } else {
      console.log('❌ Error del servidor:', response.status);
    }
    
  } catch (error) {
    console.log('❌ No se puede conectar al backend');
    console.log('   Asegúrate de que el backend esté corriendo en http://localhost:8000');
    console.log('   Ejecuta: cd signa-backend && python run.py');
  }
}

// Ejecutar si es llamado directamente
if (typeof window === 'undefined') {
  testConnection();
}

module.exports = { testConnection };
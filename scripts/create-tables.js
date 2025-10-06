import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'

// Load environment variables
const envContent = readFileSync('.env', 'utf8')
const envVars = {}
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=')
  if (key && value) {
    envVars[key.trim()] = value.trim()
  }
})

const supabase = createClient(envVars.NEXT_PUBLIC_SUPABASE_URL, envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY)

async function createTables() {
  console.log('🚀 Creando tablas en Supabase...')

  try {
    // Ejemplo: Crear tabla de usuarios
    const { data: users, error: usersError } = await supabase.rpc('create_users_table')
    
    if (usersError) {
      console.log('ℹ️  Ejecutando SQL directamente...')
      
      // Si no tienes RPC, puedes usar SQL directo (necesitas permisos de admin)
      const createUsersTable = `
        CREATE TABLE IF NOT EXISTS users (
          id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
          email VARCHAR(255) UNIQUE NOT NULL,
          name VARCHAR(255),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
      
      console.log('📝 SQL para ejecutar manualmente:')
      console.log(createUsersTable)
    }

    // Ejemplo: Crear tabla de productos
    const createProductsTable = `
      CREATE TABLE IF NOT EXISTS products (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        price DECIMAL(10,2),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `
    
    console.log('📝 SQL para tabla products:')
    console.log(createProductsTable)

    console.log('✅ Scripts de creación generados!')
    console.log('💡 Copia y pega estos SQL en el SQL Editor de Supabase Dashboard')
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  }
}

createTables()
import path from 'path'
import { defineConfig } from 'prisma/config'
import 'dotenv/config' // Importante para ler o arquivo .env no terminal

export default defineConfig({
  schema: path.join('prisma', 'schema.prisma'),
  datasource: {
    url: process.env.DATABASE_URL, // O Migrate vai usar esta URL
  },
})
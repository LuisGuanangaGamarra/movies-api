#!/bin/sh
set -e

echo "📦 Esperando a que la base de datos esté lista..."

until nc -z -v -w30 $DB_HOST $DB_PORT
do
  echo "⏳ Esperando a la DB en $DB_HOST:$DB_PORT..."
  sleep 5
done

echo "✅ Base de datos disponible!"

echo "📜 Ejecutando migraciones..."
npm run typeorm migration:run

echo "🚀 Iniciando aplicación NestJS..."
exec node dist/main.js

#!/bin/sh
echo "==================================="
echo "Custom Startup Script"
echo "==================================="

cd /home/site/wwwroot

echo "Installing dependencies..."
npm install --production

echo "Generating Prisma Client..."
npx prisma generate

echo "Running database migrations..."
npx prisma db push --accept-data-loss

echo "Starting application..."
node dist/app.js
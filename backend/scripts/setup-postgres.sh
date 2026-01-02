#!/bin/bash

# PostgreSQL Setup Script for Ladies Tailor Shop
# This script helps set up PostgreSQL database

echo "=================================="
echo "PostgreSQL Setup for Ladies Tailor Shop"
echo "=================================="
echo ""

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed!"
    echo ""
    echo "Please install PostgreSQL first:"
    echo "  Ubuntu/Debian: sudo apt install postgresql postgresql-contrib"
    echo "  macOS: brew install postgresql"
    echo "  Windows: Download from https://www.postgresql.org/download/windows/"
    exit 1
fi

echo "✓ PostgreSQL is installed"
echo ""

# Get database credentials
read -p "Enter PostgreSQL username [postgres]: " DB_USER
DB_USER=${DB_USER:-postgres}

read -sp "Enter PostgreSQL password: " DB_PASSWORD
echo ""

read -p "Enter database name [ladies_tailor_db]: " DB_NAME
DB_NAME=${DB_NAME:-ladies_tailor_db}

echo ""
echo "Creating database..."

# Create database
PGPASSWORD=$DB_PASSWORD psql -U $DB_USER -h localhost -c "CREATE DATABASE $DB_NAME;" 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✓ Database created successfully"
else
    echo "⚠ Database might already exist or creation failed"
fi

echo ""
echo "Running schema..."

# Run schema
PGPASSWORD=$DB_PASSWORD psql -U $DB_USER -h localhost -d $DB_NAME -f ../database/schema_postgres.sql

if [ $? -eq 0 ]; then
    echo "✓ Schema applied successfully"
else
    echo "❌ Failed to apply schema"
    exit 1
fi

echo ""
echo "Verifying setup..."

# Verify tables
TABLE_COUNT=$(PGPASSWORD=$DB_PASSWORD psql -U $DB_USER -h localhost -d $DB_NAME -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';")

echo "✓ Found $TABLE_COUNT tables"

echo ""
echo "=================================="
echo "Setup Complete!"
echo "=================================="
echo ""
echo "Database Details:"
echo "  Host: localhost"
echo "  Port: 5432"
echo "  Database: $DB_NAME"
echo "  User: $DB_USER"
echo ""
echo "Next steps:"
echo "1. Update your .env file with these credentials"
echo "2. Run: cd backend && npm install"
echo "3. Run: npm start"
echo ""

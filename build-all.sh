#!/bin/bash
# build-all.sh - Unified build script for Dr. Pedro's entire ecosystem

echo "🚀 Building unified Dr. Pedro ecosystem"

# Create unified dist directory
rm -rf dist
mkdir -p dist

echo "📦 Building unified frontend application..."
cd frontend
# Force clean install
rm -rf node_modules package-lock.json
npm install --silent
# Force production build with no cache
NODE_ENV=production npm run build --silent
cp -r dist/* ../dist/
cd ..

echo "📊 Build Summary:"
echo "   📁 Unified site with all subdomains: dist/"
echo "   📌 Available routes:"
echo "      - Main site: /"
echo "      - TMJ: /tmj"
echo "      - Implants: /implants"
echo "      - Robotic: /robotic"
echo "      - MedSpa: /medspa"
echo "      - AboutFace: /aboutface"

echo "🎉 Unified build complete!"

#!/bin/bash
# build-all.sh - Unified build script for Dr. Pedro's entire ecosystem

echo "🚀 Building unified Dr. Pedro ecosystem"

# Create unified dist directory
rm -rf dist
mkdir -p dist

echo "📦 Building main frontend..."
cd frontend
npm install --silent
npm run build --silent
cp -r dist/* ../dist/
cd ..

echo "📦 Building subdomains..."
SUBDOMAINS=("tmj" "implants" "robotic" "medspa" "aboutface")

for subdomain in "${SUBDOMAINS[@]}"; do
    echo "   📋 Building $subdomain..."
    cd "subdomains/$subdomain"
    
    if [ ! -f "package.json" ]; then
        echo "   ⚠️  No package.json found for $subdomain, skipping..."
        cd "../.."
        continue
    fi
    
    npm install --silent
    npm run build --silent
    
    # Create subdomain directory in main dist
    mkdir -p "../../dist/$subdomain"
    cp -r dist/* "../../dist/$subdomain/"
    
    cd "../.."
    echo "   ✅ $subdomain built successfully"
done

echo "📊 Build Summary:"
echo "   📁 Main site: dist/"
echo "   📁 TMJ subdomain: dist/tmj/"
echo "   📁 Implants subdomain: dist/implants/"
echo "   📁 Robotic subdomain: dist/robotic/"
echo "   📁 MedSpa subdomain: dist/medspa/"
echo "   📁 AboutFace subdomain: dist/aboutface/"

echo "🎉 Unified build complete!"

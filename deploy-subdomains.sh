#!/bin/bash
# deploy-subdomains.sh - Deploy all Dr. Pedro subdomains to Netlify

echo "🚀 Starting subdomain deployment for Dr. Pedro ecosystem"

# Array of subdomains to deploy
SUBDOMAINS=("tmj" "implants" "robotic" "medspa" "aboutface")

# Function to deploy a single subdomain
deploy_subdomain() {
    local subdomain=$1
    echo ""
    echo "📦 Deploying $subdomain subdomain..."
    
    # Navigate to subdomain directory
    cd "subdomains/$subdomain"
    
    # Check if directory exists
    if [ ! -d "." ]; then
        echo "❌ Error: Directory subdomains/$subdomain does not exist"
        return 1
    fi
    
    # Install dependencies
    echo "   📋 Installing dependencies..."
    npm install --silent
    
    if [ $? -ne 0 ]; then
        echo "❌ Error: Failed to install dependencies for $subdomain"
        cd "../.."
        return 1
    fi
    
    # Build for production
    echo "   🔨 Building $subdomain for production..."
    npm run build --silent
    
    if [ $? -ne 0 ]; then
        echo "❌ Error: Failed to build $subdomain"
        cd "../.."
        return 1
    fi
    
    # Deploy to Netlify
    echo "   🌐 Deploying $subdomain to Netlify..."
    netlify deploy --prod --dir=dist
    
    if [ $? -eq 0 ]; then
        echo "   ✅ $subdomain deployed successfully!"
    else
        echo "   ❌ Error: Failed to deploy $subdomain"
        cd "../.."
        return 1
    fi
    
    # Return to root directory
    cd "../.."
    
    return 0
}

# Main deployment loop
echo "🎯 Deploying ${#SUBDOMAINS[@]} subdomains..."

successful_deployments=0
failed_deployments=0

for subdomain in "${SUBDOMAINS[@]}"; do
    if deploy_subdomain "$subdomain"; then
        ((successful_deployments++))
    else
        ((failed_deployments++))
    fi
done

echo ""
echo "📊 Deployment Summary:"
echo "   ✅ Successful: $successful_deployments"
echo "   ❌ Failed: $failed_deployments"
echo "   📈 Total: ${#SUBDOMAINS[@]}"

if [ $failed_deployments -eq 0 ]; then
    echo ""
    echo "🎉 All subdomains deployed successfully!"
    echo ""
    echo "🌐 Your subdomain sites should be available at:"
    echo "   • TMJ: https://tmj.drpedro.com"
    echo "   • Implants: https://implants.drpedro.com" 
    echo "   • Robotic: https://robotic.drpedro.com"
    echo "   • MedSpa: https://medspa.drpedro.com"
    echo "   • AboutFace: https://aboutface.drpedro.com"
    echo ""
    echo "🔧 Next steps:"
    echo "   1. Configure DNS records to point subdomains to Netlify"
    echo "   2. Set up SSL certificates for each subdomain"
    echo "   3. Test all subdomain functionality"
else
    echo ""
    echo "⚠️  Some deployments failed. Please check the errors above."
    exit 1
fi

echo ""
echo "🏁 Subdomain deployment complete!"

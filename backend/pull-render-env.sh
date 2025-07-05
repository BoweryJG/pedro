#!/bin/bash

# Script to pull environment variables from Render
# You'll need to have the Render CLI installed and be logged in

echo "This script will help you pull environment variables from Render"
echo "Make sure you have the Render CLI installed: npm install -g @render-com/cli"
echo ""

# Check if render CLI is installed
if ! command -v render &> /dev/null; then
    echo "Render CLI not found. Install it with: npm install -g @render-com/cli"
    echo "Then login with: render login"
    exit 1
fi

echo "Fetching your Render services..."
render services list

echo ""
echo "Enter the service ID for your backend service (e.g., srv-xxxxx):"
read SERVICE_ID

echo ""
echo "Fetching environment variables for service $SERVICE_ID..."
echo ""

# Create a temporary file to store the env vars
TEMP_FILE=$(mktemp)

# Get the environment variables and format them
render env list --service $SERVICE_ID > $TEMP_FILE

echo "# Environment variables from Render service $SERVICE_ID" > .env.from-render
echo "# Generated on $(date)" >> .env.from-render
echo "" >> .env.from-render

# Parse the output and create .env format
while IFS= read -r line; do
    # Skip header lines and empty lines
    if [[ $line =~ ^[A-Z_]+[[:space:]]+ ]] && [[ ! $line =~ "NAME" ]]; then
        # Extract key and value (render cli outputs in format: KEY    VALUE)
        key=$(echo "$line" | awk '{print $1}')
        value=$(echo "$line" | cut -d' ' -f2-)
        echo "${key}=${value}" >> .env.from-render
    fi
done < $TEMP_FILE

rm $TEMP_FILE

echo ""
echo "Environment variables saved to .env.from-render"
echo ""
echo "To use these variables:"
echo "1. Review .env.from-render to ensure sensitive data looks correct"
echo "2. Copy the variables you need to .env"
echo "3. Or rename the file: mv .env.from-render .env"
echo ""
echo "WARNING: .env.from-render contains sensitive data - do not commit to git!"
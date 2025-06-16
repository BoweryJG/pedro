#!/usr/bin/env node

// Bowery Creative - New Client Setup Script
// Usage: node scripts/new-client-setup.js

import inquirer from 'inquirer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🏢 Bowery Creative - New Client Setup\n');

const questions = [
  {
    type: 'input',
    name: 'clientName',
    message: 'Doctor/Client Name (e.g., Dr. Smith):',
    validate: (input) => input.length > 0
  },
  {
    type: 'input',
    name: 'practiceName',
    message: 'Practice Name:',
    validate: (input) => input.length > 0
  },
  {
    type: 'input',
    name: 'identifier',
    message: 'Unique identifier (lowercase, no spaces, e.g., smith):',
    validate: (input) => /^[a-z]+$/.test(input)
  },
  {
    type: 'input',
    name: 'instagramUsername',
    message: 'Instagram Username (without @):',
    validate: (input) => input.length > 0
  },
  {
    type: 'input',
    name: 'phoneNumber',
    message: 'Practice Phone Number:',
  },
  {
    type: 'input',
    name: 'email',
    message: 'Practice Email:',
    validate: (input) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input)
  },
  {
    type: 'list',
    name: 'monthlyFee',
    message: 'Service Tier:',
    choices: [
      { name: 'Basic ($497/month)', value: 497 },
      { name: 'Professional ($997/month)', value: 997 },
      { name: 'Enterprise ($2,497/month)', value: 2497 }
    ]
  }
];

async function setupNewClient() {
  try {
    const answers = await inquirer.prompt(questions);
    
    console.log('\n📋 Generating configuration...\n');

    // 1. Create environment file template
    const envTemplate = `# ${answers.practiceName} - Instagram DM Automation
# Client: ${answers.clientName}
# Managed by: Bowery Creative Agency

# Facebook/Instagram API
FACEBOOK_APP_ID=959139930338809
FACEBOOK_APP_SECRET=[GET_FROM_FACEBOOK_APP]
FACEBOOK_PAGE_ACCESS_TOKEN=[GENERATE_AFTER_PAGE_SETUP]
FACEBOOK_WEBHOOK_VERIFY_TOKEN=${answers.identifier}_dental_2025
INSTAGRAM_PAGE_ID=[GET_FROM_GRAPH_API]

# Anthropic Claude AI
ANTHROPIC_API_KEY=[YOUR_ANTHROPIC_KEY]

# Supabase
SUPABASE_URL=[YOUR_SUPABASE_URL]
SUPABASE_SERVICE_ROLE_KEY=[YOUR_SERVICE_KEY]

# Practice Information
PRACTICE_NAME="${answers.practiceName}"
PRACTICE_PHONE="${answers.phoneNumber}"
PRACTICE_EMAIL="${answers.email}"
MANAGED_BY="Bowery Creative Agency"

# Server
PORT=10000
NODE_ENV=production`;

    // 2. Create deployment configuration
    const deployConfig = {
      name: answers.clientName,
      identifier: answers.identifier,
      render: {
        serviceName: `${answers.identifier}-instagram-bot`,
        deployUrl: `https://${answers.identifier}backend.onrender.com`,
        envFile: `.env.${answers.identifier}`
      },
      facebook: {
        pageName: `${answers.practiceName} - Managed by Bowery Creative`,
        pageCategory: 'Dentist & Dental Office'
      },
      instagram: {
        username: `@${answers.instagramUsername}`,
        accountType: 'Business'
      },
      billing: {
        monthlyFee: answers.monthlyFee,
        startDate: new Date().toISOString().split('T')[0]
      }
    };

    // 3. Save files
    const envPath = path.join(__dirname, '..', 'backend', `.env.${answers.identifier}`);
    const configPath = path.join(__dirname, '..', 'clients', `${answers.identifier}.json`);
    
    // Create clients directory if it doesn't exist
    const clientsDir = path.join(__dirname, '..', 'clients');
    if (!fs.existsSync(clientsDir)) {
      fs.mkdirSync(clientsDir, { recursive: true });
    }

    fs.writeFileSync(envPath, envTemplate);
    fs.writeFileSync(configPath, JSON.stringify(deployConfig, null, 2));

    // 4. Generate setup checklist
    console.log('✅ Configuration files created!\n');
    console.log('📋 Next Steps:\n');
    console.log(`1. Create Facebook Page:`);
    console.log(`   - Name: "${answers.practiceName} - Managed by Bowery Creative"`);
    console.log(`   - Add client as Editor (not Admin)\n`);
    
    console.log(`2. Connect Instagram:`);
    console.log(`   - Username: @${answers.instagramUsername}`);
    console.log(`   - Convert to Business Account`);
    console.log(`   - Connect to the Facebook Page\n`);
    
    console.log(`3. Deploy to Render:`);
    console.log(`   - Service Name: ${answers.identifier}-instagram-bot`);
    console.log(`   - Repository: BoweryJG/pedro`);
    console.log(`   - Root Directory: backend`);
    console.log(`   - Env File: .env.${answers.identifier}\n`);
    
    console.log(`4. Configure Webhook:`);
    console.log(`   - URL: https://${answers.identifier}backend.onrender.com/api/instagram/webhook`);
    console.log(`   - Verify Token: ${answers.identifier}_dental_2025\n`);
    
    console.log(`📁 Files created:`);
    console.log(`   - ${envPath}`);
    console.log(`   - ${configPath}\n`);
    
    console.log(`💰 Billing: $${answers.monthlyFee}/month starting ${new Date().toLocaleDateString()}\n`);

  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Run the setup
setupNewClient();
#!/bin/bash

# This script starts the SMS webhook server with your Supabase credentials

export SUPABASE_SERVICE_KEY="YOUR_SUPABASE_SERVICE_KEY_HERE"
export TWILIO_ACCOUNT_SID="YOUR_TWILIO_ACCOUNT_SID"
export TWILIO_AUTH_TOKEN="YOUR_TWILIO_AUTH_TOKEN"

cd /Users/jasonsmacbookpro2022/pedro/backend
npm install @supabase/supabase-js twilio express cors
node sms-webhook.js
import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';

// Supabase configuration
const SUPABASE_URL = 'https://fiozmyoedptukpkzuhqm.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpb3pteW9lZHB0dWtwa3p1aHFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4MTUxODcsImV4cCI6MjA2NTM5MTE4N30.XrzLFbtoOKcX0kU5K7MSPQKwTDNm6cFtefUGxSJzm-o';

// Backend URL
const BACKEND_URL = 'https://pedrobackend.onrender.com';
const AGENTBACKEND_URL = 'https://agentbackend-2932.onrender.com';

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testSupabaseAuth() {
  console.log('🔐 Testing Supabase Authentication Integration...\n');

  try {
    // Step 1: Sign in with test credentials
    console.log('1. Signing in with Supabase...');
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'test@example.com',
      password: 'testpassword123'
    });

    if (authError) {
      console.error('❌ Sign in failed:', authError.message);
      console.log('\n💡 Creating a test user...');
      
      // Create test user if doesn't exist
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: 'test@example.com',
        password: 'testpassword123',
        options: {
          data: {
            first_name: 'Test',
            last_name: 'User'
          }
        }
      });

      if (signUpError) {
        console.error('❌ Sign up failed:', signUpError.message);
        return;
      }

      console.log('✅ Test user created successfully');
      
      // Sign in again
      const { data: newAuthData, error: newAuthError } = await supabase.auth.signInWithPassword({
        email: 'test@example.com',
        password: 'testpassword123'
      });

      if (newAuthError) {
        console.error('❌ Sign in after signup failed:', newAuthError.message);
        return;
      }

      authData = newAuthData;
    }

    console.log('✅ Signed in successfully');
    console.log('   User ID:', authData.user.id);
    console.log('   Email:', authData.user.email);

    // Step 2: Test backend API with JWT token
    console.log('\n2. Testing backend API with Supabase JWT...');
    const backendResponse = await fetch(`${BACKEND_URL}/api/status`, {
      headers: {
        'Authorization': `Bearer ${authData.session.access_token}`
      }
    });

    if (backendResponse.ok) {
      const data = await backendResponse.json();
      console.log('✅ Backend API responded successfully:', data);
    } else {
      console.log('⚠️  Backend API status check returned:', backendResponse.status);
    }

    // Step 3: Test authenticated endpoint
    console.log('\n3. Testing authenticated endpoint...');
    const authTestResponse = await fetch(`${BACKEND_URL}/api/agents`, {
      headers: {
        'Authorization': `Bearer ${authData.session.access_token}`
      }
    });

    if (authTestResponse.ok) {
      const agents = await authTestResponse.json();
      console.log('✅ Successfully accessed authenticated endpoint');
      console.log('   Agents count:', agents.count || 0);
    } else {
      console.log('❌ Authenticated endpoint returned:', authTestResponse.status);
      const errorText = await authTestResponse.text();
      console.log('   Error:', errorText);
    }

    // Step 4: Test agentbackend integration
    console.log('\n4. Testing agentbackend integration...');
    const agentbackendResponse = await fetch(`${AGENTBACKEND_URL}/health`);
    
    if (agentbackendResponse.ok) {
      const health = await agentbackendResponse.json();
      console.log('✅ Agentbackend is healthy:', health);
    } else {
      console.log('⚠️  Agentbackend health check failed:', agentbackendResponse.status);
    }

    // Step 5: Test chat endpoint with JWT
    console.log('\n5. Testing chat endpoint with JWT...');
    const chatResponse = await fetch(`${BACKEND_URL}/api/chat/agent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authData.session.access_token}`
      },
      body: JSON.stringify({
        agentId: 'dental-assistant',
        message: 'Hello, can you help me?',
        conversationId: `test_${Date.now()}`
      })
    });

    if (chatResponse.ok) {
      const chatData = await chatResponse.json();
      console.log('✅ Chat endpoint responded successfully');
      console.log('   Response:', chatData.response?.substring(0, 100) + '...');
    } else {
      console.log('⚠️  Chat endpoint returned:', chatResponse.status);
    }

    // Step 6: Sign out
    console.log('\n6. Signing out...');
    await supabase.auth.signOut();
    console.log('✅ Signed out successfully');

    console.log('\n🎉 Supabase authentication integration test completed!');

  } catch (error) {
    console.error('\n❌ Test failed with error:', error);
  }
}

// Run the test
testSupabaseAuth();
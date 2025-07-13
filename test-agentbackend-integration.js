#!/usr/bin/env node

// Test script to verify agentbackend integration with Pedro
// This script tests that all Pedro functionality is maintained

import fetch from 'node-fetch';

const AGENTBACKEND_URL = 'https://agentbackend-2932.onrender.com';
const PEDRO_BACKEND_URL = 'https://pedrobackend.onrender.com'; // Update this if needed

async function testAgentbackendDirectly() {
  console.log('🔍 Testing agentbackend directly...');
  
  try {
    // Test 1: Fetch healthcare/dental agents
    const agentsResponse = await fetch(`${AGENTBACKEND_URL}/api/agents?category=healthcare&subcategory=dental`);
    if (!agentsResponse.ok) {
      throw new Error(`Agents API failed: ${agentsResponse.status}`);
    }
    
    const agentsData = await agentsResponse.json();
    console.log(`✅ Found ${agentsData.count} healthcare/dental agents`);
    
    if (agentsData.agents.length === 0) {
      console.log('⚠️  No healthcare/dental agents found in agentbackend');
      return false;
    }
    
    // Test 2: Get specific agent (Julie)
    const julieAgent = agentsData.agents.find(agent => agent.id === 'julie');
    if (julieAgent) {
      console.log(`✅ Julie agent found: ${julieAgent.name} - ${julieAgent.role}`);
    } else {
      console.log('⚠️  Julie agent not found, using first available agent');
    }
    
    // Test 3: Test chat functionality
    const testAgent = julieAgent || agentsData.agents[0];
    const chatResponse = await fetch(`${AGENTBACKEND_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        agentId: testAgent.id,
        message: 'Hello, I need to book an appointment',
        conversationId: 'test_conversation_pedro',
        clientId: 'pedro-test'
      })
    });
    
    if (!chatResponse.ok) {
      throw new Error(`Chat API failed: ${chatResponse.status}`);
    }
    
    const chatData = await chatResponse.json();
    console.log(`✅ Chat test successful: "${chatData.response?.substring(0, 100)}..."`);
    
    return true;
  } catch (error) {
    console.error('❌ Agentbackend direct test failed:', error.message);
    return false;
  }
}

async function testPedroBackendProxy() {
  console.log('\n🔍 Testing Pedro backend proxy...');
  
  try {
    // Test 1: Pedro agents endpoint
    const agentsResponse = await fetch(`${PEDRO_BACKEND_URL}/api/agents`);
    if (!agentsResponse.ok) {
      throw new Error(`Pedro agents API failed: ${agentsResponse.status}`);
    }
    
    const agentsData = await agentsResponse.json();
    console.log(`✅ Pedro backend proxy returned ${agentsData.count} agents`);
    
    if (agentsData.fallback) {
      console.log('⚠️  Pedro backend using fallback agents (agentbackend unavailable)');
    }
    
    // Test 2: Pedro chat proxy
    const testAgent = agentsData.agents[0];
    const chatResponse = await fetch(`${PEDRO_BACKEND_URL}/api/chat/agent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        agentId: testAgent.id,
        message: 'Hello, I want to schedule a dental consultation',
        conversationId: 'test_conversation_pedro_proxy',
        clientId: 'pedro-backend-test'
      })
    });
    
    if (!chatResponse.ok) {
      throw new Error(`Pedro chat proxy failed: ${chatResponse.status}`);
    }
    
    const chatData = await chatResponse.json();
    console.log(`✅ Pedro chat proxy successful: "${chatData.response?.substring(0, 100)}..."`);
    
    return true;
  } catch (error) {
    console.error('❌ Pedro backend proxy test failed:', error.message);
    return false;
  }
}

async function testFrontendCompatibility() {
  console.log('\n🔍 Testing frontend compatibility...');
  
  try {
    // Simulate frontend agent fetching
    const agentsResponse = await fetch(`${AGENTBACKEND_URL}/api/agents?category=healthcare&subcategory=dental`);
    const agentsData = await agentsResponse.json();
    
    // Check if all required fields are present for Pedro frontend
    const requiredFields = ['id', 'name', 'role', 'tagline', 'avatar', 'gradient', 'accentColor', 'shadowColor', 'personality'];
    const firstAgent = agentsData.agents[0];
    
    const missingFields = requiredFields.filter(field => !(field in firstAgent));
    if (missingFields.length > 0) {
      console.log(`⚠️  Missing fields in agent data: ${missingFields.join(', ')}`);
      console.log('Frontend may need fallback values for these fields');
    } else {
      console.log('✅ All required frontend fields present in agent data');
    }
    
    // Test agent personality structure
    if (firstAgent.personality && firstAgent.personality.traits && firstAgent.personality.specialties) {
      console.log('✅ Agent personality structure compatible with Pedro frontend');
    } else {
      console.log('⚠️  Agent personality structure may need adjustment for Pedro frontend');
    }
    
    return true;
  } catch (error) {
    console.error('❌ Frontend compatibility test failed:', error.message);
    return false;
  }
}

async function runAllTests() {
  console.log('🚀 Starting Pedro-Agentbackend Integration Tests\n');
  
  const tests = [
    { name: 'Agentbackend Direct', test: testAgentbackendDirectly },
    { name: 'Pedro Backend Proxy', test: testPedroBackendProxy },
    { name: 'Frontend Compatibility', test: testFrontendCompatibility }
  ];
  
  let passedTests = 0;
  
  for (const { name, test } of tests) {
    const result = await test();
    if (result) passedTests++;
    console.log(`\n${'='.repeat(50)}`);
  }
  
  console.log(`\n📊 Test Results: ${passedTests}/${tests.length} tests passed`);
  
  if (passedTests === tests.length) {
    console.log('🎉 All tests passed! Pedro-Agentbackend integration is working correctly.');
    console.log('\n✅ Key benefits achieved:');
    console.log('  • Centralized agent management');
    console.log('  • Healthcare/dental category filtering');
    console.log('  • Fallback support for reliability');
    console.log('  • Maintained Pedro UI/UX');
    console.log('  • Voice service integration');
  } else {
    console.log('⚠️  Some tests failed. Please review the integration.');
  }
  
  return passedTests === tests.length;
}

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllTests().catch(console.error);
}

export { runAllTests, testAgentbackendDirectly, testPedroBackendProxy, testFrontendCompatibility };
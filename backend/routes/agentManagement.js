import express from 'express';
import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';
import logger from '../src/utils/logger.js';

const router = express.Router();

// Initialize Supabase client for legacy support
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Agentbackend API configuration
const AGENTBACKEND_URL = 'https://agentbackend-2932.onrender.com';

// Maximum agents allowed for Pedro (legacy)
const MAX_AGENTS = 5;

// Get all agents - proxy to agentbackend with healthcare/dental filter
router.get('/agents', async (req, res) => {
  try {
    // Fetch agents from agentbackend with healthcare/dental filter
    const response = await fetch(`${AGENTBACKEND_URL}/api/agents?category=healthcare&subcategory=dental`);
    
    if (!response.ok) {
      throw new Error(`Agentbackend API failed: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error('Invalid response from agentbackend');
    }
    
    res.json({
      success: true,
      agents: data.agents,
      count: data.count,
      maxAllowed: MAX_AGENTS // Legacy support
    });
  } catch (error) {
    logger.error('Error fetching agents from agentbackend:', error);
    
    // Fallback to local Supabase agents if agentbackend is unavailable
    try {
      const { data: localAgents, error: supabaseError } = await supabase
        .from('pedro_agents')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (supabaseError) throw supabaseError;
      
      logger.warn('Falling back to local agents due to agentbackend unavailability');
      
      res.json({
        success: true,
        agents: localAgents,
        count: localAgents.length,
        maxAllowed: MAX_AGENTS,
        fallback: true
      });
    } catch (fallbackError) {
      logger.error('Fallback to local agents also failed:', fallbackError);
      res.status(500).json({ error: 'Failed to fetch agents from both agentbackend and local storage' });
    }
  }
});

// Receive agent deployment from agent-command-center
router.post('/agents/receive', async (req, res) => {
  try {
    const { agent, source } = req.body;
    
    // Verify source
    if (source !== 'agent-command-center') {
      return res.status(403).json({ error: 'Unauthorized source' });
    }
    
    // Validate agent data
    if (!agent || !agent.id || !agent.name || !agent.type) {
      return res.status(400).json({ error: 'Invalid agent data' });
    }
    
    // Check current agent count
    const { data: existingAgents, error: countError } = await supabase
      .from('pedro_agents')
      .select('id')
      .neq('id', agent.id); // Don't count the agent being updated
    
    if (countError) throw countError;
    
    // Check if we're at the limit (for new agents)
    const { data: currentAgent } = await supabase
      .from('pedro_agents')
      .select('id')
      .eq('id', agent.id)
      .single();
    
    if (!currentAgent && existingAgents.length >= MAX_AGENTS) {
      return res.status(400).json({ 
        error: `Pedro platform is limited to ${MAX_AGENTS} agents maximum`,
        currentCount: existingAgents.length,
        maxAllowed: MAX_AGENTS
      });
    }
    
    // Prepare agent data for Pedro (patient-focused)
    const pedroAgent = {
      id: agent.id,
      name: agent.name,
      type: agent.type,
      personality: {
        ...agent.personality,
        focus: 'patient-care',
        approach: 'empathetic',
        tone: 'warm-professional'
      },
      capabilities: {
        ...agent.capabilities,
        patientEducation: true,
        preOperativeCare: true,
        postOperativeCare: true,
        anxietyManagement: true
      },
      voice_config: agent.voice_config,
      knowledge_base: {
        ...agent.knowledge_base,
        specialties: ['patient-care', 'dental-health', 'procedure-explanation']
      },
      procedures_access: agent.procedures_access || ['dental_procedures', 'aesthetic_procedures'],
      deployed_from: 'agent-command-center',
      deployed_at: new Date().toISOString(),
      platform_specific: {
        pedro: {
          enabled: true,
          role: 'patient-care',
          priority: 'patient-experience'
        }
      }
    };
    
    // Upsert agent
    const { data: upsertedAgent, error: upsertError } = await supabase
      .from('pedro_agents')
      .upsert([pedroAgent], { onConflict: 'id' })
      .select()
      .single();
    
    if (upsertError) throw upsertError;
    
    // Update Julie AI configuration if needed
    if (agent.voice_config && agent.voice_config.enabled) {
      // Configure voice settings for this agent
      await supabase
        .from('voice_configurations')
        .upsert([{
          agent_id: agent.id,
          voice_id: agent.voice_config.voice_id || 'onMWZoQ12kUnMGN9jmVH', // Nicole voice
          settings: {
            stability: 0.7,
            similarityBoost: 0.8,
            style: 0.5,
            useSpeakerBoost: true
          }
        }], { onConflict: 'agent_id' });
    }
    
    logger.info(`Agent ${agent.name} deployed to Pedro platform`, {
      agentId: agent.id,
      action: currentAgent ? 'updated' : 'created'
    });
    
    res.json({ 
      success: true, 
      action: currentAgent ? 'updated' : 'created',
      agent: upsertedAgent,
      currentCount: currentAgent ? existingAgents.length : existingAgents.length + 1,
      maxAllowed: MAX_AGENTS
    });
  } catch (error) {
    logger.error('Error receiving agent:', error);
    res.status(500).json({ error: 'Failed to receive agent' });
  }
});

// Remove deployed agent
router.delete('/agents/:agentId', async (req, res) => {
  try {
    const { agentId } = req.params;
    const { source } = req.query;
    
    // Only allow deletion from agent-command-center
    if (source !== 'agent-command-center') {
      return res.status(403).json({ error: 'Unauthorized source' });
    }
    
    // Check if agent exists and was deployed from agent-command-center
    const { data: agent, error: fetchError } = await supabase
      .from('pedro_agents')
      .select('*')
      .eq('id', agentId)
      .single();
    
    if (fetchError || !agent) {
      return res.status(404).json({ error: 'Agent not found' });
    }
    
    if (agent.deployed_from !== 'agent-command-center') {
      return res.status(403).json({ error: 'Cannot delete agent not deployed from agent-command-center' });
    }
    
    // Delete the agent
    const { error: deleteError } = await supabase
      .from('pedro_agents')
      .delete()
      .eq('id', agentId);
    
    if (deleteError) throw deleteError;
    
    // Also remove voice configuration
    await supabase
      .from('voice_configurations')
      .delete()
      .eq('agent_id', agentId);
    
    logger.info(`Agent ${agent.name} removed from Pedro platform`, {
      agentId: agent.id
    });
    
    res.json({ 
      success: true, 
      message: `Agent ${agent.name} removed from Pedro platform` 
    });
  } catch (error) {
    logger.error('Error removing agent:', error);
    res.status(500).json({ error: 'Failed to remove agent' });
  }
});

// Get agent by ID - proxy to agentbackend
router.get('/agents/:agentId', async (req, res) => {
  try {
    const { agentId } = req.params;
    
    // Fetch agent from agentbackend
    const response = await fetch(`${AGENTBACKEND_URL}/api/agents/${agentId}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return res.status(404).json({ error: 'Agent not found' });
      }
      throw new Error(`Agentbackend API failed: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error('Invalid response from agentbackend');
    }
    
    res.json({ success: true, agent: data.agent });
  } catch (error) {
    logger.error('Error fetching agent from agentbackend:', error);
    
    // Fallback to local Supabase agent
    try {
      const { data: localAgent, error: supabaseError } = await supabase
        .from('pedro_agents')
        .select('*')
        .eq('id', agentId)
        .single();
      
      if (supabaseError || !localAgent) {
        return res.status(404).json({ error: 'Agent not found' });
      }
      
      logger.warn(`Falling back to local agent ${agentId} due to agentbackend unavailability`);
      
      res.json({ 
        success: true, 
        agent: localAgent,
        fallback: true 
      });
    } catch (fallbackError) {
      logger.error('Fallback to local agent also failed:', fallbackError);
      res.status(500).json({ error: 'Failed to fetch agent from both agentbackend and local storage' });
    }
  }
});

export default router;
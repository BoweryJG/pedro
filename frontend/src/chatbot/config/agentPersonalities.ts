// Agent Personalities Configuration - Now fetching from centralized agentbackend
// Each agent represents a unique team member with healthcare/dental specialization

export type AgentPersonality = {
  id: string;
  name: string;
  role: string;
  tagline: string;
  voiceId: string; // ElevenLabs voice ID
  audioSample?: string; // Path to sample audio file
  avatar: string; // Emoji or icon
  gradient: string; // Luxury gradient for card
  accentColor: string; // Primary color
  shadowColor: string; // For depth effects
  personality: {
    traits: string[];
    specialties: string[];
    origin?: string;
    language?: string;
    communication_style?: string;
    approach?: string;
    tone?: string;
  };
  capabilities?: {
    scheduling?: boolean;
    insurance_check?: boolean;
    basic_dental_info?: boolean;
    patientEducation?: boolean;
    preOperativeCare?: boolean;
    postOperativeCare?: boolean;
    anxietyManagement?: boolean;
  };
  voice_config?: {
    enabled: boolean;
    voice_id: string;
    voice_name: string;
    settings: {
      stability: number;
      similarityBoost: number;
      style: number;
      useSpeakerBoost: boolean;
    };
  };
  active: boolean;
  language: string;
  priority: number;
  category: string;
  subcategory: string;
  targetAudience: string[];
};

// Agent backend API configuration
const AGENTBACKEND_API_URL = 'https://agentbackend-2932.onrender.com';

// Cache for agents to avoid repeated API calls
let cachedAgents: AgentPersonality[] | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Fetch agents from centralized agentbackend
export async function fetchAgents(): Promise<AgentPersonality[]> {
  // Check cache first
  const now = Date.now();
  if (cachedAgents && (now - cacheTimestamp) < CACHE_DURATION) {
    return cachedAgents;
  }

  try {
    // Fetch healthcare and dental agents from agentbackend
    const response = await fetch(`${AGENTBACKEND_API_URL}/api/agents?category=healthcare&subcategory=dental`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch agents: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.success || !data.agents) {
      throw new Error('Invalid response format from agentbackend');
    }

    // Transform agentbackend format to Pedro format
    const agents: AgentPersonality[] = data.agents.map((agent: Record<string, unknown>) => ({
      id: agent.id,
      name: agent.name,
      role: agent.role,
      tagline: agent.tagline,
      voiceId: agent.voiceId || agent.voice_config?.voice_id || 'default',
      audioSample: agent.audioSample,
      avatar: agent.avatar,
      gradient: agent.gradient,
      accentColor: agent.accentColor,
      shadowColor: agent.shadowColor,
      personality: {
        traits: agent.personality?.traits || [],
        specialties: agent.personality?.specialties || [],
        origin: agent.personality?.origin,
        language: agent.personality?.language || agent.language,
        communication_style: agent.personality?.communication_style,
        approach: agent.personality?.approach,
        tone: agent.personality?.tone
      },
      capabilities: agent.capabilities,
      voice_config: agent.voice_config,
      active: agent.active !== false,
      language: agent.language || 'en',
      priority: agent.priority || 999,
      category: agent.category,
      subcategory: agent.subcategory,
      targetAudience: agent.targetAudience || []
    }));

    // Sort by priority
    agents.sort((a, b) => a.priority - b.priority);

    // Update cache
    cachedAgents = agents;
    cacheTimestamp = now;

    return agents;
  } catch (error) {
    console.error('Error fetching agents from agentbackend:', error);
    
    // Return fallback agents in case of error
    return getFallbackAgents();
  }
}

// Fallback agents if agentbackend is unavailable
function getFallbackAgents(): AgentPersonality[] {
  return [
    {
      id: 'julie',
      name: 'Julie',
      role: 'Care Coordinator',
      tagline: 'Your friendly guide to perfect smiles',
      voiceId: 'nicole',
      avatar: '👩‍⚕️',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
      accentColor: '#764ba2',
      shadowColor: 'rgba(118, 75, 162, 0.3)',
      personality: {
        traits: ['Professional', 'Warm', 'Knowledgeable'],
        specialties: ['General dentistry', 'Patient comfort', 'Scheduling']
      },
      active: true,
      language: 'en',
      priority: 1,
      category: 'healthcare',
      subcategory: 'dental',
      targetAudience: ['patients', 'general-care']
    },
    {
      id: 'dr_pedro',
      name: 'Dr. Pedro',
      role: 'Head Dentist',
      tagline: 'Direct access to the expert himself',
      voiceId: 'pNInz6obpgDQGcFmaJgB',
      avatar: '👨‍⚕️',
      gradient: 'linear-gradient(135deg, #141e30 0%, #243b55 100%)',
      accentColor: '#243b55',
      shadowColor: 'rgba(36, 59, 85, 0.5)',
      personality: {
        traits: ['Expert', 'Prestigious', 'Innovative'],
        specialties: ['YOMI robotics', 'Complex implants', 'Full reconstructions']
      },
      active: true,
      language: 'en',
      priority: 10,
      category: 'healthcare',
      subcategory: 'dental',
      targetAudience: ['patients', 'dental-professionals']
    }
  ];
}

// Maintain the synchronous export for backward compatibility
export const agentPersonalities: AgentPersonality[] = [];

// Helper functions for working with agents (async versions)
export async function getAgentById(id: string): Promise<AgentPersonality | undefined> {
  const agents = await fetchAgents();
  return agents.find(agent => agent.id === id);
}

export async function getAgentsByLanguage(language: string): Promise<AgentPersonality[]> {
  const agents = await fetchAgents();
  return agents.filter(agent => 
    agent.personality.language?.toLowerCase().includes(language.toLowerCase()) ||
    agent.language?.toLowerCase().includes(language.toLowerCase())
  );
}

export async function getAgentsByOrigin(origin: string): Promise<AgentPersonality[]> {
  const agents = await fetchAgents();
  return agents.filter(agent => 
    agent.personality.origin?.toLowerCase().includes(origin.toLowerCase())
  );
}

export async function getAgentsByCategory(category: string, subcategory?: string): Promise<AgentPersonality[]> {
  const agents = await fetchAgents();
  let filtered = agents.filter(agent => 
    agent.category?.toLowerCase() === category.toLowerCase()
  );
  
  if (subcategory) {
    filtered = filtered.filter(agent => 
      agent.subcategory?.toLowerCase() === subcategory.toLowerCase()
    );
  }
  
  return filtered;
}

// Legacy synchronous helper functions (deprecated - use async versions above)
export const getAgentById_legacy = (id: string): AgentPersonality | undefined => {
  return agentPersonalities.find(agent => agent.id === id);
};

export const getAgentsByLanguage_legacy = (language: string): AgentPersonality[] => {
  return agentPersonalities.filter(agent => 
    agent.personality.language?.toLowerCase().includes(language.toLowerCase())
  );
};

export const getAgentsByOrigin_legacy = (origin: string): AgentPersonality[] => {
  return agentPersonalities.filter(agent => 
    agent.personality.origin?.toLowerCase().includes(origin.toLowerCase())
  );
};
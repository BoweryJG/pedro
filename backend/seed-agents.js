// DEPRECATED: This file is now a legacy backup
// Pedro now uses centralized agents from agentbackend (https://agentbackend-2932.onrender.com)
// Agents are fetched dynamically with healthcare/dental category filter
// This file is kept for reference/fallback purposes only

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const agents = [
  {
    id: 'julie-001',
    name: 'Julie',
    type: 'patient-care',
    personality: {
      traits: ['Professional', 'Warm', 'Knowledgeable'],
      communication_style: 'friendly-professional',
      specialties: ['General dentistry', 'Patient comfort', 'Scheduling'],
      focus: 'patient-care',
      approach: 'empathetic',
      tone: 'warm-professional'
    },
    capabilities: {
      scheduling: true,
      insurance_check: true,
      basic_dental_info: true,
      patientEducation: true,
      preOperativeCare: true,
      postOperativeCare: true,
      anxietyManagement: true
    },
    voice_config: {
      enabled: true,
      voice_id: 'piTKgcLEGmPE4e6mEKli',
      voice_name: 'Nicole'
    },
    knowledge_base: {
      specialties: ['patient-care', 'dental-health', 'procedure-explanation']
    },
    procedures_access: ['dental_procedures', 'aesthetic_procedures'],
    deployed_from: 'agent-command-center',
    deployed_at: new Date().toISOString(),
    platform_specific: {
      pedro: {
        enabled: true,
        role: 'patient-care',
        priority: 'patient-experience'
      }
    }
  },
  {
    id: 'brian-001',
    name: 'Brian',
    type: 'patient-support',
    personality: {
      traits: ['Confident', 'Experienced', 'Reassuring'],
      communication_style: 'confident-professional',
      specialties: ['Complex procedures', 'Treatment planning', 'Insurance'],
      focus: 'patient-care',
      approach: 'empathetic',
      tone: 'warm-professional'
    },
    capabilities: {
      consultation: true,
      treatment_explanation: true,
      cost_breakdown: true,
      patientEducation: true,
      preOperativeCare: true,
      postOperativeCare: true,
      anxietyManagement: true
    },
    voice_config: {
      enabled: true,
      voice_id: 'ErXwobaYiN019PkySvjV',
      voice_name: 'Antoni'
    },
    knowledge_base: {
      specialties: ['patient-care', 'dental-health', 'procedure-explanation']
    },
    procedures_access: ['dental_procedures', 'aesthetic_procedures'],
    deployed_from: 'agent-command-center',
    deployed_at: new Date().toISOString(),
    platform_specific: {
      pedro: {
        enabled: true,
        role: 'patient-care',
        priority: 'patient-experience'
      }
    }
  },
  {
    id: 'maria-001',
    name: 'Maria',
    type: 'patient-care',
    personality: {
      traits: ['No-nonsense', 'Efficient', 'Local'],
      communication_style: 'direct-friendly',
      specialties: ['Quick scheduling', 'Local insurance', 'Straight talk'],
      origin: 'Staten Island',
      focus: 'patient-care',
      approach: 'empathetic',
      tone: 'warm-professional'
    },
    capabilities: {
      scheduling: true,
      billing: true,
      insurance_verification: true,
      patientEducation: true,
      preOperativeCare: true,
      postOperativeCare: true,
      anxietyManagement: true
    },
    voice_config: {
      enabled: true,
      voice_id: 'EXAVITQu4vr4xnSDxMaL',
      voice_name: 'Bella'
    },
    knowledge_base: {
      specialties: ['patient-care', 'dental-health', 'procedure-explanation']
    },
    procedures_access: ['dental_procedures', 'aesthetic_procedures'],
    deployed_from: 'agent-command-center',
    deployed_at: new Date().toISOString(),
    platform_specific: {
      pedro: {
        enabled: true,
        role: 'patient-care',
        priority: 'patient-experience'
      }
    }
  }
];

async function seedAgents() {
  console.log('Seeding agents to Pedro database...\n');
  
  // First, delete existing agents
  const { error: deleteError } = await supabase
    .from('pedro_agents')
    .delete()
    .neq('id', ''); // Delete all
    
  if (deleteError) {
    console.error('Error deleting existing agents:', deleteError);
  }
  
  // Insert new agents
  for (const agent of agents) {
    console.log(`Inserting ${agent.name}...`);
    
    const { data, error } = await supabase
      .from('pedro_agents')
      .insert([agent])
      .select()
      .single();
      
    if (error) {
      console.error(`❌ Error inserting ${agent.name}:`, error);
    } else {
      console.log(`✅ ${agent.name} inserted successfully!`);
      
      // Also insert voice configuration
      const { error: voiceError } = await supabase
        .from('voice_configurations')
        .upsert([{
          agent_id: agent.id,
          voice_id: agent.voice_config.voice_id,
          settings: {
            stability: 0.7,
            similarityBoost: 0.8,
            style: 0.5,
            useSpeakerBoost: true
          }
        }], { onConflict: 'agent_id' });
        
      if (voiceError) {
        console.error(`   Voice config error:`, voiceError);
      }
    }
  }
  
  // Verify agents were inserted
  const { data: verifyData, error: verifyError } = await supabase
    .from('pedro_agents')
    .select('id, name, type');
    
  if (verifyError) {
    console.error('Error verifying agents:', verifyError);
  } else {
    console.log('\n✅ Agents in database:');
    verifyData.forEach(agent => {
      console.log(`   - ${agent.name} (${agent.type})`);
    });
  }
}

seedAgents().then(() => {
  console.log('\n✨ Seeding complete!');
  process.exit(0);
}).catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
import React, { useState, useCallback } from 'react';
import { LuxuryAgentLauncher } from './LuxuryAgentLauncher';
import { PremiumChatbot } from '../../chatbot/components/PremiumChatbot';
import { SimpleWebRTCVoice } from '../SimpleWebRTCVoice';
import type { AgentPersonality } from '../../chatbot/config/agentPersonalities';

/**
 * Container component that integrates the luxury launcher with chat and voice systems
 * This handles the connection between agent selection and the actual communication channels
 */
export const LuxuryAgentLauncherContainer: React.FC = () => {
  const [showChat, setShowChat] = useState(false);
  const [showVoice, setShowVoice] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<AgentPersonality | null>(null);

  const handleAgentSelect = useCallback((agent: AgentPersonality, mode: 'chat' | 'voice') => {
    setSelectedAgent(agent);
    
    if (mode === 'chat') {
      setShowChat(true);
      setShowVoice(false);
    } else {
      setShowVoice(true);
      setShowChat(false);
    }

    // Update the backend with the selected agent's voice
    updateAgentVoice(agent);
  }, []);

  const updateAgentVoice = async (agent: AgentPersonality) => {
    try {
      // Send request to update the voice configuration
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
      await fetch(`${apiUrl}/voice/config`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          voiceId: agent.voiceId,
          agentName: agent.name,
          agentRole: agent.role,
          personality: agent.personality
        }),
      });
    } catch (error) {
      console.error('Failed to update agent voice:', error);
    }
  };

  const handleClose = useCallback(() => {
    setShowChat(false);
    setShowVoice(false);
  }, []);

  return (
    <>
      {/* Luxury Agent Launcher */}
      <LuxuryAgentLauncher onAgentSelect={handleAgentSelect} />

      {/* Chat Interface */}
      {showChat && selectedAgent && (
        <div 
          style={{
            position: 'fixed',
            bottom: '100px',
            right: '20px',
            width: '380px',
            maxWidth: 'calc(100vw - 40px)',
            height: '600px',
            maxHeight: 'calc(100vh - 120px)',
            zIndex: 9998,
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
          }}
        >
          <PremiumChatbot
            config={{
              agentName: selectedAgent.name,
              agentRole: selectedAgent.role,
              avatar: selectedAgent.avatar,
              gradient: selectedAgent.gradient,
              personality: selectedAgent.personality
            }}
            onClose={handleClose}
          />
        </div>
      )}

      {/* Voice Interface */}
      {showVoice && selectedAgent && (
        <div 
          style={{
            position: 'fixed',
            bottom: '100px',
            right: '20px',
            width: '380px',
            maxWidth: 'calc(100vw - 40px)',
            height: '500px',
            maxHeight: 'calc(100vh - 120px)',
            zIndex: 9998,
            background: selectedAgent.gradient,
            borderRadius: '20px',
            overflow: 'hidden',
            boxShadow: `0 20px 60px ${selectedAgent.shadowColor}`,
          }}
        >
          <div style={{
            background: 'rgba(0, 0, 0, 0.8)',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
          }}>
            {/* Close button */}
            <button
              onClick={handleClose}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                color: 'white',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              }}
            >
              ✕
            </button>

            {/* Agent Info */}
            <div style={{
              textAlign: 'center',
              marginBottom: '30px',
            }}>
              <div style={{ fontSize: '48px', marginBottom: '10px' }}>{selectedAgent.avatar}</div>
              <h3 style={{ 
                color: 'white', 
                fontSize: '24px', 
                fontWeight: '600',
                margin: '0 0 5px 0',
              }}>
                {selectedAgent.name}
              </h3>
              <p style={{
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '14px',
                margin: '0',
              }}>
                {selectedAgent.role}
              </p>
            </div>

            {/* Voice Component */}
            <SimpleWebRTCVoice 
              agentName={selectedAgent.name}
              voiceId={selectedAgent.voiceId}
            />
          </div>
        </div>
      )}
    </>
  );
};
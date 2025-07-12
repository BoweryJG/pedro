import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue } from 'framer-motion';
import { agentPersonalities, type AgentPersonality } from '../../chatbot/config/agentPersonalities';
import { CartierScrew } from '../effects/CartierScrews';
import './LuxuryAgentLauncher.css';

interface LuxuryAgentLauncherProps {
  onAgentSelect?: (agent: AgentPersonality, mode: 'chat' | 'voice') => void;
}

export const LuxuryAgentLauncher: React.FC<LuxuryAgentLauncherProps> = ({ onAgentSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<AgentPersonality | null>(null);
  const [showActionMenu, setShowActionMenu] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  
  // Swipe handling
  const x = useMotionValue(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const cardWidth = 90; // Card width + gap
  
  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowActionMenu(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Handle agent selection
  const handleAgentClick = (agent: AgentPersonality) => {
    setSelectedAgent(agent);
    setShowActionMenu(true);
  };

  // Handle action selection
  const handleActionSelect = (mode: 'chat' | 'voice') => {
    if (selectedAgent && onAgentSelect) {
      onAgentSelect(selectedAgent, mode);
      setIsOpen(false);
      setShowActionMenu(false);
    }
  };

  // Snap to nearest card
  const handleDragEnd = () => {
    const offset = x.get();
    const newIndex = Math.round(-offset / cardWidth);
    const clampedIndex = Math.max(0, Math.min(newIndex, agentPersonalities.length - 1));
    setCurrentIndex(clampedIndex);
    x.set(-clampedIndex * cardWidth);
  };

  return (
    <div ref={containerRef} className="luxury-agent-launcher">
      {/* Main Launcher Button */}
      <motion.button
        className={`launcher-orb ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        animate={{
          boxShadow: isOpen 
            ? '0 0 50px rgba(102, 126, 234, 0.5), 0 10px 30px rgba(0, 0, 0, 0.2)'
            : '0 0 30px rgba(102, 126, 234, 0.3), 0 5px 15px rgba(0, 0, 0, 0.2)'
        }}
      >
        <div className="orb-inner">
          <span className="orb-icon">{isOpen ? '✕' : '💬'}</span>
          <div className="orb-glow" />
          
          {/* Cartier Screws on the orb */}
          <svg className="orb-screws" width="60" height="60">
            <CartierScrew size={3} position={{ x: 10, y: 10 }} metalType="steel" interactive={false} />
            <CartierScrew size={3} position={{ x: 50, y: 10 }} metalType="steel" interactive={false} />
            <CartierScrew size={3} position={{ x: 10, y: 50 }} metalType="steel" interactive={false} />
            <CartierScrew size={3} position={{ x: 50, y: 50 }} metalType="steel" interactive={false} />
          </svg>
        </div>
      </motion.button>

      {/* Expanded Agent Carousel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="agent-carousel-container"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <div className="carousel-header">
              <h3 className="carousel-title">Choose Your AI Assistant</h3>
              <div className="carousel-subtitle">Swipe to explore our team</div>
            </div>

            <div className="carousel-viewport" ref={carouselRef}>
              <motion.div
                className="carousel-track"
                drag="x"
                dragConstraints={{
                  left: -(agentPersonalities.length - 1) * cardWidth,
                  right: 0
                }}
                dragElastic={0.2}
                onDragEnd={handleDragEnd}
                style={{ x }}
              >
                {agentPersonalities.map((agent) => (
                  <motion.div
                    key={agent.id}
                    className="agent-card"
                    onClick={() => handleAgentClick(agent)}
                    whileHover={{ y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    style={{
                      background: agent.gradient,
                      boxShadow: `0 10px 30px ${agent.shadowColor}`
                    }}
                  >
                    {/* Card Screws */}
                    <svg className="card-screws" width="80" height="100">
                      <CartierScrew size={2.5} position={{ x: 5, y: 5 }} metalType="gold" interactive={false} />
                      <CartierScrew size={2.5} position={{ x: 75, y: 5 }} metalType="gold" interactive={false} />
                      <CartierScrew size={2.5} position={{ x: 5, y: 95 }} metalType="gold" interactive={false} />
                      <CartierScrew size={2.5} position={{ x: 75, y: 95 }} metalType="gold" interactive={false} />
                    </svg>

                    <div className="agent-content">
                      <div className="agent-avatar">{agent.avatar}</div>
                      <div className="agent-name">{agent.name}</div>
                      <div className="agent-role">{agent.role}</div>
                      <div className="agent-tagline">{agent.tagline}</div>
                    </div>

                    <div className="agent-shimmer" />
                  </motion.div>
                ))}
              </motion.div>
            </div>

            {/* Pagination Dots */}
            <div className="carousel-pagination">
              {agentPersonalities.map((_, index) => (
                <button
                  key={index}
                  className={`pagination-dot ${currentIndex === index ? 'active' : ''}`}
                  onClick={() => {
                    setCurrentIndex(index);
                    x.set(-index * cardWidth);
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Action Menu */}
      <AnimatePresence>
        {showActionMenu && selectedAgent && (
          <motion.div
            className="action-menu"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <div className="action-menu-header">
              <div className="selected-agent-info">
                <span className="selected-avatar">{selectedAgent.avatar}</span>
                <span className="selected-name">{selectedAgent.name}</span>
              </div>
              <button className="close-menu" onClick={() => setShowActionMenu(false)}>✕</button>
            </div>

            <div className="action-buttons">
              <motion.button
                className="action-button chat"
                onClick={() => handleActionSelect('chat')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="action-icon">💬</span>
                <span className="action-label">Message</span>
                <span className="action-tooltip">Ask anything. Your AI will reply instantly.</span>
              </motion.button>

              <motion.button
                className="action-button voice"
                onClick={() => handleActionSelect('voice')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="action-icon">🎙️</span>
                <span className="action-label">Converse</span>
                <span className="action-tooltip">Start a real-time voice session with this agent.</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
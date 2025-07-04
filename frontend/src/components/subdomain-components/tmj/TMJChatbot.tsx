import React, { useEffect } from 'react'
import {
  Fab,
} from '@mui/material'
import { 
  Chat, 
} from '@mui/icons-material'
import { motion, AnimatePresence } from 'framer-motion'
import { useChatStore } from '../../../chatbot/store/chatStore'
import { trackChatOpen, trackEvent } from '../../../utils/analytics'

interface TMJChatbotProps {
  contact: {
    phone: string
    email: string
    address: string
    hours: {
      weekdays: string
      saturday: string
      sunday: string
    }
  }
}

const TMJChatbot: React.FC<TMJChatbotProps> = ({ contact }) => {
  const { isOpen, toggleChat, sendMessage } = useChatStore()

  const handleChatOpen = async () => {
    // Track TMJ chat engagement
    trackChatOpen('tmj-floating-button')
    trackEvent({
      action: 'julie_chat_open',
      category: 'tmj',
      label: 'floating_button'
    })
    
    // Open Julie
    toggleChat()
    
    // If chat wasn't open before, send TMJ context
    if (!isOpen) {
      setTimeout(async () => {
        await sendMessage("I'm experiencing TMJ symptoms and need consultation")
      }, 500)
    }
  }

  return (
    <>
      {/* Floating Chat Button - Only show when Julie is not open */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            style={{
              position: 'fixed',
              bottom: 24,
              right: 24,
              zIndex: 1000
            }}
          >
            <Fab
              color="primary"
              size="large"
              onClick={handleChatOpen}
              sx={{
                boxShadow: '0 4px 20px rgba(44, 85, 48, 0.3)',
                '&:hover': {
                  transform: 'scale(1.1)',
                  boxShadow: '0 6px 25px rgba(44, 85, 48, 0.4)',
                }
              }}
            >
              <Chat sx={{ fontSize: '1.5rem' }} />
            </Fab>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default TMJChatbot

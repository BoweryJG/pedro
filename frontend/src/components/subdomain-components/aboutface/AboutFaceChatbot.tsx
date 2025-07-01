import React, { useState, useRef, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  TextField, 
  Typography, 
  IconButton, 
  Fab, 
  Dialog,
  DialogContent,
  Chip,
  Avatar
} from '@mui/material';
import {
  Chat as ChatIcon,
  Close as CloseIcon,
  Send as SendIcon,
  AutoAwesome as AutoAwesomeIcon,
  Schedule as ScheduleIcon,
  AttachMoney as AttachMoneyIcon,
  Phone as PhoneIcon,
  Visibility as VisibilityIcon,
  TrendingUp as TrendingUpIcon,
  SelfImprovement as SelfImprovementIcon
} from '@mui/icons-material';
import { styled, keyframes } from '@mui/material/styles';

// Animation keyframes
const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const float = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
`;

// Styled components
const ChatFab = styled(Fab)(() => ({
  position: 'fixed',
  bottom: 24,
  right: 24,
  background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 50%, #6D28D9 100%)',
  color: 'white',
  zIndex: 1300,
  width: 64,
  height: 64,
  boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3)',
  animation: `${float} 3s ease-in-out infinite`,
  '&:hover': {
    background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 50%, #5B21B6 100%)',
    transform: 'scale(1.1)',
    boxShadow: '0 12px 40px rgba(139, 92, 246, 0.4)',
  },
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
}));

const ChatDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    position: 'fixed',
    bottom: 100,
    right: 24,
    margin: 0,
    width: 380,
    height: 600,
    maxWidth: 'calc(100vw - 48px)',
    maxHeight: 'calc(100vh - 150px)',
    borderRadius: 24,
    overflow: 'hidden',
    background: 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(139, 92, 246, 0.1)',
    boxShadow: '0 24px 80px rgba(0,0,0,0.12), 0 0 0 1px rgba(139, 92, 246, 0.05)',
    animation: `${fadeIn} 0.3s cubic-bezier(0.4, 0, 0.2, 1)`,
  },
  [theme.breakpoints.down('sm')]: {
    '& .MuiDialog-paper': {
      width: 'calc(100vw - 32px)',
      height: 'calc(100vh - 120px)',
      bottom: 16,
      right: 16,
    },
  },
}));

const ChatHeader = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 50%, #6D28D9 100%)',
  color: 'white',
  padding: theme.spacing(2.5),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="7" cy="7" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
  },
  zIndex: 1,
}));

const MessageContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  overflowY: 'auto',
  padding: theme.spacing(1),
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(1),
  background: 'linear-gradient(180deg, rgba(248,250,252,0.5) 0%, rgba(255,255,255,0.3) 100%)',
  '&::-webkit-scrollbar': {
    width: 6,
  },
  '&::-webkit-scrollbar-track': {
    background: 'rgba(0,0,0,0.05)',
    borderRadius: 3,
  },
  '&::-webkit-scrollbar-thumb': {
    background: 'rgba(139, 92, 246, 0.3)',
    borderRadius: 3,
    '&:hover': {
      background: 'rgba(139, 92, 246, 0.5)',
    },
  },
}));

const MessageBubble = styled(Paper)<{ isUser: boolean }>(({ theme, isUser }) => ({
  padding: theme.spacing(1.5, 2),
  maxWidth: '85%',
  alignSelf: isUser ? 'flex-end' : 'flex-start',
  background: isUser 
    ? 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)'
    : 'rgba(255, 255, 255, 0.9)',
  color: isUser ? 'white' : theme.palette.text.primary,
  borderRadius: isUser ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
  boxShadow: isUser 
    ? '0 4px 20px rgba(139, 92, 246, 0.3)' 
    : '0 2px 12px rgba(0,0,0,0.08)',
  border: isUser ? 'none' : '1px solid rgba(0,0,0,0.06)',
  animation: `${fadeIn} 0.3s ease-out`,
  position: 'relative',
  backdropFilter: 'blur(10px)',
}));

const InputContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  background: 'rgba(255, 255, 255, 0.8)',
  backdropFilter: 'blur(20px)',
  borderTop: '1px solid rgba(139, 92, 246, 0.1)',
  display: 'flex',
  gap: theme.spacing(1),
  alignItems: 'flex-end',
}));

const StyledTextField = styled(TextField)(() => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 24,
    background: 'rgba(255, 255, 255, 0.9)',
    border: '1px solid rgba(139, 92, 246, 0.2)',
    transition: 'all 0.3s ease',
    '&:hover': {
      border: '1px solid rgba(139, 92, 246, 0.4)',
      boxShadow: '0 4px 20px rgba(139, 92, 246, 0.1)',
    },
    '&.Mui-focused': {
      border: '1px solid #8B5CF6',
      boxShadow: '0 4px 20px rgba(139, 92, 246, 0.2)',
    },
    '& fieldset': {
      border: 'none',
    },
  },
}));

const SendButton = styled(IconButton)(() => ({
  background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
  color: 'white',
  width: 48,
  height: 48,
  borderRadius: '50%',
  boxShadow: '0 4px 16px rgba(139, 92, 246, 0.3)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)',
    transform: 'scale(1.1)',
    boxShadow: '0 6px 24px rgba(139, 92, 246, 0.4)',
  },
  '&:disabled': {
    background: 'rgba(0,0,0,0.12)',
    color: 'rgba(0,0,0,0.26)',
    transform: 'none',
    boxShadow: 'none',
  },
}));

// Types
interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  quickActions?: QuickAction[];
}

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactElement;
  action: () => void;
}

const AboutFaceChatbot: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (open && messages.length === 0) {
      // Welcome message
      setTimeout(() => {
        addBotMessage(
          "✨ Welcome to AboutFace Aesthetics! I'm here to help you discover the revolutionary EMFACE technology for non-invasive facial rejuvenation. How can I assist you today?",
          getWelcomeQuickActions()
        );
      }, 500);
    }
  }, [open]);

  const addMessage = (text: string, isUser: boolean, quickActions?: QuickAction[]) => {
    const message: Message = {
      id: Date.now().toString(),
      text,
      isUser,
      timestamp: new Date(),
      quickActions: quickActions || []
    };
    setMessages(prev => [...prev, message]);
  };

  const addBotMessage = (text: string, quickActions?: QuickAction[]) => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      addMessage(text, false, quickActions);
    }, 1500);
  };

  const getWelcomeQuickActions = (): QuickAction[] => [
    {
      id: 'emface-info',
      label: 'What is EMFACE?',
      icon: <AutoAwesomeIcon />,
      action: () => handleEMFACEInfo()
    },
    {
      id: 'treatment-options',
      label: 'Treatment Options',
      icon: <VisibilityIcon />,
      action: () => handleTreatmentOptions()
    },
    {
      id: 'book-consultation',
      label: 'Book Consultation',
      icon: <ScheduleIcon />,
      action: () => handleBookConsultation()
    },
    {
      id: 'pricing',
      label: 'Pricing Information',
      icon: <AttachMoneyIcon />,
      action: () => handlePricing()
    }
  ];

  const handleEMFACEInfo = () => {
    addMessage("What is EMFACE?", true);
    addBotMessage(
      "🌟 EMFACE is the world's first and only needle-free procedure that simultaneously treats facial skin and muscles!\n\n✨ Key Benefits:\n• Lifts and tones facial muscles\n• Reduces wrinkles and fine lines\n• Improves skin texture and firmness\n• No downtime required\n• FDA-cleared technology\n\nEMFACE uses synchronized RF (radiofrequency) and HIFES (High-Intensity Facial Electromagnetic Stimulation) energies to remodel and smooth your skin while toning your facial muscles.",
      [
        {
          id: 'how-it-works',
          label: 'How It Works',
          icon: <SelfImprovementIcon />,
          action: () => handleHowItWorks()
        },
        {
          id: 'results',
          label: 'Expected Results',
          icon: <TrendingUpIcon />,
          action: () => handleResults()
        }
      ]
    );
  };

  const handleHowItWorks = () => {
    addMessage("How does EMFACE work?", true);
    addBotMessage(
      "🔬 EMFACE Technology Explained:\n\n🎯 **Dual-Energy System:**\n• RF Energy: Heats tissue to stimulate collagen production\n• HIFES Energy: Contracts facial muscles for toning\n\n⚡ **Treatment Process:**\n1. Comfortable positioning with specialized applicators\n2. 20-minute session targeting key facial areas\n3. Synchronized energy delivery for optimal results\n4. No needles, no surgery, no downtime",
      [
        {
          id: 'consultation',
          label: 'Book Consultation',
          icon: <ScheduleIcon />,
          action: () => handleBookConsultation()
        }
      ]
    );
  };

  const handleResults = () => {
    addMessage("What results can I expect?", true);
    addBotMessage(
      "📈 **EMFACE Results Timeline:**\n\n🌟 **Immediate (After 1st Session):**\n• Skin feels tighter and refreshed\n• Subtle lifting sensation\n\n✨ **2-3 Weeks:**\n• Noticeable improvement in skin texture\n• Enhanced facial contours\n• Reduced fine lines\n\n🏆 **4-6 Weeks (Peak Results):**\n• 23% increase in muscle tone\n• 30% more collagen production\n• Significant wrinkle reduction\n• Enhanced facial definition",
      [
        {
          id: 'consultation',
          label: 'Book Consultation',
          icon: <ScheduleIcon />,
          action: () => handleBookConsultation()
        }
      ]
    );
  };

  const handleTreatmentOptions = () => {
    addMessage("What treatment options are available?", true);
    addBotMessage(
      "🎨 **AboutFace EMFACE Packages:**\n\n💎 **Signature Series (Most Popular)**\n• 4 treatments over 2 weeks\n• Comprehensive facial rejuvenation\n• Best value for optimal results\n\n⭐ **Express Refresh**\n• Single treatment session\n• Perfect for special events\n• Quick facial enhancement\n\n🏆 **VIP Total Transformation**\n• 6 treatments + maintenance plan\n• Maximum results package\n• Priority booking and concierge service",
      [
        {
          id: 'pricing',
          label: 'View Pricing',
          icon: <AttachMoneyIcon />,
          action: () => handlePricing()
        },
        {
          id: 'consultation',
          label: 'Book Consultation',
          icon: <ScheduleIcon />,
          action: () => handleBookConsultation()
        }
      ]
    );
  };

  const handlePricing = () => {
    addMessage("What does EMFACE cost?", true);
    addBotMessage(
      "💰 **AboutFace EMFACE Pricing:**\n\n🌟 **Signature Series**\n• 4 treatments: $2,400\n• Save $400 vs individual sessions\n• Most comprehensive results\n\n⚡ **Express Refresh**\n• Single session: $700\n• Perfect for maintenance or trials\n\n🏆 **VIP Total Transformation**\n• 6 treatments + extras: $3,200\n• Premium package with concierge service\n\n💳 **Financing Available:**\n• 0% APR for qualified candidates\n• Monthly payment plans starting at $99\n• CareCredit accepted",
      [
        {
          id: 'consultation',
          label: 'Book Consultation',
          icon: <ScheduleIcon />,
          action: () => handleBookConsultation()
        },
        {
          id: 'financing',
          label: 'Financing Options',
          icon: <AttachMoneyIcon />,
          action: () => handleFinancing()
        }
      ]
    );
  };

  const handleFinancing = () => {
    addMessage("Tell me about financing options", true);
    addBotMessage(
      "💳 **Flexible Payment Solutions:**\n\n🏦 **CareCredit Healthcare Financing**\n• 0% APR for 6-24 months (qualified applicants)\n• Quick online approval process\n• No prepayment penalties\n\n💰 **In-House Payment Plans**\n• Split payments over treatment period\n• No credit check required\n• Flexible scheduling\n\n🎯 **Monthly Options:**\n• Signature Series: $200/month x 12 months\n• Express treatments: Pay-per-session\n• VIP packages: Custom payment schedules",
      [
        {
          id: 'consultation',
          label: 'Book Consultation',
          icon: <ScheduleIcon />,
          action: () => handleBookConsultation()
        }
      ]
    );
  };

  const handleBookConsultation = () => {
    addMessage("I'd like to book a consultation", true);
    addBotMessage(
      "📅 **Free EMFACE Consultation:**\n\n✨ **What's Included:**\n• Comprehensive facial analysis\n• Personalized treatment plan\n• Technology demonstration\n• Pricing and financing discussion\n• No-pressure environment\n\n🕐 **Available Times:**\n• Monday-Friday: 9 AM - 6 PM\n• Saturday: 9 AM - 4 PM\n• Same-day appointments often available\n\n📞 **Book Your Consultation:**\n• Call/Text: (555) 123-FACE\n• Online booking available\n• Virtual consultations available",
      [
        {
          id: 'call-now',
          label: 'Call Now',
          icon: <PhoneIcon />,
          action: () => handleCallNow()
        },
        {
          id: 'book-online',
          label: 'Book Online',
          icon: <ScheduleIcon />,
          action: () => handleBookOnline()
        }
      ]
    );
  };

  const handleCallNow = () => {
    addMessage("I want to call now", true);
    addBotMessage(
      "📞 **Call AboutFace Aesthetics Now:**\n\n🔢 **Direct Line:** (555) 123-FACE\n📱 **Text Us:** Same number for quick questions\n\n🕐 **Office Hours:**\n• Monday-Friday: 9 AM - 6 PM\n• Saturday: 9 AM - 4 PM\n• Sunday: Closed\n\n⚡ **When You Call:**\n• Mention you're interested in EMFACE\n• Ask about new patient specials\n• Request earliest consultation availability\n• Inquire about financing options",
      []
    );
  };

  const handleBookOnline = () => {
    addMessage("How do I book online?", true);
    addBotMessage(
      "💻 **Online Booking Made Easy:**\n\n🌐 **Booking Portal:**\n• Visit: www.aboutfaceaesthetics.com/book\n• Available 24/7 for your convenience\n• Real-time appointment availability\n• Instant confirmation\n\n📱 **Mobile Friendly:**\n• Works on any device\n• Quick 2-minute booking process\n• Automatic calendar sync\n• Text/email reminders\n\n🎁 **Online Exclusive:**\n• 5% additional discount for online bookings\n• Priority scheduling for new patients",
      []
    );
  };

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      addMessage(inputValue, true);
      setInputValue('');
      
      // Simple bot response based on input
      setTimeout(() => {
        addBotMessage(
          "Thank you for your message! For personalized information about EMFACE treatments, I'd recommend booking a consultation where our experts can provide detailed answers specific to your needs.",
          [
            {
              id: 'book-consultation',
              label: 'Book Consultation',
              icon: <ScheduleIcon />,
              action: () => handleBookConsultation()
            },
            {
              id: 'more-questions',
              label: 'Ask Another Question',
              icon: <AutoAwesomeIcon />,
              action: () => {}
            }
          ]
        );
      }, 1000);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const QuickActionChips = ({ actions }: { actions: QuickAction[] }) => (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
      {actions.map((action) => (
        <Chip
          key={action.id}
          label={action.label}
          icon={action.icon || undefined}
          onClick={action.action}
          sx={{
            background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',
            color: 'white',
            '&:hover': {
              background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)',
              transform: 'translateY(-2px)',
            },
            transition: 'all 0.2s ease',
            borderRadius: '20px',
            fontSize: '0.75rem',
            height: 28,
          }}
        />
      ))}
    </Box>
  );

  return (
    <>
      <ChatFab onClick={() => setOpen(true)}>
        <ChatIcon sx={{ fontSize: 28 }} />
      </ChatFab>

      <ChatDialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth={false}
        hideBackdrop
      >
        <DialogContent sx={{ p: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
          <ChatHeader>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, position: 'relative', zIndex: 2 }}>
              <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 40, height: 40 }}>
                <AutoAwesomeIcon />
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1.1rem' }}>
                  AboutFace Assistant
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, fontSize: '0.85rem' }}>
                  EMFACE Specialist • Online Now
                </Typography>
              </Box>
            </Box>
            <IconButton 
              onClick={() => setOpen(false)} 
              sx={{ 
                color: 'rgba(255,255,255,0.8)', 
                '&:hover': { 
                  color: 'white', 
                  bgcolor: 'rgba(255,255,255,0.1)' 
                },
                position: 'relative',
                zIndex: 2
              }}
            >
              <CloseIcon />
            </IconButton>
          </ChatHeader>

          <MessageContainer>
            {messages.map((message) => (
              <Box key={message.id}>
                <MessageBubble isUser={message.isUser}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      whiteSpace: 'pre-line',
                      lineHeight: 1.4,
                      fontSize: '0.9rem'
                    }}
                  >
                    {message.text}
                  </Typography>
                  {message.quickActions && message.quickActions.length > 0 && (
                    <QuickActionChips actions={message.quickActions} />
                  )}
                </MessageBubble>
              </Box>
            ))}
            
            {isTyping && (
              <MessageBubble isUser={false}>
                <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ mr: 1 }}>Typing</Typography>
                  <Box sx={{ display: 'flex', gap: 0.3 }}>
                    {[0, 1, 2].map((i) => (
                      <Box
                        key={i}
                        sx={{
                          width: 4,
                          height: 4,
                          bgcolor: 'text.secondary',
                          borderRadius: '50%',
                          animation: `${pulse} 1.4s ease-in-out infinite`,
                          animationDelay: `${i * 0.2}s`,
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              </MessageBubble>
            )}
            
            <div ref={messagesEndRef} />
          </MessageContainer>

          <InputContainer>
            <StyledTextField
              fullWidth
              multiline
              maxRows={3}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask about EMFACE treatments..."
              variant="outlined"
              size="small"
            />
            <SendButton 
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
            >
              <SendIcon />
            </SendButton>
          </InputContainer>
        </DialogContent>
      </ChatDialog>
    </>
  );
};

export default AboutFaceChatbot;

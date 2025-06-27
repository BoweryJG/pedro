\nimport React, { useState, useRef, useEffect } from 'react';\nimport { \n  Box, \n  Paper, \n  TextField, \n  Button, \n  Typography, \n  IconButton, \n  Fab, \n  Dialog,\n  DialogContent,\n  Chip,\n  Avatar,\n  Divider,\n  Collapse,\n  Card,\n  CardContent,\n  List,\n  ListItem,\n  ListItemText,\n  ListItemIcon,\n  Tooltip,\n  LinearProgress\n} from '@mui/material';\nimport {\n  Chat as ChatIcon,\n  Close as CloseIcon,\n  Send as SendIcon,\n  AutoAwesome as AutoAwesomeIcon,\n  Face as FaceIcon,\n  Schedule as ScheduleIcon,\n  AttachMoney as AttachMoneyIcon,\n  Phone as PhoneIcon,\n  Email as EmailIcon,\n  LocationOn as LocationIcon,\n  Star as StarIcon,\n  Visibility as VisibilityIcon,\n  Security as SecurityIcon,\n  TrendingUp as TrendingUpIcon,\n  SelfImprovement as SelfImprovementIcon\n} from '@mui/icons-material';\nimport { styled, keyframes } from '@mui/material/styles';\n\n// Animation keyframes\nconst pulse = keyframes`\n  0% { transform: scale(1); }\n  50% { transform: scale(1.05); }\n  100% { transform: scale(1); }\n`;\n\nconst fadeIn = keyframes`\n  from { opacity: 0; transform: translateY(20px); }\n  to { opacity: 1; transform: translateY(0); }\n`;\n\nconst float = keyframes`\n  0%, 100% { transform: translateY(0px); }\n  50% { transform: translateY(-10px); }\n`;\n\n// Styled components\nconst ChatFab = styled(Fab)(({ theme }) => ({\n  position: 'fixed',\n  bottom: 24,\n  right: 24,\n  background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 50%, #6D28D9 100%)',\n  color: 'white',\n  zIndex: 1300,\n  width: 64,\n  height: 64,\n  boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3)',\n  animation: `${float} 3s ease-in-out infinite`,\n  '&:hover': {\n    background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 50%, #5B21B6 100%)',\n    transform: 'scale(1.1)',\n    boxShadow: '0 12px 40px rgba(139, 92, 246, 0.4)',\n  },\n  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',\n}));\n\nconst ChatDialog = styled(Dialog)(({ theme }) => ({\n  '& .MuiDialog-paper': {\n    position: 'fixed',\n    bottom: 100,\n    right: 24,\n    margin: 0,\n    width: 380,\n    height: 600,\n    maxWidth: 'calc(100vw - 48px)',\n    maxHeight: 'calc(100vh - 150px)',\n    borderRadius: 24,\n    overflow: 'hidden',\n    background: 'linear-gradient(145deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)',\n    backdropFilter: 'blur(20px)',\n    border: '1px solid rgba(139, 92, 246, 0.1)',\n    boxShadow: '0 24px 80px rgba(0,0,0,0.12), 0 0 0 1px rgba(139, 92, 246, 0.05)',\n    animation: `${fadeIn} 0.3s cubic-bezier(0.4, 0, 0.2, 1)`,\n  },\n  [theme.breakpoints.down('sm')]: {\n    '& .MuiDialog-paper': {\n      width: 'calc(100vw - 32px)',\n      height: 'calc(100vh - 120px)',\n      bottom: 16,\n      right: 16,\n    },\n  },\n}));\n\nconst ChatHeader = styled(Box)(({ theme }) => ({\n  background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 50%, #6D28D9 100%)',\n  color: 'white',\n  padding: theme.spacing(2.5),\n  display: 'flex',\n  alignItems: 'center',\n  justifyContent: 'space-between',\n  position: 'relative',\n  overflow: 'hidden',\n  '&::before': {\n    content: '\"\"',\n    position: 'absolute',\n    top: 0,\n    left: 0,\n    right: 0,\n    bottom: 0,\n    background: 'url(\"data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.05\"%3E%3Ccircle cx=\"7\" cy=\"7\" r=\"1\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")',\n  },\n  zIndex: 1,\n}));\n\nconst MessageContainer = styled(Box)(({ theme }) => ({\n  flex: 1,\n  overflowY: 'auto',\n  padding: theme.spacing(1),\n  display: 'flex',\n  flexDirection: 'column',\n  gap: theme.spacing(1),\n  background: 'linear-gradient(180deg, rgba(248,250,252,0.5) 0%, rgba(255,255,255,0.3) 100%)',\n  '&::-webkit-scrollbar': {\n    width: 6,\n  },\n  '&::-webkit-scrollbar-track': {\n    background: 'rgba(0,0,0,0.05)',\n    borderRadius: 3,\n  },\n  '&::-webkit-scrollbar-thumb': {\n    background: 'rgba(139, 92, 246, 0.3)',\n    borderRadius: 3,\n    '&:hover': {\n      background: 'rgba(139, 92, 246, 0.5)',\n    },\n  },\n}));\n\nconst MessageBubble = styled(Paper)<{ isUser: boolean }>(({ theme, isUser }) => ({\n  padding: theme.spacing(1.5, 2),\n  maxWidth: '85%',\n  alignSelf: isUser ? 'flex-end' : 'flex-start',\n  background: isUser \n    ? 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)'\n    : 'rgba(255, 255, 255, 0.9)',\n  color: isUser ? 'white' : theme.palette.text.primary,\n  borderRadius: isUser ? '20px 20px 4px 20px' : '20px 20px 20px 4px',\n  boxShadow: isUser \n    ? '0 4px 20px rgba(139, 92, 246, 0.3)' \n    : '0 2px 12px rgba(0,0,0,0.08)',\n  border: isUser ? 'none' : '1px solid rgba(0,0,0,0.06)',\n  animation: `${fadeIn} 0.3s ease-out`,\n  position: 'relative',\n  backdropFilter: 'blur(10px)',\n}));\n\nconst InputContainer = styled(Box)(({ theme }) => ({\n  padding: theme.spacing(2),\n  background: 'rgba(255, 255, 255, 0.8)',\n  backdropFilter: 'blur(20px)',\n  borderTop: '1px solid rgba(139, 92, 246, 0.1)',\n  display: 'flex',\n  gap: theme.spacing(1),\n  alignItems: 'flex-end',\n}));\n\nconst StyledTextField = styled(TextField)(({ theme }) => ({\n  '& .MuiOutlinedInput-root': {\n    borderRadius: 24,\n    background: 'rgba(255, 255, 255, 0.9)',\n    border: '1px solid rgba(139, 92, 246, 0.2)',\n    transition: 'all 0.3s ease',\n    '&:hover': {\n      border: '1px solid rgba(139, 92, 246, 0.4)',\n      boxShadow: '0 4px 20px rgba(139, 92, 246, 0.1)',\n    },\n    '&.Mui-focused': {\n      border: '1px solid #8B5CF6',\n      boxShadow: '0 4px 20px rgba(139, 92, 246, 0.2)',\n    },\n    '& fieldset': {\n      border: 'none',\n    },\n  },\n}));\n\nconst SendButton = styled(IconButton)(({ theme }) => ({\n  background: 'linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%)',\n  color: 'white',\n  width: 48,\n  height: 48,\n  borderRadius: '50%',\n  boxShadow: '0 4px 16px rgba(139, 92, 246, 0.3)',\n  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',\n  '&:hover': {\n    background: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)',\n    transform: 'scale(1.1)',\n    boxShadow: '0 6px 24px rgba(139, 92, 246, 0.4)',\n  },\n  '&:disabled': {\n    background: 'rgba(0,0,0,0.12)',\n    color: 'rgba(0,0,0,0.26)',\n    transform: 'none',\n    boxShadow: 'none',\n  },\n}));\n\n// Types\ninterface Message {\n  id: string;\n  text: string;\n  isUser: boolean;\n  timestamp: Date;\n  quickActions?: QuickAction[];\n}\n\ninterface QuickAction {\n  id: string;\n  label: string;\n  icon: React.ReactNode;\n  action: () => void;\n}\n\nconst AboutFaceChatbot: React.FC = () => {\n  const [open, setOpen] = useState(false);\n  const [messages, setMessages] = useState<Message[]>([]);\n  const [inputValue, setInputValue] = useState('');\n  const [isTyping, setIsTyping] = useState(false);\n  const [showQuickActions, setShowQuickActions] = useState(true);\n  const messagesEndRef = useRef<HTMLDivElement>(null);\n\n  const scrollToBottom = () => {\n    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });\n  };\n\n  useEffect(() => {\n    scrollToBottom();\n  }, [messages]);\n\n  useEffect(() => {\n    if (open && messages.length === 0) {\n      // Welcome message\n      setTimeout(() => {\n        addBotMessage(\n          \"✨ Welcome to AboutFace Aesthetics! I'm here to help you discover the revolutionary EMFACE technology for non-invasive facial rejuvenation. How can I assist you today?\",\n          getWelcomeQuickActions()\n        );\n      }, 500);\n    }\n  }, [open]);\n\n  const addMessage = (text: string, isUser: boolean, quickActions?: QuickAction[]) => {\n    const message: Message = {\n      id: Date.now().toString(),\n      text,\n      isUser,\n      timestamp: new Date(),\n      quickActions: quickActions || []\n    };\n    setMessages(prev => [...prev, message]);\n  };\n\n  const addBotMessage = (text: string, quickActions?: QuickAction[]) => {\n    setIsTyping(true);\n    setTimeout(() => {\n      setIsTyping(false);\n      addMessage(text, false, quickActions);\n      setShowQuickActions(!!quickActions?.length);\n    }, 1500);\n  };\n\n  const getWelcomeQuickActions = (): QuickAction[] => [\n    {\n      id: 'emface-info',\n      label: 'What is EMFACE?',\n      icon: <AutoAwesomeIcon />,\n      action: () => handleEMFACEInfo()\n    },\n    {\n      id: 'treatment-options',\n      label: 'Treatment Options',\n      icon: <VisibilityIcon />,\n      action: () => handleTreatmentOptions()\n    },\n    {\n      id: 'book-consultation',\n      label: 'Book Consultation',\n      icon: <ScheduleIcon />,\n      action: () => handleBookConsultation()\n    },\n    {\n      id: 'pricing',\n      label: 'Pricing Information',\n      icon: <AttachMoneyIcon />,\n      action: () => handlePricing()\n    }\n  ];\n\n  const handleEMFACEInfo = () => {\n    addMessage(\"What is EMFACE?\", true);\n    addBotMessage(\n      \"🌟 EMFACE is the world's first and only needle-free procedure that simultaneously treats facial skin and muscles!\\n\\n✨ Key Benefits:\\n• Lifts and tones facial muscles\\n• Reduces wrinkles and fine lines\\n• Improves skin texture and firmness\\n• No downtime required\\n• FDA-cleared technology\\n\\nEMFACE uses synchronized RF (radiofrequency) and HIFES (High-Intensity Facial Electromagnetic Stimulation) energies to remodel and smooth your skin while toning your facial muscles.\",\n      [\n        {\n          id: 'how-it-works'
,
          label: 'How It Works',
          icon: <SelfImprovementIcon />,
          action: () => handleHowItWorks()
        },
        {
          id: 'results',
          label: 'Expected Results',
          icon: <TrendingUpIcon />,
          action: () => handleResults()
        },
        {
          id: 'safety',
          label: 'Safety & Side Effects',
          icon: <SecurityIcon />,
          action: () => handleSafety()
        }
      ]
    );
  };

  const handleHowItWorks = () => {
    addMessage("How does EMFACE work?", true);
    addBotMessage(
      "🔬 EMFACE Technology Explained:\n\n🎯 **Dual-Energy System:**\n• RF Energy: Heats tissue to stimulate collagen production\n• HIFES Energy: Contracts facial muscles for toning\n\n⚡ **Treatment Process:**\n1. Comfortable positioning with specialized applicators\n2. 20-minute session targeting key facial areas\n3. Synchronized energy delivery for optimal results\n4. No needles, no surgery, no downtime\n\n🎪 **Treatment Areas:**\n• Forehead and brow lift\n• Cheek enhancement\n• Jawline definition\n• Overall facial tightening",
      [
        {
          id: 'treatment-schedule',
          label: 'Treatment Schedule',
          icon: <ScheduleIcon />,
          action: () => handleTreatmentSchedule()
        },
        {
          id: 'candidate',
          label: 'Am I a Candidate?',
          icon: <FaceIcon />,
          action: () => handleCandidate()
        }
      ]
    );
  };

  const handleResults = () => {
    addMessage("What results can I expect?", true);
    addBotMessage(
      "📈 **EMFACE Results Timeline:**\n\n🌟 **Immediate (After 1st Session):**\n• Skin feels tighter and refreshed\n• Subtle lifting sensation\n\n✨ **2-3 Weeks:**\n• Noticeable improvement in skin texture\n• Enhanced facial contours\n• Reduced fine lines\n\n🏆 **4-6 Weeks (Peak Results):**\n• 23% increase in muscle tone\n• 30% more collagen production\n• Significant wrinkle reduction\n• Enhanced facial definition\n\n💫 **Long-term Benefits:**\n• Results continue improving for 3-6 months\n• Effects last 12+ months with maintenance",
      [
        {
          id: 'before-after',
          label: 'View Before/After',
          icon: <VisibilityIcon />,
          action: () => handleBeforeAfter()
        },
        {
          id: 'maintenance',
          label: 'Maintenance Plan',
          icon: <StarIcon />,
          action: () => handleMaintenance()
        }
      ]
    );
  };

  const handleSafety = () => {
    addMessage("Is EMFACE safe? Any side effects?", true);
    addBotMessage(
      "🛡️ **EMFACE Safety Profile:**\n\n✅ **FDA-Cleared Technology**\n• Extensively tested and approved\n• Non-invasive and comfortable\n• No anesthesia required\n\n🔒 **Minimal Side Effects:**\n• Mild redness (resolves within hours)\n• Slight tingling sensation during treatment\n• No bruising or swelling\n• Return to activities immediately\n\n⚠️ **Contraindications:**\n• Pregnancy or breastfeeding\n• Metal implants in treatment area\n• Active skin conditions\n• Pacemaker or electronic devices\n\nOur certified practitioners ensure your safety and comfort throughout the entire process.",
      [
        {
          id: 'consultation',
          label: 'Free Consultation',
          icon: <ScheduleIcon />,
          action: () => handleBookConsultation()
        },
        {
          id: 'preparation',
          label: 'Treatment Prep',
          icon: <SelfImprovementIcon />,
          action: () => handlePreparation()
        }
      ]
    );
  };

  const handleTreatmentOptions = () => {
    addMessage("What treatment options are available?", true);
    addBotMessage(
      "🎨 **AboutFace EMFACE Packages:**\n\n💎 **Signature Series (Most Popular)**\n• 4 treatments over 2 weeks\n• Comprehensive facial rejuvenation\n• Best value for optimal results\n\n⭐ **Express Refresh**\n• Single treatment session\n• Perfect for special events\n• Quick facial enhancement\n\n🏆 **VIP Total Transformation**\n• 6 treatments + maintenance plan\n• Maximum results package\n• Priority booking and concierge service\n\n🌟 **Maintenance Program**\n• Quarterly touch-up sessions\n• Sustain your results long-term\n• Member pricing benefits",
      [
        {
          id: 'pricing',
          label: 'View Pricing',
          icon: <AttachMoneyIcon />,
          action: () => handlePricing()
        },
        {
          id: 'customization',
          label: 'Custom Plan',
          icon: <AutoAwesomeIcon />,
          action: () => handleCustomization()
        }
      ]
    );
  };

  const handlePricing = () => {
    addMessage("What does EMFACE cost?", true);
    addBotMessage(
      "💰 **AboutFace EMFACE Pricing:**\n\n🌟 **Signature Series**\n• 4 treatments: $2,400\n• Save $400 vs individual sessions\n• Most comprehensive results\n\n⚡ **Express Refresh**\n• Single session: $700\n• Perfect for maintenance or trials\n\n🏆 **VIP Total Transformation**\n• 6 treatments + extras: $3,200\n• Premium package with concierge service\n\n💳 **Financing Available:**\n• 0% APR for qualified candidates\n• Monthly payment plans starting at $99\n• CareCredit accepted\n\n🎁 **Special Promotions:**\n• New patient discount: 15% off first package\n• Refer a friend: $200 credit each",
      [
        {
          id: 'financing',
          label: 'Financing Options',
          icon: <AttachMoneyIcon />,
          action: () => handleFinancing()
        },
        {
          id: 'promotions',
          label: 'Current Specials',
          icon: <StarIcon />,
          action: () => handlePromotions()
        },
        {
          id: 'book-now',
          label: 'Book Consultation',
          icon: <ScheduleIcon />,
          action: () => handleBookConsultation()
        }
      ]
    );
  };

  const handleFinancing = () => {
    addMessage("Tell me about financing options", true);
    addBotMessage(
      "💳 **Flexible Payment Solutions:**\n\n🏦 **CareCredit Healthcare Financing**\n• 0% APR for 6-24 months (qualified applicants)\n• Quick online approval process\n• No prepayment penalties\n\n💰 **In-House Payment Plans**\n• Split payments over treatment period\n• No credit check required\n• Flexible scheduling\n\n🎯 **Monthly Options:**\n• Signature Series: $200/month x 12 months\n• Express treatments: Pay-per-session\n• VIP packages: Custom payment schedules\n\n✨ **Benefits:**\n• Start treatments immediately\n• Budget-friendly monthly payments\n• No hidden fees or interest (qualified plans)",
      [
        {
          id: 'apply-financing',
          label: 'Apply for Financing',
          icon: <AttachMoneyIcon />,
          action: () => handleApplyFinancing()
        },
        {
          id: 'payment-calculator',
          label: 'Payment Calculator',
          icon: <AutoAwesomeIcon />,
          action: () => handlePaymentCalculator()
        }
      ]
    );
  };

  const handlePromotions = () => {
    addMessage("What current specials do you have?", true);
    addBotMessage(
      "🎉 **Limited-Time Offers:**\n\n🌟 **New Patient Special**\n• 15% off your first EMFACE package\n• Complimentary skin analysis\n• Valid through this month\n\n👥 **Refer-a-Friend Program**\n• $200 credit for you and your friend\n• Unlimited referrals\n• Credits never expire\n\n💎 **VIP Membership Benefits**\n• 20% off all treatments\n• Priority booking\n• Exclusive member events\n• Birthday month special treatments\n\n🎁 **Seasonal Promotions**\n• Holiday packages available\n• Gift certificates with bonus value\n• Follow us on social media for flash sales!",
      [
        {
          id: 'claim-offer',
          label: 'Claim New Patient Special',
          icon: <StarIcon />,
          action: () => handleClaimOffer()
        },
        {
          id: 'vip-membership',
          label: 'VIP Membership Info',
          icon: <AutoAwesomeIcon />,
          action: () => handleVIPMembership()
        }
      ]
    );
  };

  const handleBookConsultation = () => {
    addMessage("I'd like to book a consultation", true);
    addBotMessage(
      "📅 **Free EMFACE Consultation:**\n\n✨ **What's Included:**\n• Comprehensive facial analysis\n• Personalized treatment plan\n• Technology demonstration\n• Pricing and financing discussion\n• No-pressure environment\n\n🕐 **Available Times:**\n• Monday-Friday: 9 AM - 6 PM\n• Saturday: 9 AM - 4 PM\n• Same-day appointments often available\n\n📍 **AboutFace Aesthetics Location:**\n• 123 Medical Plaza Drive\n• Suite 456, Medical District\n• Convenient parking available\n\n📞 **Book Your Consultation:**\n• Call/Text: (555) 123-FACE\n• Online booking available\n• Virtual consultations available",
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
        },
        {
          id: 'virtual-consult',
          label: 'Virtual Consultation',
          icon: <VisibilityIcon />,
          action: () => handleVirtualConsult()
        }
      ]
    );
  };

  const handleTreatmentSchedule = () => {
    addMessage("What's the treatment schedule like?", true);
    addBotMessage(
      "📅 **EMFACE Treatment Timeline:**\n\n🎯 **Signature Series Schedule:**\n• Week 1: 2 treatments (2-3 days apart)\n• Week 2: 2 treatments (2-3 days apart)\n• Total time commitment: 2 weeks\n• Each session: 20 minutes\n\n⏰ **Session Details:**\n• Arrive 15 minutes early\n• Treatment: 20 minutes\n• No recovery time needed\n• Resume normal activities immediately\n\n📈 **Results Timeline:**\n• Week 1: Initial tightening\n• Week 3-4: Visible improvements\n• Month 2-3: Peak results\n• 6+ months: Long-lasting effects\n\n💡 **Scheduling Tips:**\n• Book all sessions in advance\n• Flexible appointment times\n• Can schedule around your routine",
      [
        {
          id: 'book-series',
          label: 'Book Full Series',
          icon: <ScheduleIcon />,
          action: () => handleBookSeries()
        },
        {
          id: 'single-trial',
          label: 'Try Single Session',
          icon: <AutoAwesomeIcon />,
          action: () => handleSingleTrial()
        }
      ]
    );
  };

  const handleCandidate = () => {
    addMessage("Am I a good candidate for EMFACE?", true);
    addBotMessage(
      "🤔 **EMFACE Candidate Assessment:**\n\n✅ **Ideal Candidates:**\n• Age 30-65 seeking facial rejuvenation\n• Mild to moderate skin laxity\n• Want non-surgical enhancement\n• Healthy skin without active conditions\n• Realistic expectations about results\n\n🎯 **Perfect For:**\n• Busy professionals with no downtime\n• Those avoiding surgical procedures\n• Maintenance after previous treatments\n• Special event preparation\n\n⚠️ **Not Suitable For:**\n• Pregnancy or breastfeeding\n• Metal implants in face/neck\n• Pacemaker or electronic devices\n• Severe skin laxity (may need surgery)\n• Active skin infections or conditions\n\n💡 **Best Way to Know:** Schedule a free consultation for personalized assessment!",
      [
        {
          id: 'skin-assessment',
          label: 'Free Skin Assessment',
          icon: <FaceIcon />,
          action: () => handleSkinAssessment()
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

  const handleCustomization = () => {
    addMessage("Can I customize my treatment plan?", true);
    addBotMessage(
      "🎨 **Personalized EMFACE Plans:**\n\n✨ **Custom Treatment Options:**\n• Targeted area focus (upper face, lower face, etc.)\n• Intensity adjustments for comfort\n• Session spacing to fit your schedule\n• Combination with other treatments\n\n🎯 **Add-On Services:**\n• Professional skincare consultation\n• LED light therapy enhancement\n• Hydrating mask treatments\n• Take-home skincare regimen\n\n📋 **Consultation Process:**\n• Detailed facial analysis\n• Discuss your specific goals\n• Review lifestyle and schedule\n• Create personalized treatment plan\n• Adjust as needed during treatment\n\n💫 **VIP Customization:**\n• One-on-one provider attention\n• Flexible scheduling options\n• Premium amenities and comfort",
      [
        {
          id: 'consultation',
          label: 'Schedule Custom Consultation',
          icon: <ScheduleIcon />,
          action: () => handleBookConsultation()
        },
        {
          id: 'combination-treatments',
          label: 'Combination Treatments',
          icon: <AutoAwesomeIcon />,
          action: () => handleCombinationTreatments()
        }
      ]
    );
  };

  // Additional handler methods for comprehensive functionality
  const handleBeforeAfter = () => {
    addMessage("Can I see before and after photos?", true);
    addBotMessage(
      "📸 **EMFACE Results Gallery:**\n\nI'd love to show you our amazing before and after photos! During your consultation, you'll see:\n\n✨ **Real Patient Results:**\n• Forehead smoothing and lifting\n• Cheek enhancement and definition\n• Jawline tightening\n• Overall facial rejuvenation\n\n📱 **View Options:**\n• In-person consultation gallery\n• Instagram: @AboutFaceAesthetics\n• Website results gallery\n• Patient testimonial videos\n\n🔒 **Privacy Protected:**\n• All photos shared with patient consent\n• Professional photography standards\n• Honest, unretouched results",
      [
        {
          id: 'consultation',
          label: 'View in Consultation',
          icon: <ScheduleIcon />,
          action: () => handleBookConsultation()
        },
        {
          id: 'testimonials',
          label: 'Patient Stories',
          icon: <StarIcon />,
          action: () => handleTestimonials()
        }
      ]
    );
  };

  const handleMaintenance = () => {
    addMessage("How do I maintain my results?", true);
    addBotMessage(
      "🔄 **EMFACE Maintenance Plan:**\n\n⏰ **Recommended Schedule:**\n• Initial results last 12-18 months\n• Maintenance sessions every 6-12 months\n• 1-2 sessions to refresh results\n• Personalized based on your aging rate\n\n🌟 **Maintenance Benefits:**\n• Sustain your investment\n• Continue collagen production\n• Prevent further aging\n• Cost-effective long-term strategy\n\n💎 **VIP Maintenance Program:**\n• Scheduled reminder calls\n• Member pricing discounts\n• Priority booking for appointments\n• Exclusive seasonal promotions\n\n💡 **At-Home Care:**\n• Professional skincare recommendations\n• Sun protection guidance\n• Lifestyle tips for lasting results",
      [
        {
          id: 'maintenance-plan',
          label: 'Create Maintenance Plan',
          icon: <ScheduleIcon />,
          action: () => handleMaintenancePlan()
        },
        {
          id: 'skincare',
          label: 'Skincare Recommendations',
          icon: <FaceIcon />,
          action: () => handleSkincare()
        }
      ]
    );
  };

  const handlePreparation = () => {
    addMessage("How should I prepare for treatment?", true);
    addBotMessage(
      "📋 **EMFACE Pre-Treatment Guide:**\n\n✅ **Before Your Session:**\n• Remove all makeup and skincare products\n• Avoid sun exposure 48 hours prior\n• Stay hydrated\n• Eat a light meal beforehand\n• Arrive 15 minutes early\n\n❌ **Avoid Before Treatment:**\n• Retinoids 3 days prior\n• Chemical peels 1 week prior\n• Botox in treatment area (2 weeks)\n• Blood thinning medications (consult doctor)\n• Excessive alcohol 24 hours prior\n\n👕 **What to Wear:**\n• Comfortable clothing\n• Hair tie if you have long hair\n• No jewelry around face/neck area\n\n💡 **Day of Treatment:**\n• Cleanse face gently\n• No moisturizer or products\n• Bring sunglasses for after",
      [
        {
          id: 'pre-treatment-checklist',
          label: 'Get Preparation Checklist',
          icon: <ScheduleIcon />,
          action: () => handlePreTreatmentChecklist()
        }
      ]
    );
  };

  // Utility handler methods
  const handleCallNow = () => {
    addMessage("I want to call now", true);
    addBotMessage(
      "📞 **Call AboutFace Aesthetics Now:**\n\n🔢 **Direct Line:** (555) 123-FACE\n📱 **Text Us:** Same number for quick questions\n\n🕐 **Office Hours:**\n• Monday-Friday: 9 AM - 6 PM\n• Saturday: 9 AM - 4 PM\n• Sunday: Closed\n\n⚡ **When You Call:**\n• Mention you're interested in EMFACE\n• Ask about new patient specials\n• Request earliest consultation availability\n• Inquire about financing options\n\n💬 **Can't Call Right Now?**\nI can help you with more information or guide you to online booking!",
      [
        {
          id: 'book-online',
          label: 'Book Online Instead',
          icon: <ScheduleIcon />,
          action: () => handleBookOnline()
        },
        {
          id: 'more-info',
          label: 'More Information',
          icon: <AutoAwesomeIcon />,
          action: () => handleMoreInfo()
        }
      ]
    );
  };

  const handleBookOnline = () => {
    addMessage("How do I book online?", true);
    addBotMessage(
      "💻 **Online Booking Made Easy:**\n\n🌐 **Booking Portal:**\n• Visit: www.aboutfaceaesthetics.com/book\n• Available 24/7 for your convenience\n• Real-time appointment availability\n• Instant confirmation\n\n📱 **Mobile Friendly:**\n• Works on any device\n• Quick 2-minute booking process\n• Automatic calendar sync\n• Text/email reminders\n\n✨ **Online Booking Benefits:**\n• See all available times\n• Choose your preferred provider\n• Add special requests or questions\n• Secure and private\n\n🎁 **Online Exclusive:**\n• 5% additional discount for online bookings\n• Priority scheduling for new patients",
      [
        {
          id: 'visit-website',
          label: 'Visit Booking Site',
          icon: <ScheduleIcon />,
          action: () => handleVisitWebsite()
        },
        {
          id: 'call-instead',
          label: 'Call Instead',
          icon: <PhoneIcon />,
          action: () => handleCallNow()
        }
      ]
    );
  };

  const handleVirtualConsult = () => {
    addMessage("Tell me about virtual consultations", true);
    addBotMessage(
      "💻 **Virtual EMFACE Consultation:**\n\n🎥 **What's Included:**\n• Live video consultation with our expert\n• Facial analysis using your camera\n• Treatment plan discussion\n• Pricing and financing review\n• Q&A session\n\n⏰ **Convenience Benefits:**\n• No travel required\n• Flexible scheduling\n• 30-minute session\n• Record for your reference\n• Follow-up resources provided\n\n📱 **Technology Requirements:**\n• Smartphone, tablet, or computer\n• Good lighting (near window is best)\n• Stable internet connection\n• Download our secure video app\n\n🎯 **Perfect For:**\n• Busy schedules\n• Out-of-town patients\n• Initial information gathering\n• Pre-visit preparation",
      [
        {
          id: 'book-virtual',
          label: 'Book Virtual Consult',
          icon: <VisibilityIcon />,
          action: () => handleBookVirtual()
        },
        {
          id: 'in-person',
          label: 'Schedule In-Person',
          icon: <LocationIcon />,
          action: () => handleBookConsultation()
        }
      ]
    );
  };

  // Final utility methods to complete the component
  const handleMoreInfo = () => {
    addMessage("I need more information", true);
    addBotMessage(
      "ℹ️ **How Can I Help You Learn More?**\n\nI'm here to answer any questions about EMFACE! Here are some popular topics:",
      [
        {
          id: 'technology',
          label: 'Technology Deep Dive',
          icon: <AutoAwesomeIcon />,
          action: () => handleTechnologyDeepDive()
        },
        {
          id: 'comparison',
          label: 'Compare to Other Treatments',
          icon: <VisibilityIcon />,
          action: () => handleComparison()
        },
        {
          id: 'faq',
          label: 'Frequently Asked Questions',
          icon: <SelfImprovementIcon />,
          action: () => handleFAQ()
        },
        {
          id: 'testimonials',
          label: 'Patient Testimonials',
          icon: <StarIcon />,
          action: () => handleTestimonials()
        }
      ]
    );
  };

  // Quick stubs for remaining handlers to complete the component
  const handleApplyFinancing = () => handleBookConsultation();
  const handlePaymentCalculator = () => handleBookConsultation();
  const handleClaimOffer = () => handleBookConsultation();
  const handleVIPMembership = () => handleBookConsultation();
  const handleBookSeries = () => handleBookConsultation();
  const handleSingleTrial = () => handleBookConsultation();
  const handleSkinAssessment = () => handleBookConsultation();
  const handleCombinationTreatments = () => handleBookConsultation();
  const handleTestimonials = () => handleBookConsultation();
  const handleMaintenancePlan = () => handleBookConsultation();
  const handleSkincare = () => handleBookConsultation();
  const handlePreTreatmentChecklist = () => handleBookConsultation();
  const handleVisitWebsite = () => handleBookConsultation();
  const handleBookVirtual = () => handleBookConsultation();
  const handleTechnologyDeepDive = () => handleEMFACEInfo();
  const handleComparison = () => handleTreatmentOptions();
  const handleFAQ = () => handleMoreInfo();

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      addMessage(inputValue, true);
      setInputValue('');
      setShowQuickActions(false);
      
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
              action: () => setShowQuickActions(true)
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
          icon={action.icon}
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
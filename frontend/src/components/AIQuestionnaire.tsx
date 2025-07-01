import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Box,
  Typography,
  Button,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  LinearProgress,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAdaptiveNavigation } from '../contexts/AdaptiveNavigationContext';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

interface Question {
  id: string;
  question: string;
  options: {
    text: string;
    centers: string[];
    weight: number;
  }[];
}

const questions: Question[] = [
  {
    id: 'concern',
    question: "What brings you to Dr. Pedro's practice today?",
    options: [
      { text: 'Jaw pain or clicking', centers: ['tmj'], weight: 10 },
      { text: 'Missing teeth', centers: ['implants', 'robotic'], weight: 10 },
      { text: 'Facial aesthetics', centers: ['medspa', 'aboutface'], weight: 10 },
      { text: 'General dental care', centers: [], weight: 5 },
      { text: 'Just exploring options', centers: [], weight: 3 },
    ],
  },
  {
    id: 'priority',
    question: 'What is most important to you in your treatment?',
    options: [
      { text: 'Latest technology', centers: ['robotic'], weight: 8 },
      { text: 'Non-invasive options', centers: ['medspa', 'aboutface'], weight: 8 },
      { text: 'Pain relief', centers: ['tmj'], weight: 8 },
      { text: 'Permanent solutions', centers: ['implants', 'robotic'], weight: 8 },
      { text: 'Natural appearance', centers: ['aboutface', 'implants'], weight: 6 },
    ],
  },
  {
    id: 'timeline',
    question: 'When would you like to start treatment?',
    options: [
      { text: 'As soon as possible', centers: [], weight: 2 },
      { text: 'Within a month', centers: [], weight: 2 },
      { text: 'In a few months', centers: [], weight: 2 },
      { text: 'Just researching', centers: [], weight: 1 },
    ],
  },
];

const AIQuestionnaire: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { setCurrentCenter, setMode, addToJourneyPath } = useAdaptiveNavigation();
  
  const [open, setOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [centerScores, setCenterScores] = useState<Record<string, number>>({
    tmj: 0,
    implants: 0,
    robotic: 0,
    medspa: 0,
    aboutface: 0,
  });

  useEffect(() => {
    const handleOpenQuestionnaire = () => setOpen(true);
    window.addEventListener('openAIQuestionnaire', handleOpenQuestionnaire);
    return () => window.removeEventListener('openAIQuestionnaire', handleOpenQuestionnaire);
  }, []);

  const handleAnswer = (answer: string, centers: string[], weight: number) => {
    setAnswers(prev => ({ ...prev, [questions[currentQuestion].id]: answer }));
    
    // Update center scores
    const newScores = { ...centerScores };
    centers.forEach(center => {
      newScores[center] += weight;
    });
    setCenterScores(newScores);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Analyze results and recommend center
      recommendCenter();
    }
  };

  const recommendCenter = () => {
    const topCenter = Object.entries(centerScores).reduce((a, b) => 
      centerScores[a[0] as keyof typeof centerScores] > centerScores[b[0] as keyof typeof centerScores] ? a : b
    )[0];

    addToJourneyPath(`ai-recommended-${topCenter}`);
    setCurrentCenter(topCenter as any);
    setMode('center-focused');
    navigate(`/${topCenter}`);
    setOpen(false);
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      maxWidth="md"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? 0 : 4,
          background: theme.palette.background.default,
        },
      }}
    >
      <DialogTitle sx={{ m: 0, p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Find Your Perfect Care Center
          </Typography>
          <IconButton onClick={() => setOpen(false)}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <LinearProgress variant="determinate" value={progress} sx={{ height: 6 }} />

      <DialogContent sx={{ p: 4 }}>
        <Stepper activeStep={currentQuestion} sx={{ mb: 4 }}>
          {questions.map((q, index) => (
            <Step key={q.id}>
              <StepLabel>{index === currentQuestion ? q.id : ''}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <Typography variant="h4" sx={{ mb: 4, textAlign: 'center' }}>
              {questions[currentQuestion].question}
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {questions[currentQuestion].options.map((option, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card
                    sx={{
                      cursor: 'pointer',
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        boxShadow: theme.shadows[8],
                        borderColor: theme.palette.primary.main,
                      },
                    }}
                    onClick={() => handleAnswer(option.text, option.centers, option.weight)}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6">{option.text}</Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </Box>
          </motion.div>
        </AnimatePresence>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            disabled={currentQuestion === 0}
            sx={{ visibility: currentQuestion === 0 ? 'hidden' : 'visible' }}
          >
            Back
          </Button>
          
          <Button
            onClick={() => setOpen(false)}
            variant="outlined"
          >
            Skip
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AIQuestionnaire;
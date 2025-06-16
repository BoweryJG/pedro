import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  Card,
  CardContent,
  Avatar,
  Chip,
  IconButton,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Badge,
  LinearProgress,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Instagram,
  Send,
  Refresh,
  Settings,
  Analytics as AnalyticsIcon,
  Chat,
  SmartToy,
  AccessTime,
  Warning,
  Reply,
  Star,
} from '@mui/icons-material';

interface Conversation {
  id: string;
  instagram_thread_id: string;
  patient_instagram_id: string;
  patient_name: string;
  patient_username: string;
  status: 'active' | 'resolved' | 'archived';
  sentiment_score: number;
  last_message_at: string;
  created_at: string;
  messages: Message[];
}

interface Message {
  id: string;
  sender_type: 'patient' | 'practice' | 'ai';
  sender_id: string;
  message_text: string;
  is_ai_generated: boolean;
  ai_confidence_score?: number;
  requires_human_review?: boolean;
  created_at: string;
}

interface Analytics {
  total_messages: number;
  ai_responses: number;
  human_interventions: number;
  appointments_booked: number;
  avg_response_time: string;
  avg_satisfaction: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`instagram-tabpanel-${index}`}
      aria-labelledby={`instagram-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const InstagramDashboard: React.FC = () => {
  const [tabValue, setTabValue] = useState(0);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [autoResponseEnabled, setAutoResponseEnabled] = useState(true);
  const [practiceId] = useState('practice-id-placeholder'); // In real app, get from auth/context

  // Fetch conversations
  const fetchConversations = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/instagram/conversations?practice_id=${practiceId}`);
      const data = await response.json();
      setConversations(data.conversations || []);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  // Fetch analytics
  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/instagram/analytics?practice_id=${practiceId}`);
      const data = await response.json();
      setAnalytics(data.totals);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchConversations(), fetchAnalytics()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSendReply = async () => {
    if (!selectedConversation || !replyMessage.trim()) return;

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/instagram/conversations/${selectedConversation.id}/reply`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: replyMessage,
            senderId: 'dr-pedro'
          })
        }
      );

      if (response.ok) {
        setReplyMessage('');
        setReplyDialogOpen(false);
        await fetchConversations(); // Refresh conversations
      }
    } catch (error) {
      console.error('Error sending reply:', error);
    }
  };

  const getSentimentColor = (score: number) => {
    if (score > 0.3) return 'success';
    if (score < -0.3) return 'error';
    return 'warning';
  };

  const getSentimentLabel = (score: number) => {
    if (score > 0.3) return 'Positive';
    if (score < -0.3) return 'Negative';
    return 'Neutral';
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - time.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const renderConversationsContent = () => (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h6">Instagram Conversations</Typography>
        <Box>
          <FormControlLabel
            control={
              <Switch
                checked={autoResponseEnabled}
                onChange={(e) => setAutoResponseEnabled(e.target.checked)}
              />
            }
            label="AI Auto-Response"
          />
          <IconButton onClick={fetchConversations}>
            <Refresh />
          </IconButton>
        </Box>
      </Box>

      {loading ? (
        <LinearProgress />
      ) : (
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
          <Box sx={{ flex: { xs: '1 1 100%', md: '0 0 40%' } }}>
            <Paper sx={{ height: '600px', overflow: 'hidden' }}>
              <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                <Typography variant="h6">Conversations ({conversations.length})</Typography>
              </Box>
              <List sx={{ height: 'calc(100% - 60px)', overflow: 'auto' }}>
                {conversations.map((conversation) => {
                  const lastMessage = conversation.messages?.[conversation.messages.length - 1];
                  const hasUnreadAI = conversation.messages?.some(
                    msg => msg.is_ai_generated && msg.requires_human_review
                  );
                  
                  return (
                    <ListItem
                      key={conversation.id}
                      sx={{ borderBottom: '1px solid', borderColor: 'divider', padding: 0 }}
                    >
                      <ListItemButton
                        selected={selectedConversation?.id === conversation.id}
                        onClick={() => setSelectedConversation(conversation)}
                      >
                      <ListItemAvatar>
                        <Badge
                          badgeContent={hasUnreadAI ? '!' : 0}
                          color="warning"
                          invisible={!hasUnreadAI}
                        >
                          <Avatar sx={{ bgcolor: '#E4405F' }}>
                            <Instagram />
                          </Avatar>
                        </Badge>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="body1" fontWeight="bold">
                              {conversation.patient_name || 'Unknown'}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {formatTimeAgo(conversation.last_message_at)}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" color="text.secondary" noWrap>
                              {conversation.patient_username}
                            </Typography>
                            {lastMessage && (
                              <Typography variant="caption" color="text.secondary" noWrap>
                                {lastMessage.sender_type === 'ai' && '🤖 '}
                                {lastMessage.message_text}
                              </Typography>
                            )}
                            <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                              <Chip
                                size="small"
                                label={conversation.status}
                                color={conversation.status === 'active' ? 'primary' : 'default'}
                              />
                              <Chip
                                size="small"
                                label={getSentimentLabel(conversation.sentiment_score)}
                                color={getSentimentColor(conversation.sentiment_score) as any}
                              />
                            </Box>
                          </Box>
                        }
                      />
                      </ListItemButton>
                    </ListItem>
                  );
                })}
              </List>
            </Paper>
          </Box>

          <Box sx={{ flex: { xs: '1 1 100%', md: '0 0 58%' } }}>
            {selectedConversation ? (
              <Paper sx={{ height: '600px', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="h6">
                        {selectedConversation.patient_name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        @{selectedConversation.patient_username}
                      </Typography>
                    </Box>
                    <Box>
                      <IconButton
                        onClick={() => setReplyDialogOpen(true)}
                        color="primary"
                      >
                        <Reply />
                      </IconButton>
                      <IconButton>
                        <Settings />
                      </IconButton>
                    </Box>
                  </Box>
                </Box>

                <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
                  {selectedConversation.messages?.map((message) => (
                    <Box
                      key={message.id}
                      sx={{
                        display: 'flex',
                        justifyContent: message.sender_type === 'patient' ? 'flex-start' : 'flex-end',
                        mb: 2
                      }}
                    >
                      <Box
                        sx={{
                          maxWidth: '70%',
                          p: 1.5,
                          borderRadius: 2,
                          bgcolor: message.sender_type === 'patient' ? 'grey.100' : 'primary.main',
                          color: message.sender_type === 'patient' ? 'text.primary' : 'primary.contrastText'
                        }}
                      >
                        <Typography variant="body2">
                          {message.message_text}
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
                          <Typography variant="caption" sx={{ opacity: 0.7 }}>
                            {formatTimeAgo(message.created_at)}
                          </Typography>
                          {message.is_ai_generated && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <SmartToy sx={{ fontSize: 12 }} />
                              {message.requires_human_review && (
                                <Warning sx={{ fontSize: 12, color: 'warning.main' }} />
                              )}
                            </Box>
                          )}
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Paper>
            ) : (
              <Paper sx={{ height: '600px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Chat sx={{ fontSize: 64, color: 'grey.400', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary">
                    Select a conversation to view messages
                  </Typography>
                </Box>
              </Paper>
            )}
          </Box>
        </Box>
      )}
    </>
  );

  const renderAnalyticsContent = () => (
    <>
      <Typography variant="h6" gutterBottom>
        Instagram DM Analytics
      </Typography>

      {analytics && (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
          <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(25% - 18px)' } }}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Chat color="primary" />
                  <Box sx={{ ml: 2 }}>
                    <Typography color="textSecondary" gutterBottom>
                      Total Messages
                    </Typography>
                    <Typography variant="h4">
                      {analytics.total_messages}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>

          <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(25% - 18px)' } }}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <SmartToy color="secondary" />
                  <Box sx={{ ml: 2 }}>
                    <Typography color="textSecondary" gutterBottom>
                      AI Responses
                    </Typography>
                    <Typography variant="h4">
                      {analytics.ai_responses}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {analytics.total_messages > 0 
                        ? Math.round((analytics.ai_responses / analytics.total_messages) * 100)
                        : 0}% automation
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>

          <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(25% - 18px)' } }}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <AccessTime color="warning" />
                  <Box sx={{ ml: 2 }}>
                    <Typography color="textSecondary" gutterBottom>
                      Avg Response Time
                    </Typography>
                    <Typography variant="h4">
                      {analytics.avg_response_time}m
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>

          <Box sx={{ flex: { xs: '1 1 100%', sm: '1 1 calc(50% - 12px)', md: '1 1 calc(25% - 18px)' } }}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Star color="success" />
                  <Box sx={{ ml: 2 }}>
                    <Typography color="textSecondary" gutterBottom>
                      Satisfaction Score
                    </Typography>
                    <Typography variant="h4">
                      {analytics.avg_satisfaction}/5
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Box>
      )}

      <Alert severity="info" sx={{ mt: 3 }}>
        AI automation is handling {analytics ? Math.round((analytics.ai_responses / analytics.total_messages) * 100) : 0}% 
        of your Instagram DMs, saving approximately {analytics ? Math.round(analytics.ai_responses * 2.5) : 0} minutes per day.
      </Alert>
    </>
  );

  const renderSettingsContent = () => (
    <>
      <Typography variant="h6" gutterBottom>
        Instagram DM Settings
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 50%' } }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                AI Response Settings
              </Typography>
              <Box sx={{ mt: 2 }}>
                <FormControlLabel
                  control={<Switch checked={autoResponseEnabled} />}
                  label="Enable AI Auto-Responses"
                  sx={{ mb: 2 }}
                />
                <Typography variant="body2" color="text.secondary">
                  When enabled, Claude AI will automatically respond to patient inquiries using dental-specific knowledge.
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>

        <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 50%' } }}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Business Hours
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Monday - Friday: 9:00 AM - 5:00 PM<br />
                Saturday: 9:00 AM - 2:00 PM<br />
                Sunday: Closed
              </Typography>
              <Button variant="outlined" sx={{ mt: 2 }}>
                Edit Hours
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </>
  );

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ color: 'primary.main', mb: 3 }}>
        Instagram DM Management
      </Typography>

      <Paper sx={{ width: '100%' }}>
        <Tabs value={tabValue} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tab label="Conversations" icon={<Chat />} iconPosition="start" />
          <Tab label="Analytics" icon={<AnalyticsIcon />} iconPosition="start" />
          <Tab label="Settings" icon={<Settings />} iconPosition="start" />
        </Tabs>

        <Box sx={{ p: 3 }}>
          <TabPanel value={tabValue} index={0}>
            {renderConversationsContent()}
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            {renderAnalyticsContent()}
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            {renderSettingsContent()}
          </TabPanel>
        </Box>
      </Paper>

      {/* Reply Dialog */}
      <Dialog open={replyDialogOpen} onClose={() => setReplyDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          Reply to {selectedConversation?.patient_name}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Your Message"
            placeholder="Type your reply..."
            value={replyMessage}
            onChange={(e) => setReplyMessage(e.target.value)}
            sx={{ mt: 2 }}
          />
          <Alert severity="info" sx={{ mt: 2 }}>
            This message will be sent directly to the patient's Instagram DMs.
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReplyDialogOpen(false)}>Cancel</Button>
          <Button 
            variant="contained" 
            onClick={handleSendReply}
            disabled={!replyMessage.trim()}
            startIcon={<Send />}
          >
            Send Reply
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default InstagramDashboard;
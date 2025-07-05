import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  IconButton,
  Alert,
  CircularProgress,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Phone as PhoneIcon,
  Search as SearchIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Settings as SettingsIcon,
  AttachMoney as MoneyIcon,
  Analytics as AnalyticsIcon,
} from '@mui/icons-material';

interface PhoneNumber {
  id: string;
  phone_number: string;
  client_name: string;
  status: 'active' | 'suspended' | 'released';
  capabilities: {
    voice: boolean;
    sms: boolean;
  };
  monthly_fee: number;
  created_at: string;
  voice_settings: any;
}

interface AvailableNumber {
  phoneNumber: string;
  friendlyName: string;
  locality: string;
  region: string;
  monthlyFee: string;
}

const PhoneNumberManager: React.FC = () => {
  const [phoneNumbers, setPhoneNumbers] = useState<PhoneNumber[]>([]);
  const [availableNumbers, setAvailableNumbers] = useState<AvailableNumber[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchAreaCode, setSearchAreaCode] = useState('');
  const [searchContains, setSearchContains] = useState('');
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false);
  const [selectedNumber, setSelectedNumber] = useState<AvailableNumber | null>(null);
  const [clientName, setClientName] = useState('');
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [editingNumber, setEditingNumber] = useState<PhoneNumber | null>(null);

  useEffect(() => {
    fetchManagedNumbers();
  }, []);

  const fetchManagedNumbers = async () => {
    try {
      const response = await fetch('/api/phone-numbers/managed');
      if (!response.ok) {
        console.log('Phone numbers API not available yet');
        return;
      }
      const data = await response.json();
      setPhoneNumbers(data.numbers || []);
    } catch (error) {
      console.error('Error fetching numbers:', error);
      // Don't crash, just show empty state
      setPhoneNumbers([]);
    }
  };

  const searchNumbers = async () => {
    if (!searchAreaCode) {
      alert('Please enter an area code');
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams({
        areaCode: searchAreaCode,
        ...(searchContains && { contains: searchContains }),
      });

      const response = await fetch(`/api/phone-numbers/search?${params}`);
      const data = await response.json();
      setAvailableNumbers(data.numbers);
    } catch (error) {
      console.error('Error searching numbers:', error);
    } finally {
      setLoading(false);
    }
  };

  const purchaseNumber = async () => {
    if (!selectedNumber || !clientName) {
      alert('Please select a number and enter client name');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/phone-numbers/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber: selectedNumber.phoneNumber,
          clientId: `client_${Date.now()}`, // Generate client ID
          clientName,
        }),
      });

      if (response.ok) {
        setShowPurchaseDialog(false);
        fetchManagedNumbers();
        setAvailableNumbers([]);
        alert(`Successfully purchased ${selectedNumber.phoneNumber} for ${clientName}`);
      }
    } catch (error) {
      console.error('Error purchasing number:', error);
      alert('Failed to purchase number');
    } finally {
      setLoading(false);
    }
  };

  const releaseNumber = async (phoneNumber: string) => {
    if (!confirm(`Are you sure you want to release ${phoneNumber}?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/phone-numbers/${phoneNumber}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchManagedNumbers();
        alert('Number released successfully');
      }
    } catch (error) {
      console.error('Error releasing number:', error);
      alert('Failed to release number');
    }
  };

  const updateSettings = async () => {
    if (!editingNumber) return;

    try {
      const response = await fetch(`/api/phone-numbers/${editingNumber.phone_number}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingNumber.voice_settings),
      });

      if (response.ok) {
        setShowSettingsDialog(false);
        fetchManagedNumbers();
        alert('Settings updated successfully');
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      alert('Failed to update settings');
    }
  };

  const calculateMonthlyRevenue = () => {
    const activeNumbers = phoneNumbers.filter(n => n.status === 'active');
    const numberFees = activeNumbers.reduce((sum, n) => sum + n.monthly_fee, 0);
    const platformFees = activeNumbers.length * 49.99; // $49.99 per client
    return {
      numberFees,
      platformFees,
      total: numberFees + platformFees,
      activeCount: activeNumbers.length,
    };
  };

  const revenue = calculateMonthlyRevenue();

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        <PhoneIcon /> Phone Number Management
      </Typography>

      {/* Revenue Summary */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Active Numbers
              </Typography>
              <Typography variant="h4">
                {revenue.activeCount}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Number Fees
              </Typography>
              <Typography variant="h4">
                ${revenue.numberFees.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Platform Fees
              </Typography>
              <Typography variant="h4">
                ${revenue.platformFees.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>
                Monthly Revenue
              </Typography>
              <Typography variant="h4" color="success.main">
                ${revenue.total.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Search for New Numbers */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Search Available Numbers
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <TextField
              label="Area Code"
              value={searchAreaCode}
              onChange={(e) => setSearchAreaCode(e.target.value)}
              placeholder="212"
              sx={{ width: 150 }}
            />
            <TextField
              label="Contains (optional)"
              value={searchContains}
              onChange={(e) => setSearchContains(e.target.value)}
              placeholder="DENTAL"
              fullWidth
            />
            <Button
              variant="contained"
              onClick={searchNumbers}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} /> : <SearchIcon />}
            >
              Search
            </Button>
          </Box>

          {availableNumbers.length > 0 && (
            <TableContainer component={Paper}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Phone Number</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Monthly Fee</TableCell>
                    <TableCell>Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {availableNumbers.map((number) => (
                    <TableRow key={number.phoneNumber}>
                      <TableCell>{number.friendlyName}</TableCell>
                      <TableCell>{number.locality}, {number.region}</TableCell>
                      <TableCell>{number.monthlyFee}</TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          onClick={() => {
                            setSelectedNumber(number);
                            setShowPurchaseDialog(true);
                          }}
                        >
                          Purchase
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Managed Numbers */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Managed Phone Numbers
          </Typography>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Phone Number</TableCell>
                  <TableCell>Client</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Capabilities</TableCell>
                  <TableCell>Monthly Fee</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {phoneNumbers.map((number) => (
                  <TableRow key={number.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PhoneIcon fontSize="small" />
                        {number.phone_number}
                      </Box>
                    </TableCell>
                    <TableCell>{number.client_name}</TableCell>
                    <TableCell>
                      <Chip
                        label={number.status}
                        color={number.status === 'active' ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {number.capabilities.voice && <Chip label="Voice" size="small" sx={{ mr: 0.5 }} />}
                      {number.capabilities.sms && <Chip label="SMS" size="small" />}
                    </TableCell>
                    <TableCell>${number.monthly_fee}</TableCell>
                    <TableCell>{new Date(number.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <IconButton
                        size="small"
                        onClick={() => {
                          setEditingNumber(number);
                          setShowSettingsDialog(true);
                        }}
                      >
                        <SettingsIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => window.open(`/analytics/${number.phone_number}`, '_blank')}
                      >
                        <AnalyticsIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => releaseNumber(number.phone_number)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Purchase Dialog */}
      <Dialog open={showPurchaseDialog} onClose={() => setShowPurchaseDialog(false)}>
        <DialogTitle>Purchase Phone Number</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography variant="body2" gutterBottom>
              Number: {selectedNumber?.friendlyName}
            </Typography>
            <Typography variant="body2" gutterBottom>
              Location: {selectedNumber?.locality}, {selectedNumber?.region}
            </Typography>
            <Typography variant="body2" gutterBottom>
              Monthly Fee: {selectedNumber?.monthlyFee}
            </Typography>
            <TextField
              fullWidth
              label="Client/Practice Name"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              sx={{ mt: 2 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowPurchaseDialog(false)}>Cancel</Button>
          <Button onClick={purchaseNumber} variant="contained" disabled={loading}>
            {loading ? 'Purchasing...' : 'Purchase'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Settings Dialog */}
      <Dialog open={showSettingsDialog} onClose={() => setShowSettingsDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Voice AI Settings - {editingNumber?.phone_number}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Voice Model</InputLabel>
              <Select
                value={editingNumber?.voice_settings?.voiceModel || ''}
                onChange={(e) => setEditingNumber({
                  ...editingNumber!,
                  voice_settings: {
                    ...editingNumber!.voice_settings,
                    voiceModel: e.target.value
                  }
                })}
              >
                <MenuItem value="aura-2-thalia-en">Thalia (Female, Warm)</MenuItem>
                <MenuItem value="aura-2-orion-en">Orion (Male, Professional)</MenuItem>
                <MenuItem value="aura-2-luna-en">Luna (Female, Friendly)</MenuItem>
                <MenuItem value="aura-2-stella-en">Stella (Female, Clear)</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Greeting Message"
              multiline
              rows={3}
              value={editingNumber?.voice_settings?.greetingMessage || ''}
              onChange={(e) => setEditingNumber({
                ...editingNumber!,
                voice_settings: {
                  ...editingNumber!.voice_settings,
                  greetingMessage: e.target.value
                }
              })}
              sx={{ mb: 2 }}
            />

            <FormControl fullWidth>
              <InputLabel>Personality</InputLabel>
              <Select
                value={editingNumber?.voice_settings?.personality || ''}
                onChange={(e) => setEditingNumber({
                  ...editingNumber!,
                  voice_settings: {
                    ...editingNumber!.voice_settings,
                    personality: e.target.value
                  }
                })}
              >
                <MenuItem value="professional">Professional</MenuItem>
                <MenuItem value="friendly">Friendly</MenuItem>
                <MenuItem value="warm">Warm & Caring</MenuItem>
                <MenuItem value="efficient">Efficient & Direct</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSettingsDialog(false)}>Cancel</Button>
          <Button onClick={updateSettings} variant="contained">
            Save Settings
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PhoneNumberManager;
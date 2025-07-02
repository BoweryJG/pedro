import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Card,
  CardContent,
  Chip,
  Alert,
  FormControlLabel,
  Switch,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Collapse,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  Add,
  Remove,
  Group,
  Person,
  Email,
  Phone,
  ExpandMore,
  ExpandLess,
  Family,
  Business,
} from '@mui/icons-material';

export interface GroupMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  relationship?: string;
  isPrimary: boolean;
  needsSameProvider?: boolean;
  preferredTime?: string;
}

export interface GroupBookingData {
  type: 'family' | 'corporate' | 'custom';
  members: GroupMember[];
  preferSameTime: boolean;
  preferSameProvider: boolean;
  notes?: string;
}

interface GroupBookingProps {
  value: GroupBookingData;
  onChange: (data: GroupBookingData) => void;
  maxGroupSize?: number;
  serviceId?: string;
}

const relationshipOptions = [
  'Spouse',
  'Child',
  'Parent',
  'Sibling',
  'Friend',
  'Colleague',
  'Other',
];

export const GroupBooking: React.FC<GroupBookingProps> = ({
  value,
  onChange,
  maxGroupSize = 6,
  serviceId,
}) => {
  const [expandedMembers, setExpandedMembers] = useState<Set<string>>(new Set());
  const [showGroupOptions, setShowGroupOptions] = useState(true);

  const handleAddMember = () => {
    if (value.members.length >= maxGroupSize) return;
    
    const newMember: GroupMember = {
      id: `member-${Date.now()}`,
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      isPrimary: value.members.length === 0,
    };
    
    onChange({
      ...value,
      members: [...value.members, newMember],
    });
    
    setExpandedMembers(new Set([...expandedMembers, newMember.id]));
  };

  const handleRemoveMember = (id: string) => {
    const updatedMembers = value.members.filter(m => m.id !== id);
    
    // If we removed the primary member, make the first member primary
    if (updatedMembers.length > 0 && !updatedMembers.some(m => m.isPrimary)) {
      updatedMembers[0].isPrimary = true;
    }
    
    onChange({
      ...value,
      members: updatedMembers,
    });
    
    const newExpanded = new Set(expandedMembers);
    newExpanded.delete(id);
    setExpandedMembers(newExpanded);
  };

  const handleUpdateMember = (id: string, updates: Partial<GroupMember>) => {
    const updatedMembers = value.members.map(member => {
      if (member.id === id) {
        return { ...member, ...updates };
      }
      // If setting this member as primary, remove primary from others
      if (updates.isPrimary && member.isPrimary) {
        return { ...member, isPrimary: false };
      }
      return member;
    });
    
    onChange({
      ...value,
      members: updatedMembers,
    });
  };

  const toggleMemberExpansion = (id: string) => {
    const newExpanded = new Set(expandedMembers);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedMembers(newExpanded);
  };

  const isGroupValid = () => {
    return value.members.every(member => 
      member.firstName && 
      member.lastName && 
      member.email && 
      member.phone
    );
  };

  const getGroupTypeIcon = () => {
    switch (value.type) {
      case 'family':
        return <Family />;
      case 'corporate':
        return <Business />;
      default:
        return <Group />;
    }
  };

  return (
    <Box>
      <Box display="flex" alignItems="center" gap={2} mb={3}>
        {getGroupTypeIcon()}
        <Typography variant="h6">Group Booking</Typography>
        <Chip 
          label={`${value.members.length} members`} 
          size="small"
          color={value.members.length > 0 ? 'primary' : 'default'}
        />
      </Box>

      <FormControl fullWidth sx={{ mb: 3 }}>
        <InputLabel>Group Type</InputLabel>
        <Select
          value={value.type}
          onChange={(e) => onChange({ ...value, type: e.target.value as any })}
          label="Group Type"
        >
          <MenuItem value="family">Family</MenuItem>
          <MenuItem value="corporate">Corporate/Office</MenuItem>
          <MenuItem value="custom">Custom Group</MenuItem>
        </Select>
      </FormControl>

      <Card variant="outlined" sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Typography variant="subtitle1">Group Preferences</Typography>
            <IconButton size="small" onClick={() => setShowGroupOptions(!showGroupOptions)}>
              {showGroupOptions ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Box>
          
          <Collapse in={showGroupOptions}>
            <FormControlLabel
              control={
                <Switch
                  checked={value.preferSameTime}
                  onChange={(e) => onChange({ ...value, preferSameTime: e.target.checked })}
                />
              }
              label="Prefer appointments at the same time"
            />
            
            <FormControlLabel
              control={
                <Switch
                  checked={value.preferSameProvider}
                  onChange={(e) => onChange({ ...value, preferSameProvider: e.target.checked })}
                />
              }
              label="Prefer same provider for all members"
            />
            
            {value.preferSameTime && (
              <Alert severity="info" sx={{ mt: 2 }}>
                We'll try to schedule all appointments at the same time, subject to availability.
              </Alert>
            )}
          </Collapse>
        </CardContent>
      </Card>

      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="subtitle1">Group Members</Typography>
        <Button
          startIcon={<Add />}
          onClick={handleAddMember}
          disabled={value.members.length >= maxGroupSize}
          size="small"
        >
          Add Member
        </Button>
      </Box>

      {value.members.length === 0 ? (
        <Alert severity="info">
          Click "Add Member" to start adding people to your group booking.
        </Alert>
      ) : (
        <List>
          {value.members.map((member, index) => (
            <Card key={member.id} variant="outlined" sx={{ mb: 2 }}>
              <ListItem
                button
                onClick={() => toggleMemberExpansion(member.id)}
                sx={{ backgroundColor: member.isPrimary ? 'action.selected' : undefined }}
              >
                <Person sx={{ mr: 2 }} />
                <ListItemText
                  primary={
                    member.firstName && member.lastName
                      ? `${member.firstName} ${member.lastName}`
                      : `Member ${index + 1}`
                  }
                  secondary={
                    <Box display="flex" gap={1} alignItems="center">
                      {member.isPrimary && (
                        <Chip label="Primary Contact" size="small" color="primary" />
                      )}
                      {member.relationship && (
                        <Chip label={member.relationship} size="small" variant="outlined" />
                      )}
                    </Box>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveMember(member.id);
                    }}
                    disabled={value.members.length === 1}
                  >
                    <Remove />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
              
              <Collapse in={expandedMembers.has(member.id)}>
                <Divider />
                <CardContent>
                  <Box display="grid" gap={2}>
                    <Box display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
                      <TextField
                        label="First Name"
                        value={member.firstName}
                        onChange={(e) => handleUpdateMember(member.id, { firstName: e.target.value })}
                        required
                        fullWidth
                      />
                      <TextField
                        label="Last Name"
                        value={member.lastName}
                        onChange={(e) => handleUpdateMember(member.id, { lastName: e.target.value })}
                        required
                        fullWidth
                      />
                    </Box>
                    
                    <TextField
                      label="Email"
                      type="email"
                      value={member.email}
                      onChange={(e) => handleUpdateMember(member.id, { email: e.target.value })}
                      required
                      fullWidth
                      InputProps={{
                        startAdornment: <Email sx={{ mr: 1, color: 'action.active' }} />,
                      }}
                    />
                    
                    <TextField
                      label="Phone"
                      value={member.phone}
                      onChange={(e) => handleUpdateMember(member.id, { phone: e.target.value })}
                      required
                      fullWidth
                      InputProps={{
                        startAdornment: <Phone sx={{ mr: 1, color: 'action.active' }} />,
                      }}
                    />
                    
                    {value.type === 'family' && (
                      <FormControl fullWidth>
                        <InputLabel>Relationship</InputLabel>
                        <Select
                          value={member.relationship || ''}
                          onChange={(e) => handleUpdateMember(member.id, { relationship: e.target.value })}
                          label="Relationship"
                        >
                          <MenuItem value="">None</MenuItem>
                          {relationshipOptions.map(rel => (
                            <MenuItem key={rel} value={rel}>{rel}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                    
                    <FormControlLabel
                      control={
                        <Switch
                          checked={member.isPrimary}
                          onChange={(e) => handleUpdateMember(member.id, { isPrimary: e.target.checked })}
                        />
                      }
                      label="Primary Contact"
                    />
                    
                    {!value.preferSameProvider && (
                      <FormControlLabel
                        control={
                          <Switch
                            checked={member.needsSameProvider || false}
                            onChange={(e) => handleUpdateMember(member.id, { needsSameProvider: e.target.checked })}
                          />
                        }
                        label="Must have same provider as primary"
                      />
                    )}
                  </Box>
                </CardContent>
              </Collapse>
            </Card>
          ))}
        </List>
      )}

      <TextField
        label="Additional Notes for Group Booking"
        multiline
        rows={3}
        fullWidth
        value={value.notes || ''}
        onChange={(e) => onChange({ ...value, notes: e.target.value })}
        placeholder="Any special requirements or preferences for your group..."
        sx={{ mt: 3 }}
      />

      {value.members.length >= maxGroupSize && (
        <Alert severity="warning" sx={{ mt: 2 }}>
          Maximum group size of {maxGroupSize} members reached.
        </Alert>
      )}

      {value.members.length > 0 && !isGroupValid() && (
        <Alert severity="error" sx={{ mt: 2 }}>
          Please complete all required fields for each group member.
        </Alert>
      )}
    </Box>
  );
};
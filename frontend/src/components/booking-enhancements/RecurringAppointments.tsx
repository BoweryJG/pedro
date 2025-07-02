import React, { useState } from 'react';
import {
  Box,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
  Chip,
  Alert,
  FormGroup,
  RadioGroup,
  Radio,
  Divider,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import { Repeat, CalendarMonth, Info } from '@mui/icons-material';

export interface RecurrencePattern {
  enabled: boolean;
  type: 'daily' | 'weekly' | 'monthly' | 'custom';
  interval: number;
  daysOfWeek?: number[]; // 0-6 (Sunday-Saturday)
  dayOfMonth?: number;
  endType: 'never' | 'after' | 'on';
  occurrences?: number;
  endDate?: Dayjs;
  customDates?: Dayjs[];
}

interface RecurringAppointmentsProps {
  value: RecurrencePattern;
  onChange: (pattern: RecurrencePattern) => void;
  startDate: Dayjs | null;
  serviceId?: string;
  staffId?: string;
}

const defaultPattern: RecurrencePattern = {
  enabled: false,
  type: 'weekly',
  interval: 1,
  endType: 'after',
  occurrences: 4,
};

const weekDays = [
  { value: 0, label: 'Sun' },
  { value: 1, label: 'Mon' },
  { value: 2, label: 'Tue' },
  { value: 3, label: 'Wed' },
  { value: 4, label: 'Thu' },
  { value: 5, label: 'Fri' },
  { value: 6, label: 'Sat' },
];

export const RecurringAppointments: React.FC<RecurringAppointmentsProps> = ({
  value = defaultPattern,
  onChange,
  startDate,
  serviceId,
  staffId,
}) => {
  const [showPreview, setShowPreview] = useState(false);

  const handleChange = (updates: Partial<RecurrencePattern>) => {
    onChange({ ...value, ...updates });
  };

  const generatePreviewDates = (): Dayjs[] => {
    if (!startDate || !value.enabled) return [];
    
    const dates: Dayjs[] = [startDate];
    let currentDate = startDate;
    let count = 1;
    
    const maxPreview = 10;
    const maxIterations = 365; // Prevent infinite loops
    let iterations = 0;
    
    while (count < maxPreview && iterations < maxIterations) {
      iterations++;
      
      switch (value.type) {
        case 'daily':
          currentDate = currentDate.add(value.interval, 'day');
          break;
          
        case 'weekly':
          if (value.daysOfWeek && value.daysOfWeek.length > 0) {
            // Find next occurrence based on selected days
            let nextDate = currentDate.add(1, 'day');
            while (!value.daysOfWeek.includes(nextDate.day())) {
              nextDate = nextDate.add(1, 'day');
            }
            currentDate = nextDate;
          } else {
            currentDate = currentDate.add(value.interval, 'week');
          }
          break;
          
        case 'monthly':
          currentDate = currentDate.add(value.interval, 'month');
          if (value.dayOfMonth) {
            currentDate = currentDate.date(value.dayOfMonth);
          }
          break;
          
        case 'custom':
          // Custom dates are handled separately
          return value.customDates || [];
      }
      
      // Check end conditions
      if (value.endType === 'after' && count >= (value.occurrences || 4)) {
        break;
      }
      if (value.endType === 'on' && value.endDate && currentDate.isAfter(value.endDate)) {
        break;
      }
      
      dates.push(currentDate);
      count++;
    }
    
    return dates;
  };

  return (
    <Box>
      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <Repeat color="primary" />
        <Typography variant="h6">Recurring Appointments</Typography>
      </Box>
      
      <FormControlLabel
        control={
          <Switch
            checked={value.enabled}
            onChange={(e) => handleChange({ enabled: e.target.checked })}
          />
        }
        label="Enable recurring appointments"
      />
      
      {value.enabled && (
        <Box mt={3}>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Recurrence Pattern</InputLabel>
            <Select
              value={value.type}
              onChange={(e) => handleChange({ type: e.target.value as any })}
              label="Recurrence Pattern"
            >
              <MenuItem value="daily">Daily</MenuItem>
              <MenuItem value="weekly">Weekly</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
              <MenuItem value="custom">Custom Dates</MenuItem>
            </Select>
          </FormControl>
          
          {value.type !== 'custom' && (
            <>
              <Box display="flex" alignItems="center" gap={2} mb={3}>
                <Typography>Repeat every</Typography>
                <TextField
                  type="number"
                  value={value.interval}
                  onChange={(e) => handleChange({ interval: parseInt(e.target.value) || 1 })}
                  inputProps={{ min: 1, max: 30 }}
                  sx={{ width: 80 }}
                />
                <Typography>
                  {value.type === 'daily' ? 'day(s)' : 
                   value.type === 'weekly' ? 'week(s)' : 'month(s)'}
                </Typography>
              </Box>
              
              {value.type === 'weekly' && (
                <Box mb={3}>
                  <Typography variant="subtitle2" gutterBottom>
                    Repeat on
                  </Typography>
                  <Box display="flex" gap={1} flexWrap="wrap">
                    {weekDays.map(day => (
                      <Chip
                        key={day.value}
                        label={day.label}
                        onClick={() => {
                          const days = value.daysOfWeek || [];
                          const updated = days.includes(day.value)
                            ? days.filter(d => d !== day.value)
                            : [...days, day.value];
                          handleChange({ daysOfWeek: updated });
                        }}
                        color={value.daysOfWeek?.includes(day.value) ? 'primary' : 'default'}
                        variant={value.daysOfWeek?.includes(day.value) ? 'filled' : 'outlined'}
                      />
                    ))}
                  </Box>
                </Box>
              )}
              
              {value.type === 'monthly' && (
                <Box mb={3}>
                  <FormControl fullWidth>
                    <InputLabel>Day of Month</InputLabel>
                    <Select
                      value={value.dayOfMonth || startDate?.date() || 1}
                      onChange={(e) => handleChange({ dayOfMonth: e.target.value as number })}
                      label="Day of Month"
                    >
                      {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                        <MenuItem key={day} value={day}>
                          {day}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Box>
              )}
              
              <Divider sx={{ my: 3 }} />
              
              <Typography variant="subtitle1" gutterBottom>
                End Recurrence
              </Typography>
              
              <RadioGroup
                value={value.endType}
                onChange={(e) => handleChange({ endType: e.target.value as any })}
              >
                <FormControlLabel 
                  value="never" 
                  control={<Radio />} 
                  label="Never" 
                />
                
                <FormControlLabel 
                  value="after" 
                  control={<Radio />} 
                  label={
                    <Box display="flex" alignItems="center" gap={1}>
                      <span>After</span>
                      <TextField
                        type="number"
                        size="small"
                        value={value.occurrences || 4}
                        onChange={(e) => handleChange({ occurrences: parseInt(e.target.value) || 1 })}
                        inputProps={{ min: 1, max: 52 }}
                        sx={{ width: 80 }}
                        disabled={value.endType !== 'after'}
                      />
                      <span>occurrences</span>
                    </Box>
                  }
                />
                
                <FormControlLabel 
                  value="on" 
                  control={<Radio />} 
                  label={
                    <Box display="flex" alignItems="center" gap={1}>
                      <span>On</span>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          value={value.endDate || null}
                          onChange={(date) => handleChange({ endDate: date || undefined })}
                          minDate={startDate || dayjs()}
                          disabled={value.endType !== 'on'}
                          slotProps={{
                            textField: {
                              size: 'small',
                              sx: { width: 150 }
                            }
                          }}
                        />
                      </LocalizationProvider>
                    </Box>
                  }
                />
              </RadioGroup>
            </>
          )}
          
          {value.type === 'custom' && (
            <Alert severity="info" icon={<Info />}>
              Custom date selection would be implemented with a date picker 
              allowing multiple date selections.
            </Alert>
          )}
          
          <Box mt={4}>
            <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
              <Typography variant="subtitle1">
                Preview Appointments
              </Typography>
              <Chip
                icon={<CalendarMonth />}
                label={showPreview ? 'Hide Preview' : 'Show Preview'}
                onClick={() => setShowPreview(!showPreview)}
                variant="outlined"
              />
            </Box>
            
            {showPreview && (
              <Box sx={{ 
                p: 2, 
                bgcolor: 'background.default', 
                borderRadius: 1,
                maxHeight: 200,
                overflow: 'auto'
              }}>
                {generatePreviewDates().map((date, index) => (
                  <Box key={index} display="flex" alignItems="center" gap={1} mb={1}>
                    <Chip 
                      size="small" 
                      label={`#${index + 1}`} 
                      variant="outlined"
                    />
                    <Typography variant="body2">
                      {date.format('dddd, MMMM D, YYYY')}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
          
          {value.enabled && !startDate && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              Please select a start date to configure recurring appointments
            </Alert>
          )}
        </Box>
      )}
    </Box>
  );
};
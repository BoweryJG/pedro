import { createClient } from '@supabase/supabase-js';
import { format, addDays, startOfDay, endOfDay } from 'date-fns';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
);

class CalendarService {
    constructor() {
        this.defaultDuration = 30; // minutes
        this.lookAheadDays = 14; // how many days to check for availability
    }

    /**
     * Get available appointment slots for a provider
     * @param {string} providerId - Provider UUID
     * @param {Date} startDate - Start date to check
     * @param {number} days - Number of days to check
     * @returns {Array} Available time slots
     */
    async getAvailableSlots(providerId, startDate = new Date(), days = 7) {
        try {
            const slots = [];
            const currentDate = new Date(startDate);

            for (let i = 0; i < days; i++) {
                const date = addDays(currentDate, i);
                
                // Skip past dates
                if (date < new Date()) continue;

                // Get available slots for this date
                const { data, error } = await supabase.rpc('generate_available_slots', {
                    p_provider_id: providerId,
                    p_date: format(date, 'yyyy-MM-dd'),
                    p_duration_minutes: this.defaultDuration
                });

                if (error) {
                    console.error('Error getting slots:', error);
                    continue;
                }

                // Add formatted slots
                data.forEach(slot => {
                    slots.push({
                        date: format(new Date(slot.start_time), 'yyyy-MM-dd'),
                        dayName: format(new Date(slot.start_time), 'EEEE'),
                        startTime: format(new Date(slot.start_time), 'h:mm a'),
                        endTime: format(new Date(slot.end_time), 'h:mm a'),
                        startTimestamp: slot.start_time,
                        endTimestamp: slot.end_time,
                        available: true
                    });
                });
            }

            return slots;
        } catch (error) {
            console.error('Error in getAvailableSlots:', error);
            return [];
        }
    }

    /**
     * Find next available slots for conversational booking
     * @param {string} providerId - Provider UUID
     * @param {number} count - Number of slots to return
     * @returns {Array} Next available slots
     */
    async getNextAvailableSlots(providerId, count = 3) {
        try {
            // Use Supabase RPC function
            const { data, error } = await supabase.rpc('get_next_available_slots', {
                p_provider_id: providerId,
                p_count: count,
                p_start_date: format(new Date(), 'yyyy-MM-dd')
            });

            if (error) {
                console.error('Error getting next slots:', error);
                return [];
            }

            // Format the results
            return data.map(slot => ({
                date: format(new Date(slot.start_time), 'yyyy-MM-dd'),
                dayName: slot.day_name.trim(),
                startTime: slot.formatted_time,
                endTime: format(new Date(slot.end_time), 'h:mm a'),
                startTimestamp: slot.start_time,
                endTimestamp: slot.end_time,
                available: true
            }));
        } catch (error) {
            console.error('Error in getNextAvailableSlots:', error);
            return [];
        }
    }

    /**
     * Check if a specific time slot is available
     * @param {string} providerId - Provider UUID
     * @param {Date} startTime - Appointment start time
     * @param {number} duration - Duration in minutes
     * @returns {boolean} Is slot available
     */
    async isSlotAvailable(providerId, startTime, duration = 30) {
        try {
            // Use Supabase RPC function
            const { data, error } = await supabase.rpc('is_slot_available', {
                p_provider_id: providerId,
                p_start_time: startTime.toISOString(),
                p_duration_minutes: duration
            });

            if (error) {
                console.error('Error checking slot availability:', error);
                return false;
            }

            return data === true;
        } catch (error) {
            console.error('Error in isSlotAvailable:', error);
            return false;
        }
    }

    /**
     * Book an appointment slot
     * @param {string} providerId - Provider UUID
     * @param {Date} startTime - Appointment start time
     * @param {string} appointmentId - Appointment UUID
     * @returns {Object} Booking result
     */
    async bookSlot(providerId, startTime, appointmentId, duration = 30) {
        try {
            // Use Supabase RPC function
            const { data, error } = await supabase.rpc('book_appointment_slot', {
                p_provider_id: providerId,
                p_start_time: startTime.toISOString(),
                p_appointment_id: appointmentId,
                p_duration_minutes: duration
            });

            if (error) {
                console.error('Error booking slot:', error);
                return { success: false, error: error.message };
            }

            const result = data[0]; // RPC returns array
            
            if (!result.success) {
                return { success: false, error: result.message };
            }

            return { 
                success: true, 
                slot: { id: result.slot_id },
                message: `Appointment booked for ${format(startTime, 'EEEE, MMMM d at h:mm a')}`
            };
        } catch (error) {
            console.error('Error in bookSlot:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Release/cancel an appointment slot
     * @param {string} slotId - Slot UUID
     * @returns {boolean} Success
     */
    async releaseSlot(slotId) {
        try {
            const { error } = await supabase
                .from('appointment_slots')
                .update({ 
                    is_available: true,
                    appointment_id: null
                })
                .eq('id', slotId);

            return !error;
        } catch (error) {
            console.error('Error releasing slot:', error);
            return false;
        }
    }

    /**
     * Parse natural language time references
     * @param {string} timeRef - Natural language time reference
     * @returns {Object} Parsed date/time info
     */
    parseTimeReference(timeRef) {
        const lower = timeRef.toLowerCase();
        const now = new Date();
        
        // Common patterns
        const patterns = {
            tomorrow: () => addDays(now, 1),
            'next week': () => addDays(now, 7),
            'this week': () => now,
            monday: () => this.getNextWeekday(1),
            tuesday: () => this.getNextWeekday(2),
            wednesday: () => this.getNextWeekday(3),
            thursday: () => this.getNextWeekday(4),
            friday: () => this.getNextWeekday(5),
            saturday: () => this.getNextWeekday(6),
            sunday: () => this.getNextWeekday(0)
        };

        // Time patterns
        const timeMatch = lower.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/);
        let hour = null;
        let minute = 0;

        if (timeMatch) {
            hour = parseInt(timeMatch[1]);
            minute = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
            
            if (timeMatch[3]) {
                if (timeMatch[3] === 'pm' && hour < 12) hour += 12;
                if (timeMatch[3] === 'am' && hour === 12) hour = 0;
            }
        }

        // Find date pattern
        let date = now;
        for (const [pattern, getDate] of Object.entries(patterns)) {
            if (lower.includes(pattern)) {
                date = getDate();
                break;
            }
        }

        return {
            date,
            hour,
            minute,
            parsed: hour !== null
        };
    }

    /**
     * Get next occurrence of a weekday
     * @param {number} dayOfWeek - 0=Sunday, 6=Saturday
     * @returns {Date} Next occurrence
     */
    getNextWeekday(dayOfWeek) {
        const now = new Date();
        const currentDay = now.getDay();
        const daysUntil = (dayOfWeek - currentDay + 7) % 7 || 7;
        return addDays(now, daysUntil);
    }

    /**
     * Format slots for conversational response
     * @param {Array} slots - Available slots
     * @returns {string} Formatted response
     */
    formatSlotsForConversation(slots) {
        if (!slots || slots.length === 0) {
            return "I don't see any available appointments in the next two weeks.";
        }

        const options = slots.map((slot, index) => {
            const isToday = slot.date === format(new Date(), 'yyyy-MM-dd');
            const isTomorrow = slot.date === format(addDays(new Date(), 1), 'yyyy-MM-dd');
            
            let dayText = slot.dayName;
            if (isToday) dayText = 'today';
            else if (isTomorrow) dayText = 'tomorrow';
            
            return `${dayText} at ${slot.startTime}`;
        });

        if (options.length === 1) {
            return `I have ${options[0]} available.`;
        } else if (options.length === 2) {
            return `I have ${options[0]} or ${options[1]} available.`;
        } else {
            const lastOption = options.pop();
            return `I have ${options.join(', ')}, or ${lastOption} available.`;
        }
    }
}

export default new CalendarService();
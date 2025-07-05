-- Phone System Tables Migration for Pedro's Supabase Database
-- This migration creates phone_calls and sms_conversations tables with all necessary columns, indexes, and RLS policies

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create phone_calls table
CREATE TABLE IF NOT EXISTS public.phone_calls (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    call_sid VARCHAR(255) UNIQUE NOT NULL, -- Twilio Call SID
    account_sid VARCHAR(255) NOT NULL, -- Twilio Account SID
    from_number VARCHAR(50) NOT NULL, -- E.164 format phone number
    to_number VARCHAR(50) NOT NULL, -- E.164 format phone number
    direction VARCHAR(20) NOT NULL CHECK (direction IN ('inbound', 'outbound', 'outbound-api', 'outbound-dial')),
    status VARCHAR(20) NOT NULL CHECK (status IN ('queued', 'initiated', 'ringing', 'in-progress', 'completed', 'busy', 'failed', 'no-answer', 'canceled')),
    duration INTEGER DEFAULT 0, -- Duration in seconds
    price DECIMAL(10, 4), -- Call cost
    price_unit VARCHAR(10) DEFAULT 'USD', -- Currency
    answered_by VARCHAR(20) CHECK (answered_by IN ('human', 'machine', 'machine_start', 'machine_end_beep', 'machine_end_silence', 'machine_end_other', 'unknown', 'fax')),
    caller_name VARCHAR(255), -- Caller ID name if available
    recording_url TEXT, -- URL to call recording if enabled
    recording_sid VARCHAR(255), -- Recording SID if available
    recording_duration INTEGER, -- Recording duration in seconds
    transcription_text TEXT, -- Call transcription if available
    transcription_sid VARCHAR(255), -- Transcription SID
    parent_call_sid VARCHAR(255), -- For conference calls or transfers
    conference_sid VARCHAR(255), -- Conference SID if part of conference
    forwarded_from VARCHAR(50), -- Original called number if forwarded
    queue_time INTEGER, -- Time spent in queue in seconds
    
    -- User association (assuming auth.users exists)
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Additional metadata
    metadata JSONB DEFAULT '{}', -- Additional custom data
    tags TEXT[] DEFAULT '{}', -- Tags for categorization
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    started_at TIMESTAMP WITH TIME ZONE,
    ended_at TIMESTAMP WITH TIME ZONE,
    
    -- Search vector for full-text search
    search_vector tsvector GENERATED ALWAYS AS (
        to_tsvector('english', 
            COALESCE(from_number, '') || ' ' || 
            COALESCE(to_number, '') || ' ' || 
            COALESCE(caller_name, '') || ' ' || 
            COALESCE(transcription_text, '')
        )
    ) STORED
);

-- Create sms_conversations table
CREATE TABLE IF NOT EXISTS public.sms_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_sid VARCHAR(255) UNIQUE NOT NULL, -- Unique conversation identifier
    from_number VARCHAR(50) NOT NULL, -- Primary participant phone number
    to_number VARCHAR(50) NOT NULL, -- Other participant phone number
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived', 'deleted')),
    
    -- User association
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Conversation metadata
    last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    message_count INTEGER DEFAULT 0,
    unread_count INTEGER DEFAULT 0,
    
    -- Additional metadata
    metadata JSONB DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sms_messages table (child of sms_conversations)
CREATE TABLE IF NOT EXISTS public.sms_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES public.sms_conversations(id) ON DELETE CASCADE,
    message_sid VARCHAR(255) UNIQUE NOT NULL, -- Twilio Message SID
    account_sid VARCHAR(255) NOT NULL,
    from_number VARCHAR(50) NOT NULL,
    to_number VARCHAR(50) NOT NULL,
    direction VARCHAR(20) NOT NULL CHECK (direction IN ('inbound', 'outbound', 'outbound-api', 'outbound-call', 'outbound-reply')),
    status VARCHAR(20) NOT NULL CHECK (status IN ('accepted', 'queued', 'sending', 'sent', 'failed', 'delivered', 'undelivered', 'receiving', 'received', 'read')),
    body TEXT NOT NULL,
    num_segments INTEGER DEFAULT 1,
    num_media INTEGER DEFAULT 0,
    media_urls TEXT[] DEFAULT '{}', -- Array of media URLs
    price DECIMAL(10, 4),
    price_unit VARCHAR(10) DEFAULT 'USD',
    error_code VARCHAR(20),
    error_message TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    sent_at TIMESTAMP WITH TIME ZONE,
    delivered_at TIMESTAMP WITH TIME ZONE,
    read_at TIMESTAMP WITH TIME ZONE,
    
    -- Search vector
    search_vector tsvector GENERATED ALWAYS AS (
        to_tsvector('english', COALESCE(body, ''))
    ) STORED
);

-- Create indexes for phone_calls
CREATE INDEX idx_phone_calls_user_id ON public.phone_calls(user_id);
CREATE INDEX idx_phone_calls_from_number ON public.phone_calls(from_number);
CREATE INDEX idx_phone_calls_to_number ON public.phone_calls(to_number);
CREATE INDEX idx_phone_calls_status ON public.phone_calls(status);
CREATE INDEX idx_phone_calls_direction ON public.phone_calls(direction);
CREATE INDEX idx_phone_calls_created_at ON public.phone_calls(created_at DESC);
CREATE INDEX idx_phone_calls_call_sid ON public.phone_calls(call_sid);
CREATE INDEX idx_phone_calls_search ON public.phone_calls USING GIN(search_vector);
CREATE INDEX idx_phone_calls_tags ON public.phone_calls USING GIN(tags);

-- Create indexes for sms_conversations
CREATE INDEX idx_sms_conversations_user_id ON public.sms_conversations(user_id);
CREATE INDEX idx_sms_conversations_from_number ON public.sms_conversations(from_number);
CREATE INDEX idx_sms_conversations_to_number ON public.sms_conversations(to_number);
CREATE INDEX idx_sms_conversations_status ON public.sms_conversations(status);
CREATE INDEX idx_sms_conversations_last_message_at ON public.sms_conversations(last_message_at DESC);
CREATE INDEX idx_sms_conversations_tags ON public.sms_conversations USING GIN(tags);

-- Create indexes for sms_messages
CREATE INDEX idx_sms_messages_conversation_id ON public.sms_messages(conversation_id);
CREATE INDEX idx_sms_messages_message_sid ON public.sms_messages(message_sid);
CREATE INDEX idx_sms_messages_created_at ON public.sms_messages(created_at DESC);
CREATE INDEX idx_sms_messages_search ON public.sms_messages USING GIN(search_vector);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER update_phone_calls_updated_at BEFORE UPDATE ON public.phone_calls
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sms_conversations_updated_at BEFORE UPDATE ON public.sms_conversations
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_sms_messages_updated_at BEFORE UPDATE ON public.sms_messages
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to update conversation metadata when message is added
CREATE OR REPLACE FUNCTION public.update_conversation_on_message()
RETURNS TRIGGER AS $$
BEGIN
    -- Update conversation metadata
    UPDATE public.sms_conversations
    SET 
        last_message_at = NEW.created_at,
        message_count = message_count + 1,
        unread_count = CASE 
            WHEN NEW.direction = 'inbound' THEN unread_count + 1 
            ELSE unread_count 
        END
    WHERE id = NEW.conversation_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger for message inserts
CREATE TRIGGER update_conversation_on_message_insert 
    AFTER INSERT ON public.sms_messages
    FOR EACH ROW EXECUTE FUNCTION public.update_conversation_on_message();

-- Enable Row Level Security (RLS)
ALTER TABLE public.phone_calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sms_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sms_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for phone_calls
-- Users can only see their own phone calls
CREATE POLICY "Users can view own phone calls" ON public.phone_calls
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own phone calls" ON public.phone_calls
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own phone calls" ON public.phone_calls
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own phone calls" ON public.phone_calls
    FOR DELETE USING (auth.uid() = user_id);

-- Service role can do everything
CREATE POLICY "Service role has full access to phone calls" ON public.phone_calls
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- RLS Policies for sms_conversations
CREATE POLICY "Users can view own conversations" ON public.sms_conversations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own conversations" ON public.sms_conversations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own conversations" ON public.sms_conversations
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own conversations" ON public.sms_conversations
    FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Service role has full access to conversations" ON public.sms_conversations
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- RLS Policies for sms_messages
-- Users can see messages in their conversations
CREATE POLICY "Users can view messages in own conversations" ON public.sms_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.sms_conversations
            WHERE id = sms_messages.conversation_id
            AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert messages in own conversations" ON public.sms_messages
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.sms_conversations
            WHERE id = sms_messages.conversation_id
            AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update messages in own conversations" ON public.sms_messages
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.sms_conversations
            WHERE id = sms_messages.conversation_id
            AND user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete messages in own conversations" ON public.sms_messages
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM public.sms_conversations
            WHERE id = sms_messages.conversation_id
            AND user_id = auth.uid()
        )
    );

CREATE POLICY "Service role has full access to messages" ON public.sms_messages
    FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Create views for common queries
CREATE OR REPLACE VIEW public.recent_calls AS
SELECT 
    pc.*,
    CASE 
        WHEN pc.direction IN ('inbound') THEN pc.from_number
        ELSE pc.to_number
    END as contact_number
FROM public.phone_calls pc
WHERE pc.created_at > NOW() - INTERVAL '30 days'
ORDER BY pc.created_at DESC;

CREATE OR REPLACE VIEW public.conversation_summary AS
SELECT 
    sc.*,
    (
        SELECT json_agg(
            json_build_object(
                'id', sm.id,
                'body', sm.body,
                'direction', sm.direction,
                'created_at', sm.created_at
            ) ORDER BY sm.created_at DESC
        )
        FROM public.sms_messages sm
        WHERE sm.conversation_id = sc.id
        LIMIT 10
    ) as recent_messages
FROM public.sms_conversations sc;

-- Grant permissions on views
GRANT SELECT ON public.recent_calls TO authenticated;
GRANT SELECT ON public.conversation_summary TO authenticated;

-- Create function to find or create conversation
CREATE OR REPLACE FUNCTION public.find_or_create_conversation(
    p_user_id UUID,
    p_from_number VARCHAR(50),
    p_to_number VARCHAR(50)
)
RETURNS UUID AS $$
DECLARE
    v_conversation_id UUID;
    v_normalized_from VARCHAR(50);
    v_normalized_to VARCHAR(50);
BEGIN
    -- Normalize phone numbers (ensure consistent format)
    v_normalized_from := p_from_number;
    v_normalized_to := p_to_number;
    
    -- Try to find existing conversation
    SELECT id INTO v_conversation_id
    FROM public.sms_conversations
    WHERE user_id = p_user_id
    AND (
        (from_number = v_normalized_from AND to_number = v_normalized_to) OR
        (from_number = v_normalized_to AND to_number = v_normalized_from)
    )
    AND status != 'deleted'
    LIMIT 1;
    
    -- Create new conversation if not found
    IF v_conversation_id IS NULL THEN
        INSERT INTO public.sms_conversations (user_id, from_number, to_number)
        VALUES (p_user_id, v_normalized_from, v_normalized_to)
        RETURNING id INTO v_conversation_id;
    END IF;
    
    RETURN v_conversation_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to mark messages as read
CREATE OR REPLACE FUNCTION public.mark_messages_read(p_conversation_id UUID)
RETURNS void AS $$
BEGIN
    -- Update messages
    UPDATE public.sms_messages
    SET read_at = NOW()
    WHERE conversation_id = p_conversation_id
    AND direction = 'inbound'
    AND read_at IS NULL;
    
    -- Reset unread count
    UPDATE public.sms_conversations
    SET unread_count = 0
    WHERE id = p_conversation_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Comments for documentation
COMMENT ON TABLE public.phone_calls IS 'Stores all phone call records with Twilio integration';
COMMENT ON TABLE public.sms_conversations IS 'Stores SMS conversation threads between two phone numbers';
COMMENT ON TABLE public.sms_messages IS 'Stores individual SMS messages within conversations';

COMMENT ON COLUMN public.phone_calls.call_sid IS 'Unique identifier from Twilio for this call';
COMMENT ON COLUMN public.phone_calls.direction IS 'Direction of the call: inbound, outbound, outbound-api, or outbound-dial';
COMMENT ON COLUMN public.phone_calls.status IS 'Current status of the call';
COMMENT ON COLUMN public.phone_calls.answered_by IS 'Who answered the call: human, machine, etc.';

COMMENT ON COLUMN public.sms_conversations.conversation_sid IS 'Unique identifier for the conversation thread';
COMMENT ON COLUMN public.sms_conversations.unread_count IS 'Number of unread inbound messages';

COMMENT ON COLUMN public.sms_messages.message_sid IS 'Unique identifier from Twilio for this message';
COMMENT ON COLUMN public.sms_messages.num_segments IS 'Number of SMS segments used for long messages';
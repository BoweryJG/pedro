import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';
import FormData from 'form-data';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class TranscriptionService {
  constructor() {
    this.openaiApiKey = process.env.OPENAI_API_KEY;
    this.huggingfaceToken = process.env.HUGGINGFACE_TOKEN;
    this.googleCredentials = process.env.GOOGLE_APPLICATION_CREDENTIALS;
    
    // Initialize Google Speech client if credentials are available
    if (this.googleCredentials) {
      this.initGoogleSpeech();
    }
  }

  async initGoogleSpeech() {
    try {
      const { SpeechClient } = await import('@google-cloud/speech');
      this.googleSpeechClient = new SpeechClient();
    } catch (error) {
      console.error('Failed to initialize Google Speech client:', error);
    }
  }

  // Transcribe audio using OpenAI Whisper API
  async transcribeWithWhisper(audioBuffer, language = 'en') {
    if (!this.openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    try {
      const formData = new FormData();
      formData.append('file', audioBuffer, {
        filename: 'audio.mp3',
        contentType: 'audio/mpeg'
      });
      formData.append('model', 'whisper-1');
      formData.append('language', language);
      formData.append('response_format', 'json');

      const response = await axios.post(
        'https://api.openai.com/v1/audio/transcriptions',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${this.openaiApiKey}`,
            ...formData.getHeaders()
          }
        }
      );

      return {
        text: response.data.text,
        service: 'openai-whisper'
      };
    } catch (error) {
      console.error('Whisper transcription error:', error);
      throw error;
    }
  }

  // Transcribe audio using Hugging Face Whisper model
  async transcribeWithHuggingFace(audioBuffer) {
    if (!this.huggingfaceToken) {
      throw new Error('Hugging Face token not configured');
    }

    try {
      const response = await axios.post(
        'https://api-inference.huggingface.co/models/openai/whisper-large-v3',
        audioBuffer,
        {
          headers: {
            'Authorization': `Bearer ${this.huggingfaceToken}`,
            'Content-Type': 'audio/mpeg'
          }
        }
      );

      return {
        text: response.data.text,
        service: 'huggingface-whisper'
      };
    } catch (error) {
      console.error('Hugging Face transcription error:', error);
      throw error;
    }
  }

  // Transcribe audio using Google Speech-to-Text
  async transcribeWithGoogle(audioBuffer, encoding = 'MP3', sampleRateHertz = 16000) {
    if (!this.googleSpeechClient) {
      throw new Error('Google Speech client not initialized');
    }

    try {
      const audio = {
        content: audioBuffer.toString('base64')
      };

      const config = {
        encoding: encoding,
        sampleRateHertz: sampleRateHertz,
        languageCode: 'en-US',
        enableAutomaticPunctuation: true,
        enableWordTimeOffsets: false,
        model: 'phone_call' // Optimized for phone call audio
      };

      const request = {
        audio: audio,
        config: config
      };

      const [response] = await this.googleSpeechClient.recognize(request);
      const transcription = response.results
        .map(result => result.alternatives[0].transcript)
        .join('\n');

      return {
        text: transcription,
        service: 'google-speech',
        confidence: response.results[0]?.alternatives[0]?.confidence || null
      };
    } catch (error) {
      console.error('Google Speech transcription error:', error);
      throw error;
    }
  }

  // Main transcription method that tries multiple services
  async transcribe(audioBuffer, options = {}) {
    const {
      preferredService = 'auto',
      language = 'en',
      encoding = 'MP3',
      sampleRate = 16000
    } = options;

    let transcriptionResult = null;
    let errors = [];

    // Try preferred service first
    if (preferredService === 'whisper' && this.openaiApiKey) {
      try {
        transcriptionResult = await this.transcribeWithWhisper(audioBuffer, language);
      } catch (error) {
        errors.push({ service: 'whisper', error: error.message });
      }
    } else if (preferredService === 'google' && this.googleSpeechClient) {
      try {
        transcriptionResult = await this.transcribeWithGoogle(audioBuffer, encoding, sampleRate);
      } catch (error) {
        errors.push({ service: 'google', error: error.message });
      }
    } else if (preferredService === 'huggingface' && this.huggingfaceToken) {
      try {
        transcriptionResult = await this.transcribeWithHuggingFace(audioBuffer);
      } catch (error) {
        errors.push({ service: 'huggingface', error: error.message });
      }
    }

    // If preferred service failed or auto mode, try other services
    if (!transcriptionResult) {
      // Try OpenAI Whisper
      if (this.openaiApiKey && preferredService !== 'whisper') {
        try {
          transcriptionResult = await this.transcribeWithWhisper(audioBuffer, language);
        } catch (error) {
          errors.push({ service: 'whisper', error: error.message });
        }
      }

      // Try Google Speech
      if (!transcriptionResult && this.googleSpeechClient && preferredService !== 'google') {
        try {
          transcriptionResult = await this.transcribeWithGoogle(audioBuffer, encoding, sampleRate);
        } catch (error) {
          errors.push({ service: 'google', error: error.message });
        }
      }

      // Try Hugging Face as last resort
      if (!transcriptionResult && this.huggingfaceToken && preferredService !== 'huggingface') {
        try {
          transcriptionResult = await this.transcribeWithHuggingFace(audioBuffer);
        } catch (error) {
          errors.push({ service: 'huggingface', error: error.message });
        }
      }
    }

    if (!transcriptionResult) {
      throw new Error(`All transcription services failed: ${JSON.stringify(errors)}`);
    }

    return {
      ...transcriptionResult,
      timestamp: new Date().toISOString(),
      errors: errors.length > 0 ? errors : undefined
    };
  }

  // Download audio from URL and transcribe
  async transcribeFromUrl(audioUrl, options = {}) {
    try {
      // Download audio file
      const response = await axios.get(audioUrl, {
        responseType: 'arraybuffer'
      });

      const audioBuffer = Buffer.from(response.data);
      return await this.transcribe(audioBuffer, options);
    } catch (error) {
      console.error('Error transcribing from URL:', error);
      throw error;
    }
  }

  // Format transcription for database storage
  formatTranscription(transcription, metadata = {}) {
    return {
      text: transcription.text,
      service: transcription.service,
      confidence: transcription.confidence,
      timestamp: transcription.timestamp,
      duration: metadata.duration,
      language: metadata.language || 'en',
      metadata: {
        ...metadata,
        errors: transcription.errors
      }
    };
  }

  // Extract key information from transcription using AI
  async extractKeyInfo(transcriptionText) {
    if (!this.openaiApiKey) {
      return null;
    }

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `You are an AI assistant helping a dental office analyze call transcriptions. 
                       Extract key information such as:
                       - Patient name
                       - Contact information
                       - Reason for call
                       - Appointment requests
                       - Insurance questions
                       - Treatment inquiries
                       - Urgency level
                       Return the information in a structured JSON format.`
            },
            {
              role: 'user',
              content: transcriptionText
            }
          ],
          temperature: 0.3,
          max_tokens: 500
        },
        {
          headers: {
            'Authorization': `Bearer ${this.openaiApiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return JSON.parse(response.data.choices[0].message.content);
    } catch (error) {
      console.error('Error extracting key info:', error);
      return null;
    }
  }

  // Generate summary of transcription
  async generateSummary(transcriptionText) {
    if (!this.openaiApiKey) {
      return null;
    }

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'Summarize this dental office phone call in 2-3 sentences, highlighting the main purpose and any action items.'
            },
            {
              role: 'user',
              content: transcriptionText
            }
          ],
          temperature: 0.5,
          max_tokens: 150
        },
        {
          headers: {
            'Authorization': `Bearer ${this.openaiApiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('Error generating summary:', error);
      return null;
    }
  }
}

export default TranscriptionService;
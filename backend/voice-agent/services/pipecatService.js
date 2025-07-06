import { PipecatFramework, Pipeline } from 'pipecat-node';
import { WhisperSTT } from './whisperSTT.js';
import { CoquiTTS } from './coquiTTS.js';
import { MedicalLLM } from './medicalLLM.js';
import { LiveKitTransport } from './livekitTransport.js';

export class PipecatService {
  constructor() {
    this.framework = new PipecatFramework();
    this.activePipelines = new Map();
  }

  async createVoiceAgentPipeline(sessionId, roomName) {
    // Create pipeline components
    const stt = new WhisperSTT({
      model: 'whisper-1',
      language: 'en',
      temperature: 0.0
    });

    const llm = new MedicalLLM({
      model: 'gpt-4-turbo-preview',
      systemPrompt: this.getMedicalSystemPrompt(),
      temperature: 0.7,
      maxTokens: 150
    });

    const tts = new CoquiTTS({
      voice: 'aura-2-thalia-en', // Professional female voice
      speed: 1.0,
      pitch: 1.0
    });

    const transport = new LiveKitTransport({
      roomName,
      participantName: 'AI_Assistant_Julie'
    });

    // Create and configure pipeline
    const pipeline = new Pipeline([
      transport.audioInput(),
      stt,
      llm,
      tts,
      transport.audioOutput()
    ]);

    // Add context and interruption handling
    pipeline.addInterruptionHandler(() => {
      console.log('User interrupted - stopping current response');
      tts.stop();
      llm.stop();
    });

    // Store pipeline
    this.activePipelines.set(sessionId, pipeline);

    // Start the pipeline
    await pipeline.start();

    return pipeline;
  }

  getMedicalSystemPrompt() {
    return `You are Julie, a professional and caring AI receptionist for Dr. Pedro's Advanced Dental Care & MedSpa located at 4300 Hylan Blvd, Staten Island, NY 10312.

Your role is to:
1. Answer questions about dental, robotic implant, TMJ, and aesthetic treatments
2. Help patients book appointments
3. Provide directions to the office
4. Explain financing options and insurance
5. Be warm, professional, and helpful

Key Information:
- Location: 4300 Hylan Blvd, Staten Island, NY 10312
- Phone: 929-242-4535
- Hours: Monday-Friday 9AM-6PM, Saturday 9AM-2PM

SPECIALIZED SERVICES:

1. YOMI ROBOTIC IMPLANTS
- First FDA-approved dental robot with 99.5% precision
- 50% faster healing than traditional implants
- Dr. Pedro has performed 500+ robotic procedures
- Pricing: Single implant $4,500-6,500

2. EMFACE BY BTL AESTHETICS
- Non-invasive facial muscle toning and skin tightening
- No needles, no downtime, 20-minute sessions
- Natural facelift effect using RF and HIFEM+ technology
- Package of 4 sessions recommended

3. TMJ TREATMENT
- Dr. Pedro is a published TMJ expert (wrote the book on TMJ Syndrome)
- 95% pain relief success rate, 30+ years experience
- Advanced treatments: BOTOX, electrophoresis, acoustic shockwave therapy
- Comprehensive evaluation available

4. OTHER SERVICES
- General & cosmetic dentistry
- Botox & dermal fillers
- Teeth whitening, veneers, Invisalign

FINANCING: CareCredit, Cherry, Sunbit, Affirm available. Most insurance accepted.

Always be concise but thorough. Emphasize Dr. Pedro's expertise and advanced technology. Schedule consultations for personalized treatment plans.`;
  }

  async stopPipeline(sessionId) {
    const pipeline = this.activePipelines.get(sessionId);
    if (pipeline) {
      await pipeline.stop();
      this.activePipelines.delete(sessionId);
    }
  }

  async handleVoiceInteraction(sessionId, roomName) {
    try {
      const pipeline = await this.createVoiceAgentPipeline(sessionId, roomName);
      
      // Monitor pipeline events
      pipeline.on('transcription', (text) => {
        console.log(`Patient said: ${text}`);
      });

      pipeline.on('response', (text) => {
        console.log(`Julie responding: ${text}`);
      });

      pipeline.on('error', (error) => {
        console.error('Pipeline error:', error);
      });

      return pipeline;
    } catch (error) {
      console.error('Failed to create voice pipeline:', error);
      throw error;
    }
  }
}

export default PipecatService;
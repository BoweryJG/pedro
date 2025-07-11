import { ElevenLabsTTS } from './services/elevenLabsTTS.js';
import fs from 'fs/promises';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function testSpanishVoices() {
  console.log('🇪🇸 Testing fluent Spanish voices for Dr. Pedro\'s office...\n');
  
  try {
    // Professional Spanish texts for dental office
    const spanishTexts = {
      // Female - Professional Spanish receptionist
      femaleWelcome: "¡Buenos días! Bienvenido a la oficina del Dr. Pedro. Soy María, su coordinadora de cuidado personal. ¿En qué puedo ayudarle hoy? Tenemos tecnología de punta y el Dr. Pedro es el único en Staten Island con el robot YOMI. ¿Le gustaría agendar una consulta?",
      
      femaleAppointment: "Por supuesto, con mucho gusto le ayudo a programar su cita. El Dr. Pedro tiene disponibilidad este jueves a las 2 de la tarde o el lunes a las 10 de la mañana. ¿Cuál horario le conviene más? También ofrecemos planes de financiamiento muy accesibles.",
      
      femaleComfort: "Entiendo perfectamente su preocupación. Muchos pacientes llegan nerviosos, pero le aseguro que está en las mejores manos. El Dr. Pedro ha realizado más de 500 implantes exitosos. Con el robot YOMI, todo es más preciso y la recuperación es mucho más rápida. ¿Tiene alguna pregunta específica?",
      
      // Male - Professional Spanish assistant
      maleWelcome: "¡Bienvenido! Me da mucho gusto que esté aquí. Soy Carlos, asistente del Dr. Pedro. Déjeme contarle, nuestro doctor es extraordinario. Con el sistema robótico YOMI podemos darle exactamente la sonrisa que usted desea. ¿Qué problema dental lo trae por aquí hoy?",
      
      maleExplain: "Mire, le voy a explicar exactamente cómo funciona. El robot YOMI nos da una precisión del 99.5%, algo imposible de lograr manualmente. Mi propia madre se hizo tres implantes aquí el año pasado y quedó fascinada. La cirugía fue rápida, sin dolor, y ahora come de todo sin problemas.",
      
      maleClosing: "Perfecto, ya agendé su cita para el jueves a las 2. Le voy a enviar un mensaje de texto con la confirmación. Nuestra oficina está en 1520 Richmond Avenue. Si necesita indicaciones o tiene cualquier pregunta, no dude en llamarnos. ¡Nos vemos pronto!"
    };
    
    // Spanish voice configurations
    const spanishVoices = [
      {
        name: 'Maria_Spanish_Pro',
        voiceId: 'EXAVITQu4vr4xnSDxMaL', // Sarah for Spanish
        texts: [spanishTexts.femaleWelcome, spanishTexts.femaleAppointment, spanishTexts.femaleComfort],
        settings: { 
          stability: 0.6,  // Professional tone
          similarity_boost: 0.7,
          style: 0.5  // Moderate expression
        }
      },
      {
        name: 'Carlos_Spanish_Pro',
        voiceId: 'nPczCjzI2devNBz1zQrb', // Brian for Spanish
        texts: [spanishTexts.maleWelcome, spanishTexts.maleExplain, spanishTexts.maleClosing],
        settings: { 
          stability: 0.55,
          similarity_boost: 0.65,
          style: 0.6  // Warm but professional
        }
      }
    ];
    
    console.log('🦷 Testing professional Spanish voices for dental office...\n');
    
    for (const voice of spanishVoices) {
      const gender = voice.name.includes('Maria') ? '👩' : '👨';
      console.log(`\n${gender} ${voice.name.toUpperCase()} - Professional Spanish ${gender === '👩' ? 'Female' : 'Male'}:\n`);
      
      for (let i = 0; i < voice.texts.length; i++) {
        const scenarios = ['GREETING', 'APPOINTMENT', 'REASSURANCE'];
        console.log(`   ${scenarios[i]}:`);
        console.log(`   "${voice.texts[i].substring(0, 80)}..."`);
        
        try {
          const voiceTTS = new ElevenLabsTTS({
            voiceId: voice.voiceId,
            modelId: 'eleven_turbo_v2',
            ...voice.settings
          });
          
          const startTime = Date.now();
          const audioData = await voiceTTS.textToSpeech(voice.texts[i]);
          const duration = Date.now() - startTime;
          
          const filename = `spanish_${voice.name.toLowerCase()}_${scenarios[i].toLowerCase()}.mp3`;
          await fs.writeFile(filename, audioData);
          
          console.log(`   ✅ Generated in ${duration}ms`);
          console.log(`   💾 Saved to ${filename}`);
          
          try {
            await execAsync(`afplay ${filename}`);
            console.log(`   🔊 Playing professional Spanish ${gender === '👩' ? 'señora' : 'señor'}...\n`);
            await new Promise(resolve => setTimeout(resolve, 6000));
          } catch (playError) {
            console.log('   ℹ️  Saved for playback\n');
          }
        } catch (error) {
          console.log(`   ❌ Error: ${error.message}\n`);
        }
      }
    }
    
    // Also create one combined demo for each voice
    console.log('\n🎙️ Creating combined demos...\n');
    
    const combinedTexts = {
      female: "¡Hola! Bienvenido a la oficina del Dr. Pedro. Somos especialistas en implantes robóticos y transformaciones de sonrisas. Con nuestra tecnología YOMI, podemos darle resultados perfectos. ¿Le gustaría saber más sobre nuestros servicios? Hablamos español e inglés para su comodidad.",
      male: "Buenos días, qué gusto tenerlo aquí. El Dr. Pedro es el mejor dentista de Staten Island, sin duda. Tenemos la tecnología más avanzada y planes de pago desde 89 dólares al mes. No hay nada que no podamos solucionar. ¿Cuándo le gustaría venir para su consulta?"
    };
    
    const demos = [
      { name: 'maria_demo', voiceId: 'EXAVITQu4vr4xnSDxMaL', text: combinedTexts.female },
      { name: 'carlos_demo', voiceId: 'nPczCjzI2devNBz1zQrb', text: combinedTexts.male }
    ];
    
    for (const demo of demos) {
      try {
        const voiceTTS = new ElevenLabsTTS({
          voiceId: demo.voiceId,
          modelId: 'eleven_turbo_v2',
          stability: 0.6,
          similarity_boost: 0.7,
          style: 0.55
        });
        
        const audioData = await voiceTTS.textToSpeech(demo.text);
        const filename = `spanish_${demo.name}.mp3`;
        await fs.writeFile(filename, audioData);
        
        console.log(`✅ Created ${filename}`);
      } catch (error) {
        console.log(`❌ Error creating demo: ${error.message}`);
      }
    }
    
    console.log('\n\n🇪🇸 Spanish voice testing complete!');
    console.log('\n📋 Created voices:');
    console.log('\nFEMALE - María:');
    console.log('   - spanish_maria_spanish_pro_greeting.mp3');
    console.log('   - spanish_maria_spanish_pro_appointment.mp3');
    console.log('   - spanish_maria_spanish_pro_reassurance.mp3');
    console.log('   - spanish_maria_demo.mp3');
    console.log('\nMALE - Carlos:');
    console.log('   - spanish_carlos_spanish_pro_greeting.mp3');
    console.log('   - spanish_carlos_spanish_pro_appointment.mp3');
    console.log('   - spanish_carlos_spanish_pro_reassurance.mp3');
    console.log('   - spanish_carlos_demo.mp3');
    console.log('\n   Professional Spanish-speaking staff for Dr. Pedro! 🦷');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testSpanishVoices();
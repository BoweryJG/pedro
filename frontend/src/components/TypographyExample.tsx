import React from 'react';

/**
 * Typography Example Component
 * Demonstrates the Bodoni Moda typography system implementation
 */
const TypographyExample: React.FC = () => {
  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '3rem' }}>
        Bodoni Moda Typography System
      </h1>
      
      {/* Hero Examples */}
      <section style={{ marginBottom: '4rem' }}>
        <h2>Hero Typography</h2>
        
        <div className="hero-section" style={{ padding: '2rem', background: '#f8f9fa', borderRadius: '12px' }}>
          <h1 className="hero-h1">Experience Precision Dentistry</h1>
          <h2 className="hero-h2">Advanced Technology, Compassionate Care</h2>
          <h3 className="hero-h3">Staten Island's Premier Dental Practice</h3>
        </div>
      </section>
      
      {/* Subdomain Variations */}
      <section style={{ marginBottom: '4rem' }}>
        <h2>Subdomain Typography Variations</h2>
        
        {/* TMJ - Precision */}
        <div className="tmj-typography" style={{ padding: '2rem', background: '#e3f2fd', borderRadius: '12px', marginBottom: '2rem' }}>
          <h3>TMJ - Precision Focus (tighter letter-spacing: -0.02em)</h3>
          <h1>Advanced TMJ Treatment</h1>
          <button className="luxury-button tmj-button-text">Book Consultation</button>
        </div>
        
        {/* MedSpa - Luxury */}
        <div className="medspa-typography" style={{ padding: '2rem', background: '#fce4ec', borderRadius: '12px', marginBottom: '2rem' }}>
          <h3>MedSpa - Luxury Feel (generous letter-spacing: 0.05em)</h3>
          <h1>Aesthetic Excellence</h1>
          <button className="luxury-button medspa-button-text">Explore Treatments</button>
        </div>
        
        {/* Robotic - Technical */}
        <div className="robotic-typography" style={{ padding: '2rem', background: '#e8eaf6', borderRadius: '12px', marginBottom: '2rem' }}>
          <h3>Robotic - Technical Precision (condensed variant)</h3>
          <h1>Robotic Dental Surgery</h1>
          <button className="luxury-button robotic-button-text">Learn More</button>
        </div>
      </section>
      
      {/* Fashion Editorial Classes */}
      <section style={{ marginBottom: '4rem' }}>
        <h2>Fashion-Forward Editorial Classes</h2>
        
        <div style={{ padding: '2rem', background: '#1a1a1a', color: 'white', borderRadius: '12px' }}>
          <h1 className="fashion-headline">VOGUE</h1>
          <p className="vogue-subheading">The Art of Modern Dentistry</p>
          <p className="fashion-caption">Excellence • Innovation • Artistry</p>
        </div>
      </section>
      
      {/* Button Examples */}
      <section>
        <h2>Button Typography</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button className="luxury-button">Standard Button</button>
          <button className="luxury-button tmj-button-text">TMJ Button</button>
          <button className="luxury-button medspa-button-text">MedSpa Button</button>
          <button className="luxury-button robotic-button-text">Robotic Button</button>
        </div>
      </section>
      
      {/* Typography Specifications */}
      <section style={{ marginTop: '4rem', padding: '2rem', background: '#f5f5f5', borderRadius: '12px' }}>
        <h2>Typography Specifications</h2>
        <ul style={{ lineHeight: '2' }}>
          <li><strong>Font Family:</strong> Bodoni Moda (primary), Inter (secondary)</li>
          <li><strong>h1:</strong> font-weight: 900, font-optical-sizing: 96</li>
          <li><strong>h2:</strong> font-weight: 800, font-optical-sizing: 72</li>
          <li><strong>h3:</strong> font-weight: 700, font-optical-sizing: 48</li>
          <li><strong>Buttons:</strong> Inter, uppercase, letter-spacing: 0.1em</li>
          <li><strong>Fallbacks:</strong> Playfair Display → Georgia → Times New Roman → serif</li>
        </ul>
      </section>
    </div>
  );
};

export default TypographyExample;
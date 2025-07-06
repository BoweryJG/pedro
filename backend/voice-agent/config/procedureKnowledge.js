export const procedureKnowledge = {
  yomi_robotic_implants: {
    name: "Yomi Robotic Implant Surgery",
    description: "FDA-approved robotic system for dental implant surgery with 99.5% precision accuracy",
    key_benefits: [
      "First and only FDA-approved dental robot",
      "99.5% precision accuracy",
      "50% faster healing time",
      "Minimally invasive with smaller incisions",
      "Real-time surgical guidance",
      "3D surgical planning",
      "Predictable outcomes",
      "Less post-operative discomfort"
    ],
    procedure_steps: [
      "3D imaging and digital treatment planning",
      "Robotic surgery with Yomi guidance (1-2 hours)",
      "Accelerated healing period (2-3 months)",
      "Final crown placement"
    ],
    pricing: {
      single_implant: { min: 4500, max: 6500 },
      multiple_implants: { min: 12000, max: 20000 },
      full_mouth: { min: 35000, max: 55000 }
    },
    ideal_for: "Patients seeking the most precise and predictable implant placement with faster healing"
  },
  
  emface_treatment: {
    name: "EmFace by BTL Aesthetics",
    description: "Revolutionary non-invasive facial muscle toning and skin tightening treatment",
    key_benefits: [
      "Simultaneous muscle toning and skin tightening",
      "Natural facelift effect without surgery",
      "No needles, no downtime",
      "20-minute treatments",
      "Pain-free procedure",
      "Visible results after first session",
      "FDA-cleared technology",
      "Builds collagen naturally"
    ],
    how_it_works: "EmFace uses synchronized radiofrequency and HIFEM+ (High-Intensity Focused Electromagnetic) technology to simultaneously treat facial skin and muscles",
    treatment_areas: [
      "Forehead lifting",
      "Cheek enhancement",
      "Jawline definition",
      "Overall facial contouring"
    ],
    pricing: {
      single_session: { min: 800, max: 1500 },
      package_of_4: { min: 2800, max: 5000 },
      maintenance: { min: 600, max: 1000 }
    },
    treatment_protocol: "Recommended 4 treatments, once per week, with maintenance every 3-6 months",
    ideal_for: "Patients looking for non-invasive facial rejuvenation without needles or surgery"
  },
  
  tmj_treatment: {
    name: "TMJ/TMD Comprehensive Treatment",
    description: "Advanced TMJ disorder treatment by Dr. Pedro, author of 'TMJ Syndrome: A Comprehensive Guide'",
    symptoms_treated: [
      "Jaw pain and clicking",
      "Chronic headaches",
      "Facial pain",
      "Neck and shoulder tension",
      "Limited jaw movement",
      "Teeth grinding (bruxism)",
      "Ear pain and fullness"
    ],
    treatment_options: [
      {
        name: "BOTOX Therapy",
        description: "Therapeutic BOTOX injections to relax jaw muscles",
        benefits: ["Immediate relief", "Reduces muscle tension", "Prevents grinding"]
      },
      {
        name: "Electrophoresis with Custom Serums",
        description: "Advanced therapy using electrical currents to deliver healing serums",
        benefits: ["Deep tissue penetration", "Reduces inflammation", "Accelerates healing"]
      },
      {
        name: "Acoustic Shockwave Therapy",
        description: "Non-invasive treatment using sound waves to promote healing",
        benefits: ["Stimulates blood flow", "Breaks up scar tissue", "Long-lasting relief"]
      },
      {
        name: "Custom Oral Appliances",
        description: "Precision-fitted devices to realign bite and protect teeth",
        benefits: ["Prevents grinding", "Corrects bite", "Protects tooth enamel"]
      }
    ],
    success_rate: "95% patient pain relief rate",
    experience: "Dr. Pedro has over 30 years experience and has treated 1000+ TMJ cases",
    pricing: {
      consultation: { min: 200, max: 400 },
      botox_treatment: { min: 500, max: 800 },
      comprehensive_plan: { min: 2000, max: 5000 }
    },
    ideal_for: "Anyone suffering from jaw pain, headaches, or TMJ-related symptoms"
  },
  
  other_services: {
    dental: [
      "General dentistry",
      "Cosmetic dentistry",
      "Veneers",
      "Invisalign",
      "Teeth whitening",
      "Dental crowns",
      "Root canal therapy"
    ],
    aesthetic: [
      "Botox & Dysport",
      "Dermal fillers",
      "Opus Plasma skin resurfacing",
      "Professional teeth whitening",
      "Combination packages"
    ]
  }
};
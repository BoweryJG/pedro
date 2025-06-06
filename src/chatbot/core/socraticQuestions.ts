export const socraticQuestions = {
  discovery: {
    opening: [
      "What brings you to explore {procedure} today?",
      "I'm curious - what made you start looking into {procedure}?",
      "How long have you been thinking about {procedure}?"
    ],
    pain: [
      "How is {issue} affecting your daily life?",
      "What activities do you find yourself avoiding because of {issue}?",
      "On a scale of 1-10, how much does {issue} impact your quality of life?",
      "What's been the most frustrating part about dealing with {issue}?"
    ],
    history: [
      "Have you explored any other solutions for {issue}?",
      "What treatments have you tried in the past?",
      "What worked and what didn't work with previous approaches?"
    ]
  },
  
  impact: {
    emotional: [
      "How does {issue} make you feel in social situations?",
      "Has {issue} affected your confidence?",
      "What emotions come up when you think about {issue}?"
    ],
    practical: [
      "What specific daily tasks are harder because of {issue}?",
      "How much time do you spend managing or thinking about {issue}?",
      "What would you do differently if {issue} wasn't a concern?"
    ],
    financial: [
      "Have you calculated the ongoing costs of managing {issue}?",
      "What other expenses has {issue} created for you?",
      "How do you think addressing {issue} might save money long-term?"
    ]
  },
  
  vision: {
    immediate: [
      "If we could solve {issue} today, what's the first thing you'd do?",
      "Imagine waking up tomorrow without {issue} - how would your day be different?",
      "What foods would you enjoy again if {issue} was resolved?"
    ],
    lifestyle: [
      "How would fixing {issue} change your professional life?",
      "What social activities would you feel comfortable with again?",
      "How would your relationships improve without {issue}?"
    ],
    longTerm: [
      "Where do you see yourself in 5 years if {issue} is resolved?",
      "What long-term health benefits would solving {issue} provide?",
      "How would addressing {issue} now prevent future problems?"
    ]
  },
  
  commitment: {
    readiness: [
      "What would need to happen for you to feel ready to move forward?",
      "On a scale of 1-10, how committed are you to solving {issue}?",
      "What's holding you back from taking the next step?"
    ],
    concerns: [
      "What concerns do you have about {procedure}?",
      "If I could address {concern}, would that help you feel more confident?",
      "What would make you feel completely comfortable moving forward?"
    ],
    timeline: [
      "When would be the ideal time for you to address {issue}?",
      "How soon would you like to see results?",
      "What's your timeline for making a decision?"
    ]
  },
  
  objectionHandling: {
    cost: [
      "I understand cost is important. Have you considered the long-term cost of NOT addressing {issue}?",
      "What if I told you we have financing options starting at ${amount}/month?",
      "How much is {benefit} worth to your quality of life?",
      "Did you know many patients save money long-term by choosing {procedure}?",
      "Would you like to check if you pre-qualify for 0% financing right now? It only takes 30 seconds.",
      "Did you know 85% of our patients get approved for financing, even with less-than-perfect credit?"
    ],
    insurance: [
      "Would you like me to instantly verify your insurance coverage?",
      "I can check your benefits and estimate your out-of-pocket cost in real-time. Interested?",
      "Many patients are surprised by how much their insurance actually covers. Should we check yours?",
      "Even if insurance doesn't cover everything, we have financing options. Would you like to explore both?"
    ],
    fear: [
      "What specifically worries you about {procedure}?",
      "What if I told you {procedure} is actually less invasive than {alternative}?",
      "Would hearing from other patients who felt the same way help?",
      "How can we make this experience comfortable for you?"
    ],
    time: [
      "I hear you're busy. Did you know {procedure} typically only requires {time}?",
      "What if addressing this now saves you time in the long run?",
      "How much time does {issue} currently take from your life?",
      "Would a streamlined process that fits your schedule help?"
    ],
    trust: [
      "What would help you feel confident in choosing our practice?",
      "Would you like to see our success stories from other Staten Island patients?",
      "What questions can I answer about our doctors' experience with {procedure}?",
      "How important is it to work with someone who specializes in {procedure}?"
    ]
  },
  
  conversion: {
    soft: [
      "Would you like to learn more about how {procedure} works?",
      "Can I share a quick video showing the {procedure} process?",
      "Would seeing before and after photos help you visualize the results?"
    ],
    medium: [
      "Would you be interested in a free consultation to discuss your specific case?",
      "Can I check what times our doctors have available this week?",
      "Would you like to see if your insurance covers {procedure}?"
    ],
    strong: [
      "I can see we have an opening on {day} at {time} - would that work for you?",
      "Should I reserve that consultation spot for you while we're chatting?",
      "What day this week works best for your smile assessment?"
    ]
  }
};

export const contextualResponses = {
  empathy: [
    "I completely understand how frustrating that must be.",
    "You're not alone - many of our patients felt the same way.",
    "That sounds really challenging to deal with daily.",
    "I can hear how much this is affecting you."
  ],
  
  validation: [
    "That's a great question!",
    "You're absolutely right to consider that.",
    "That's exactly the kind of thinking that leads to great results.",
    "Your concerns are completely valid."
  ],
  
  encouragement: [
    "You're taking an important step by exploring your options.",
    "The fact that you're here shows you're ready for positive change.",
    "Many patients wish they had started sooner.",
    "You deserve to live without {issue}."
  ],
  
  localConnection: [
    "As a fellow Staten Islander, I understand...",
    "Right here in {neighborhood}, we see many patients with similar concerns.",
    "Did you know Dr. Pedro has helped over 500 Staten Island families?",
    "Being local means we're always here when you need us."
  ]
};

export function personalizeQuestion(template: string, context: any): string {
  return template.replace(/{(\w+)}/g, (match, key) => context[key] || match);
}
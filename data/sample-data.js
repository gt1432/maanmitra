/**
 * MAANMITRA - Sample Dataset & Reference Data (SIH25092)
 * Reference Datasets:
 * 1. Kaggle Student Mental Health Dataset (shariful07/student-mental-health)
 * 2. Kaggle Mental Health Text Classification Dataset (priyangshumukherjee/mental-health-text-classification-dataset)
 * 
 * Note: Production version can connect this frontend to a Python ML API trained using Kaggle datasets.
 */

// Dataset 1: Representative Kaggle Student Mental Health Survey Samples
const KAGGLE_STUDENT_MENTAL_HEALTH_SAMPLES = [
  { id: 1, gender: 'Female', age: 18, course: 'Engineering', year: 1, cgpa: '3.00 - 3.49', depression: 'No', anxiety: 'Yes', panic: 'No', treatment: 'No', distress: 'MODERATE' },
  { id: 2, gender: 'Male', age: 19, course: 'Islamic Education', year: 2, cgpa: '3.50 - 4.00', depression: 'Yes', anxiety: 'Yes', panic: 'Yes', treatment: 'No', distress: 'HIGH' },
  { id: 3, gender: 'Female', age: 20, course: 'BIT', year: 1, cgpa: '3.00 - 3.49', depression: 'No', anxiety: 'No', panic: 'No', treatment: 'No', distress: 'LOW' },
  { id: 4, gender: 'Female', age: 24, course: 'Laws', year: 3, cgpa: '3.00 - 3.49', depression: 'Yes', anxiety: 'No', panic: 'No', treatment: 'No', distress: 'MODERATE' },
  { id: 5, gender: 'Male', age: 22, course: 'Engineering', year: 4, cgpa: '3.50 - 4.00', depression: 'No', anxiety: 'No', panic: 'No', treatment: 'No', distress: 'LOW' },
  { id: 6, gender: 'Male', age: 23, course: 'Matematik', year: 4, cgpa: '3.50 - 4.00', depression: 'Yes', anxiety: 'No', panic: 'Yes', treatment: 'Yes', distress: 'HIGH' }
];

// Dataset 2: Representative Kaggle Text Classification Sample Statements
const KAGGLE_TEXT_DATASET_SAMPLES = [
  { text: "I am feeling very stressed because of my exams and unable to concentrate.", label: "Anxiety", sentiment: "Negative" },
  { text: "Everything feels so heavy and I do not have energy to get out of bed.", label: "Depression", sentiment: "Negative" },
  { text: "Had a great study session today with friends and feeling relaxed!", label: "Normal", sentiment: "Positive" },
  { text: "I feel lonely in hostel and miss my family so much.", label: "Anxiety", sentiment: "Negative" },
  { text: "I'm scared of failing my final year project defense.", label: "Anxiety", sentiment: "Negative" }
];

// Vanilla JS Keyword Dictionaries for NLP Emotion Engine
const EMOTION_KEYWORDS = {
  stress: [
    "stressed", "stress", "pressure", "exam", "exams", "deadline", "deadlines",
    "assignment", "assignments", "overwhelmed", "workload", "study", "studies", "cramming"
  ],
  anxiety: [
    "anxious", "anxiety", "worried", "worry", "panic", "scared", "fear",
    "nervous", "tense", "uneasy", "restless", "shaky", "terrified"
  ],
  sadness: [
    "sad", "unhappy", "cry", "crying", "hopeless", "depressed", "depression",
    "down", "grief", "heartbroken", "gloomy", "miserable", "hurt"
  ],
  loneliness: [
    "lonely", "alone", "isolated", "isolation", "no friends", "left out",
    "homesick", "miss home", "nobody to talk to"
  ],
  anger: [
    "angry", "mad", "frustrated", "frustration", "furious", "irritated",
    "annoyed", "raging", "hate"
  ],
  low_motivation: [
    "unmotivated", "lazy", "procrastinating", "procrastination", "can't focus",
    "cannot focus", "distracted", "exhausted", "burnout", "give up"
  ],
  happiness: [
    "happy", "good", "great", "excited", "love", "wonderful", "motivated",
    "joy", "joyful", "relaxed", "peaceful", "cheerful", "blessed"
  ]
};

// Sentiment Analysis Keyword Sets
const POSITIVE_KEYWORDS = [
  "happy", "good", "great", "excited", "love", "wonderful", "motivated",
  "awesome", "joy", "calm", "relaxed", "fine", "better", "content", "positive"
];

const NEGATIVE_KEYWORDS = [
  "sad", "bad", "stressed", "angry", "lonely", "worried", "hopeless",
  "tired", "scared", "fear", "anxious", "depressed", "frustrated", "hate",
  "terrible", "miserable", "overwhelmed", "panic"
];

// Safety System High-Risk Crisis Detection Keywords
const CRISIS_KEYWORDS = [
  "suicide", "kill myself", "self harm", "hurt myself", "end my life",
  "want to die", "ending it all", "take my life", "better off dead",
  "don't want to live", "cannot live anymore"
];

// Student Humor Jokes List for MAKE ME LAUGH
const JOKES_LIST = [
  { title: "Exam Prep Logic", text: "Why did the computer take a break? Because it had too many open tabs!" },
  { title: "Physics Student", text: "Why can't you trust atoms? Because they make up everything!" },
  { title: "Math Dilemma", text: "Parallel lines have so much in common. It's a shame they'll never meet." },
  { title: "Late Night Study", text: "My study routine: 5 minutes of studying, 55 minutes of wondering how I got here." },
  { title: "Coding Humor", text: "There are 10 types of people in the world: those who understand binary, and those who don't." }
];

// Modular Service Wrapper Function
// Structured so a real Python ML API fetch("/api/analyze-text") can replace this later seamlessly.
async function analyzeTextService(textInput, moodSelection = "") {
  // Prototype Vanilla JS Engine execution
  return runVanillaNLP(textInput, moodSelection);
}

function runVanillaNLP(text, mood) {
  const textLower = (text || "").toLowerCase();
  
  // 1. Safety Check
  let isCrisis = false;
  for (const kw of CRISIS_KEYWORDS) {
    if (textLower.includes(kw)) {
      isCrisis = true;
      break;
    }
  }

  // 2. Emotion Keyword Match
  let detectedEmotion = "Okay";
  let maxMatches = 0;

  for (const [emotion, keywords] of Object.entries(EMOTION_KEYWORDS)) {
    let count = 0;
    keywords.forEach(kw => {
      if (textLower.includes(kw)) count++;
    });
    if (count > maxMatches) {
      maxMatches = count;
      detectedEmotion = emotion;
    }
  }

  if (maxMatches === 0) {
    if (mood === 'Stressed') detectedEmotion = 'stress';
    else if (mood === 'Sad') detectedEmotion = 'sadness';
    else if (mood === 'Worried') detectedEmotion = 'anxiety';
    else if (mood === 'Angry') detectedEmotion = 'anger';
    else if (mood === 'Lonely') detectedEmotion = 'loneliness';
    else if (mood === 'Tired') detectedEmotion = 'low_motivation';
    else if (mood === 'Happy') detectedEmotion = 'happiness';
  }

  // Format emotion string
  const emotionDisplayNames = {
    stress: "STRESS",
    anxiety: "ANXIETY",
    sadness: "SADNESS",
    loneliness: "LONELINESS",
    anger: "ANGER",
    low_motivation: "LOW MOTIVATION",
    happiness: "HAPPINESS",
    okay: "OKAY"
  };

  // 3. Sentiment Analysis
  let posCount = 0;
  let negCount = 0;

  POSITIVE_KEYWORDS.forEach(kw => { if (textLower.includes(kw)) posCount++; });
  NEGATIVE_KEYWORDS.forEach(kw => { if (textLower.includes(kw)) negCount++; });

  let sentiment = "NEUTRAL";
  if (posCount > negCount) sentiment = "POSITIVE";
  else if (negCount > posCount || ["Sad", "Stressed", "Worried", "Angry", "Lonely", "Tired"].includes(mood)) {
    sentiment = "NEGATIVE";
  }

  // 4. Non-Diagnostic Distress Indicator
  let distressLevel = "LOW";
  if (isCrisis) {
    distressLevel = "HIGH";
  } else if (distressLevel !== "HIGH") {
    if (negCount >= 2 || ["STRESS", "ANXIETY", "SADNESS", "ANGER"].includes(emotionDisplayNames[detectedEmotion])) {
      distressLevel = "MODERATE";
    }
    if (negCount >= 4 || (sentiment === "NEGATIVE" && ["Sad", "Stressed", "Angry"].includes(mood))) {
      distressLevel = "HIGH";
    }
  }

  // 5. Recommendation Engine
  let recommendationCode = "HELP_ME_CALM_DOWN";
  let recommendationLabel = "HELP ME CALM DOWN";

  if (distressLevel === "HIGH" || isCrisis) {
    recommendationCode = "CONNECT_AND_GET_HELP";
    recommendationLabel = "CONNECT & GET HELP";
  } else {
    switch (detectedEmotion) {
      case 'stress':
      case 'anxiety':
      case 'anger':
        recommendationCode = "HELP_ME_CALM_DOWN";
        recommendationLabel = "HELP ME CALM DOWN";
        break;
      case 'sadness':
      case 'loneliness':
        recommendationCode = "I_WANT_TO_TALK";
        recommendationLabel = "I WANT TO TALK";
        break;
      case 'low_motivation':
        recommendationCode = "MOTIVATE_ME";
        recommendationLabel = "MOTIVATE ME";
        break;
      case 'happiness':
        recommendationCode = "MAKE_ME_LAUGH";
        recommendationLabel = "MAKE ME LAUGH";
        break;
      default:
        recommendationCode = "DISTRACT_ME";
        recommendationLabel = "DISTRACT ME";
        break;
    }
  }

  // Explanations
  let distressDesc = "Your responses show relatively low distress indicators.";
  if (distressLevel === "MODERATE") {
    distressDesc = "Some signs of emotional stress were detected. Consider taking a short break or talking to someone you trust.";
  } else if (distressLevel === "HIGH") {
    distressDesc = "Your responses indicate significant distress. Consider connecting with a counsellor or qualified professional.";
  }

  return {
    emotion: emotionDisplayNames[detectedEmotion] || "OKAY",
    sentiment: sentiment,
    distressLevel: distressLevel,
    distressDescription: distressDesc,
    recommendation: recommendationCode,
    recommendationLabel: recommendationLabel,
    isCrisis: isCrisis
  };
}

import { TrainingInput, TrainingPlan, GeneratedKit } from "../types";

const OPENAI_API_KEY = process.env.API_KEY;
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

const fileToBase64 = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = reader.result as string;
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const callOpenAI = async (messages: any[], responseFormat?: any) => {
  const requestBody: any = {
    model: "gpt-4o", // or "gpt-4-turbo" or "gpt-3.5-turbo"
    messages,
    temperature: 0.7,
  };

  if (responseFormat) {
    requestBody.response_format = responseFormat;
  }

  const response = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPENAI_API_KEY}`,
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`OpenAI API Error: ${response.status} - ${JSON.stringify(errorData)}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
};

export const generateTrainingPlan = async (input: TrainingInput): Promise<TrainingPlan> => {
  let userMessage = "";
  const messages: any[] = [
    {
      role: "system",
      content: `You are an expert instructional designer specializing in corporate training. 
      You create comprehensive, engaging training plans tailored to specific industries and topics.
      Always respond with valid JSON matching the requested schema.`
    }
  ];

  if (input.file) {
    const base64Data = await fileToBase64(input.file);
    userMessage = `Analyze this uploaded training document for the ${input.industry} industry on the topic of "${input.topic}". 
    Create a structured training plan based on it. Extract key modules, learning objectives, and suggest enhancements.
    
    Document content is attached as base64 data: ${base64Data.substring(0, 500)}... (truncated)`;
  } else {
    userMessage = `Create a comprehensive training plan for the ${input.industry} industry specifically on the topic of "${input.topic}". 
    The plan should be professional, actionable, and suitable for adult learners. Include 4-6 distinct modules.
    
    Provide varied content based on the specific industry and topic combination. Consider:
    - Industry-specific regulations, standards, and best practices
    - Current trends and challenges in ${input.industry}
    - Practical, hands-on applications relevant to ${input.topic}
    - Real-world scenarios from ${input.industry}`;
  }

  messages.push({
    role: "user",
    content: userMessage
  });

  messages.push({
    role: "user",
    content: `Respond with a JSON object with this exact structure:
    {
      "title": "string (engaging course title)",
      "targetAudience": "string (specific job roles/levels)",
      "learningObjectives": ["array", "of", "3-5", "specific", "measurable", "objectives"],
      "modules": [
        {
          "title": "string (module name)",
          "description": "string (what this module covers)",
          "durationMinutes": number (15-60)
        }
      ],
      "suggestedEnhancements": ["array", "of", "3-4", "interactive", "activities"]
    }`
  });

  const responseText = await callOpenAI(messages, { type: "json_object" });
  return JSON.parse(responseText) as TrainingPlan;
};

export const generateFullKit = async (plan: TrainingPlan): Promise<GeneratedKit> => {
  const messages = [
    {
      role: "system",
      content: `You are a world-class instructional designer and visual content creator. 
      You generate comprehensive training materials with engaging, industry-specific content.
      Always respond with valid JSON matching the requested schema.`
    },
    {
      role: "user",
      content: `Based on the following training plan, generate a complete training kit with diverse, specific content.

Training Plan:
${JSON.stringify(plan, null, 2)}

Important guidelines:
1. Make each slide unique and specific to the module topic
2. Use concrete examples from the industry
3. Provide detailed, actionable speaker notes
4. Create flashcards that test different knowledge levels
5. Write practical, ready-to-use facilitator guides
6. Ensure handouts are comprehensive yet concise

Generate:
1. A slide deck (5-8 slides covering key concepts). For each slide, provide:
   - Unique, specific content (not generic)
   - A 'visualSearchTerm' describing an ideal stock photo (e.g., 'diverse team brainstorming', 'factory worker safety equipment')
2. 5 Study Flashcards with varied difficulty levels
3. A one-page Participant Handout in Markdown (include key concepts, activities, resources)
4. A Facilitator Guide in Markdown (detailed timing, delivery tips, discussion prompts)
5. A general 'backgroundImagePrompt' for the theme

Respond with this JSON structure:
{
  "slides": [
    {
      "title": "string",
      "content": ["array", "of", "3-5", "bullet", "points"],
      "speakerNotes": "string (detailed facilitation guidance)",
      "visualSearchTerm": "string (specific image search keywords)"
    }
  ],
  "flashcards": [
    {
      "front": "string (question or concept)",
      "back": "string (answer or explanation)"
    }
  ],
  "handoutMarkdown": "string (well-formatted markdown document)",
  "facilitatorGuideMarkdown": "string (comprehensive markdown guide)",
  "backgroundImagePrompt": "string (theme keywords)"
}`
    }
  ];

  const responseText = await callOpenAI(messages, { type: "json_object" });
  return JSON.parse(responseText) as GeneratedKit;
};
// services/apiService.ts
import { TrainingInput, TrainingPlan, GeneratedKit } from "../types";

const API_BASE = '/api/generate';

const fileToText = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      resolve(text);
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
};

export const generateTrainingPlan = async (input: TrainingInput): Promise<TrainingPlan> => {
  let fileContent: string | undefined;

  if (input.file) {
    try {
      fileContent = await fileToText(input.file);
    } catch (error) {
      console.error('Error reading file:', error);
    }
  }

  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'plan',
      industry: input.industry,
      topic: input.topic,
      fileContent,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.details || 'Failed to generate training plan');
  }

  return await response.json();
};

export const generateFullKit = async (plan: TrainingPlan): Promise<GeneratedKit> => {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'kit',
      plan,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.details || 'Failed to generate training kit');
  }

  return await response.json();
};
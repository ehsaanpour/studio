'use server';

import { 
  aiAssistedFormCreationQuestionSuggestion,
  type AiAssistedFormCreationQuestionSuggestionInput,
  type AiAssistedFormCreationQuestionSuggestionOutput 
} from '@/ai/flows/ai-assisted-form-creation';
import { 
  generateValidationRules,
  type GenerateValidationRulesInput,
  type GenerateValidationRulesOutput
} from '@/ai/flows/ai-generate-validation-rules';

export async function getAiAssistedQuestionSuggestions(
  input: AiAssistedFormCreationQuestionSuggestionInput
): Promise<AiAssistedFormCreationQuestionSuggestionOutput> {
  try {
    const result = await aiAssistedFormCreationQuestionSuggestion(input);
    return result;
  } catch (error) {
    console.error("Error in getAiAssistedQuestionSuggestions:", error);
    // It's better to throw a custom error or a more specific error
    // For now, re-throwing the original error or a generic one.
    throw new Error("Failed to get AI-assisted question suggestions.");
  }
}

export async function getAiGeneratedValidationRules(
  input: GenerateValidationRulesInput
): Promise<GenerateValidationRulesOutput> {
  try {
    const result = await generateValidationRules(input);
    return result;
  } catch (error) {
    console.error("Error in getAiGeneratedValidationRules:", error);
    throw new Error("Failed to get AI-generated validation rules.");
  }
}

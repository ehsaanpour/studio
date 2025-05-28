export interface FormFieldSuggestion {
  id: string;
  label: string;
  type: 'text' | 'email' | 'number' | 'date' | 'textarea' | 'select' | 'checkbox' | 'radio';
  options?: string[]; // For select, radio
}

export interface FormFieldDefinition extends FormFieldSuggestion {
  placeholder?: string;
  required: boolean;
  validationRules?: string[];
}

export interface AppForm {
  id: string;
  name: string;
  description?: string;
  fields: FormFieldDefinition[];
  createdAt: string;
  updatedAt: string;
}

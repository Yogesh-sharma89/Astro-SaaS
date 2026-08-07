// features/onboarding/ — multi-step onboarding form collecting birth info + preferences.

import { z } from 'zod';

export const step1Schema = z.object({
  name: z.string().min(1, 'Name is required'),
  gender: z.enum(['female', 'male', 'non-binary', 'prefer-not']),
  language: z.string().min(1, 'Select a language'),
});

export const step2Schema = z
  .object({
    birthDate: z.string().min(1, 'Birth date is required'),
    birthTime: z.string().optional(),
    birthTimeUnknown: z.boolean(),
    birthPlace: z.string().min(1, 'Birth place is required'),
    latitude: z.number().nullable().optional(),
    longitude: z.number().nullable().optional(),
  })
  .refine((d) => d.birthTimeUnknown || (d.birthTime && d.birthTime.length > 0), {
    message: 'Enter your birth time or check "I don\'t know"',
    path: ['birthTime'],
  });

export const step3Schema = z.object({
  relationshipStatus: z.enum([
    'single', 'in-relationship', 'married', 'complicated', 'prefer-not',
  ]),
  goals: z.array(z.string()).min(1, 'Select at least one goal'),
  interests: z.array(z.string()).min(1, 'Select at least one interest'),
});

export type Step1Data = z.infer<typeof step1Schema>;
export type Step2Data = z.infer<typeof step2Schema>;
export type Step3Data = z.infer<typeof step3Schema>;

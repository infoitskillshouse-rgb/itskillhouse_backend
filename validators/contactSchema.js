import { z } from 'zod';

export const contactSchema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  companyName: z.string().optional(),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\d{10}$/, 'Phone must be 10 digits'),
  services: z.array(z.string()).min(1, 'At least one service must be selected'),
  requirements: z.string().optional(),
});

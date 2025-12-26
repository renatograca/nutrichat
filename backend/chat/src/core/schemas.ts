import { z } from 'zod';

const ChatCreateSchema = z.object({
  user_id: z.string(),
  title: z.string().optional(),
});

const ChatMessageCreateSchema = z.object({
  message: z.string(),
  user_id: z.string(),
});

const ChatMessageResponseSchema = z.object({
  id: z.string().uuid(),
  role: z.string(),
  content: z.string(),
  created_at: z.date(),
});

const ChatResponseSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string(),
  document_id: z.string().uuid().nullable(),
  title: z.string().nullable(),
  created_at: z.date(),
  updated_at: z.date(),
});

export {
  ChatCreateSchema,
  ChatMessageCreateSchema,
  ChatMessageResponseSchema,
  ChatResponseSchema,
};


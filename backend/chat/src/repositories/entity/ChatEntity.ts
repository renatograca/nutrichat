export interface ChatEntity {
  id: string;
  user_id: number;
  document_id: string;
  title: string;
  created_at: string | Date; // Ajuste para 'Date' caso o banco retorne um objeto Date
  updated_at: string | Date; // Ajuste para 'Date' caso o banco retorne um objeto Date
}
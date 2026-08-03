export interface Message {
  id: string;
  booking_id?: string | null;
  sender_id: string;
  receiver_id: string;
  message: string;
  is_read?: boolean;
  read_at?: string;
  created_at: string;
}

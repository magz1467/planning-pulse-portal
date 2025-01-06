export interface Comment {
  id: number;
  created_at: string;
  comment: string;
  user_id: string;
  application_id: number;
  parent_id?: number;
  upvotes: number;
  downvotes: number;
  user_email: string;
}

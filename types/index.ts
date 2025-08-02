// types/index.ts
export interface User {
    id: number;
    username: string;
    email: string;
    role: 'user' | 'admin';
  }
  
  export interface Post {
    id: number;
    title: string;
    content: string;
    category_id?: number;
    image?: string;
    media: { images: string[]; audio: string[] };
    status: string;
    created_at: string;
    username: string;
    email: string;
  }
  
  export interface Comment {
    id: number;
    content: string;
    username: string;
    created_at: string;
  }
  
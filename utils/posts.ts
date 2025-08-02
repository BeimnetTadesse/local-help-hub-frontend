import api from './api';
import { Post } from '../types';

export async function getPosts(): Promise<Post[]> {
  // No /api prefix here because baseURL includes /api already
  const res = await api.get<Post[]>('/posts');
  return res.data;
}

export async function createPost(data: {
  title: string;
  content: string;
  category_id?: number;
}): Promise<{ post: Post }> {
  const res = await api.post<{ post: Post }>('/posts', data);
  return res.data;
}

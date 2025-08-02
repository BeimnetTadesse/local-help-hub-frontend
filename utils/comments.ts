import api from './api';
import { Comment } from '../types';
import type { AxiosResponse } from 'axios';


export async function getComments(postId: number): Promise<Comment[]> {
  const res: AxiosResponse<Comment[]> = await api.get(`/api/comments/${postId}`);
  return res.data;
}

export async function addComment(postId: number, content: string): Promise<{ comment: Comment }> {
  const res: AxiosResponse<{ comment: Comment }> = await api.post(`/api/comments/${postId}`, { content });
  return res.data;
}

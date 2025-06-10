import type { Link } from '../types/link';
import { client } from './client';

const originalLink = {
  get: async (code: string): Promise<string> => {
    const response = await client<Link>(`link/${code}`);
    return response.link;
  },
};

const shortLink = {
  create: async (data: { link: string; code: string }): Promise<Link> => {
    const response = await client<Link>(`link`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response;
  },

  fetch: async (): Promise<Link[]> => {
    const response = await client<Link[]>(`link`);
    return response;
  },

  delete: async (code: string): Promise<boolean> => {
    const response = await client<boolean>(`link`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code }),
    });
    return response;
  },

  export: async (): Promise<{ url: string }> => {
    const response = await client<{ url: string }>('link/export');
    return response;
  },
};

export const http = { originalLink, shortLink };
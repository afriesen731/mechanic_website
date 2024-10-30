import PocketBase from 'pocketbase';
// PocketBase SDK initialization
export const pb = new PocketBase(import.meta.env.VITE_DATABASE_URL);
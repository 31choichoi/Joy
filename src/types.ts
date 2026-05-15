export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'contract_in_progress';

export interface Booking {
  id?: string;
  clientName: string;
  contact: string;
  address: string;
  size: string;
  budget: string;
  details: string;
  date: string; // ISO string
  time: string; // "10:00", "14:00", etc.
  status: BookingStatus;
  region: string;
  createdAt: string;
}

export type ProjectCategory = 'Residential' | 'Commercial' | 'Remodeling';

export interface Project {
  id: string;
  title: string;
  category: ProjectCategory;
  location: string;
  description: string;
  imageUrl: string;
  isTeumsae?: boolean;
}

export interface Post {
  id?: string;
  title: string;
  content: string;
  excerpt: string;
  thumbnailUrl: string;
  authorId: string;
  published: boolean;
  tags: string[];
  category: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

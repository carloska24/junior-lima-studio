export interface StudioSettings {
  id: string;
  name: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  city: string;
  openingHours: string;
  instagramUrl: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  videoUrl?: string;
  type?: 'IMAGE' | 'VIDEO';
  duration?: number;
  description?: string;
  order?: number;
  active?: boolean;
}

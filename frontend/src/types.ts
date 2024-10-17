export interface Review {
  _id: string;
  reviewer: string;
  reviewee: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Booking {
  _id: string;
  consumer: string;
  serviceProvider: string;
  service: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  notes?: string;
}

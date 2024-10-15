export interface Review {
  _id: string;
  reviewer: {
    _id: string;
    username: string;
  };
  reviewee: string;
  rating: number;
  comment: string;
  service: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewImage {
  id: string;
  url: string;
  alt?: string;
}

export interface Review {
  id: string;
  reviewerName: string;
  rating: 1 | 2 | 3 | 4 | 5;
  comment: string;
  createdAt: string; // ISO Date string
  images: ReviewImage[];
}

export interface NewReviewPayload {
  reviewerName: string;
  rating: 1 | 2 | 3 | 4 | 5;
  comment: string;
  images?: File[];
}

export interface ReviewFilters {
  rating?: number | null;
  withImages?: boolean;
  sort: 'new' | 'old' | 'high' | 'low';
}

export interface ReviewResponse {
  reviews: Review[];
  total: number;
}

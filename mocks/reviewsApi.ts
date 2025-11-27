import { Review, NewReviewPayload, ReviewResponse, ReviewFilters } from '../types/reviews';

const MOCK_REVIEWS: Review[] = [
  {
    id: "rev_001",
    reviewerName: "Sarah Jenkings",
    rating: 5,
    comment: "Absolutely blew my expectations out of the water! The attention to detail on the dashboard UI is phenomenal. The dark mode is exactly what we needed for late-night dev sessions.",
    createdAt: "2023-10-25T14:30:00Z",
    images: []
  },
  {
    id: "rev_002",
    reviewerName: "Mike Ross",
    rating: 4,
    comment: "Great communication throughout the project. The team was responsive to feedback. Just a minor delay on the initial prototype, but caught up quickly.",
    createdAt: "2023-10-20T09:15:00Z",
    images: [
      { id: "img_01", url: "https://picsum.photos/seed/gloov1/800/600", alt: "Dashboard screenshot" }
    ]
  },
  {
    id: "rev_003",
    reviewerName: "Elena Fisher",
    rating: 5,
    comment: "The new features are seamless. I particularly love the real-time chat integration. It works flawlessly on mobile too.",
    createdAt: "2023-10-18T11:00:00Z",
    images: []
  },
  {
    id: "rev_004",
    reviewerName: "David Chen",
    rating: 3,
    comment: "Functional and solid code, but the initial design concepts were a bit too generic. We got there in the end after a few rounds of revision.",
    createdAt: "2023-10-10T16:45:00Z",
    images: []
  },
  {
    id: "rev_005",
    reviewerName: "Jessica Pearson",
    rating: 5,
    comment: "Efficient, professional, and high quality. The automated invoicing system saved us hours of manual work.",
    createdAt: "2023-10-05T08:20:00Z",
    images: [
      { id: "img_02", url: "https://picsum.photos/seed/gloov2/800/600", alt: "Invoice pdf preview" },
      { id: "img_03", url: "https://picsum.photos/seed/gloov3/800/600", alt: "Settings panel" }
    ]
  },
  {
    id: "rev_006",
    reviewerName: "Louis Litt",
    rating: 2,
    comment: "I encountered several bugs in the reporting module. It needs more testing before deployment.",
    createdAt: "2023-09-28T13:10:00Z",
    images: []
  },
  {
    id: "rev_007",
    reviewerName: "Harvey Specter",
    rating: 5,
    comment: "Top tier service. Worth every penny.",
    createdAt: "2023-09-15T10:00:00Z",
    images: []
  }
];

// In-memory store initialized with mock data
let reviewsStore: Review[] = [...MOCK_REVIEWS];

const SIMULATED_DELAY = 800;

export const getReviews = async (params: {
  page?: number;
  pageSize?: number;
  filters?: ReviewFilters;
}): Promise<ReviewResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filtered = [...reviewsStore];

      if (params.filters) {
        if (params.filters.rating) {
          filtered = filtered.filter((r) => r.rating === params.filters!.rating);
        }
        if (params.filters.withImages) {
          filtered = filtered.filter((r) => r.images.length > 0);
        }
        
        filtered.sort((a, b) => {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          
          switch (params.filters!.sort) {
            case 'new': return dateB - dateA;
            case 'old': return dateA - dateB;
            case 'high': return b.rating - a.rating;
            case 'low': return a.rating - b.rating;
            default: return dateB - dateA;
          }
        });
      }

      const page = params.page || 1;
      const pageSize = params.pageSize || 10;
      const start = (page - 1) * pageSize;
      const end = start + pageSize;
      
      resolve({
        reviews: filtered.slice(start, end),
        total: filtered.length
      });
    }, SIMULATED_DELAY + Math.random() * 400);
  });
};

export const createReview = async (payload: NewReviewPayload): Promise<Review> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Simulate file upload by creating object URLs
      const images = payload.images?.map((file, idx) => ({
        id: `new_img_${Date.now()}_${idx}`,
        url: URL.createObjectURL(file),
        alt: file.name
      })) || [];

      const newReview: Review = {
        id: `rev_${Date.now()}`,
        reviewerName: payload.reviewerName,
        rating: payload.rating,
        comment: payload.comment,
        createdAt: new Date().toISOString(),
        images
      };

      // Prepend to store
      reviewsStore = [newReview, ...reviewsStore];
      
      resolve(newReview);
    }, SIMULATED_DELAY);
  });
};
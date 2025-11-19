export interface PublicUser {
  handle: string;
  avatar_url: string;
}

export interface PublicComment {
  id: string;
  user: PublicUser;
  body: string;
}

export type PublicTicketCategory = 'feature_request' | 'complaint';
export type PublicTicketStatus = 'new' | 'triaged' | 'closed' | 'rejected';

export interface PublicTicket {
  id: string;
  user: PublicUser;
  title: string;
  body: string;
  category: PublicTicketCategory;
  status: PublicTicketStatus;
  upvoteCount: number;
  hasVoted: boolean;
  createdAt: string;
  comments: PublicComment[];
  expected: string | null;
  actual: string | null;
  steps: string | null;
  environment: string | null;
}

export interface ProjectContext {
  project: {
    name: string;
    slug: string;
  };
  searchTerm: string;
  baseUrl: string;
}

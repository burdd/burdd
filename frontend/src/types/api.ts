export type RoleType = 'admin' | 'dev';
export type TicketStatus = 'new' | 'triaged' | 'closed';
export type IssueStatus = 'queue' | 'progress' | 'review' | 'done';
export type TicketCategory = 'feature_request' | 'complaint';

export interface ProjectMember {
  id: string;
  name: string;
  role: RoleType;
  avatarUrl?: string;
}

export interface ProjectStats {
  totalIssues: number;
  activeIssues: number;
  openTickets: number;
}

export interface Project {
  id: string;
  name: string;
  key: string;
  description: string;
  activeSprintId: string | null;
  activeSprintName?: string;
  stats: ProjectStats;
  members: ProjectMember[];
}

export interface Sprint {
  id: string;
  projectId: string;
  name: string;
  goal: string;
  startDate: string;
  endDate: string;
}

export interface Issue {
  id: string;
  projectId: string;
  sprintId: string | null;
  title: string;
  status: IssueStatus;
  assigneeId: string | null;
  description: string;
  priority: 'low' | 'medium' | 'high';
}

export interface Ticket {
  id: string;
  projectId: string;
  title: string;
  status: TicketStatus;
  category: TicketCategory;
  reporter: string;
  createdAt: string;
  summary: string;
  relatedIssueId?: string;
}

export interface UserLookup {
  id: string;
  name: string;
  avatarUrl?: string;
}

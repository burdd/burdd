# API Client Migration Guide

## Overview

The frontend now has a proper API client layer in `src/api/` that connects to the backend endpoints. This replaces the previous mock-based `fetcher.ts` approach.

## API Structure

```
src/api/
├── index.ts        # Main export file
├── config.ts       # Base URL and fetch wrapper
├── auth.ts         # Authentication endpoints
├── projects.ts     # Project CRUD
├── sprints.ts      # Sprint CRUD
├── issues.ts       # Issue CRUD
└── tickets.ts      # Ticket CRUD + sub-resources
```

## Environment Setup

Create a `.env` file in the frontend directory:

```bash
VITE_API_BASE=http://localhost:3001
```

## Key Features

### Automatic Session Handling
All requests include `credentials: 'include'` to send the session cookie automatically.

### Data Transformation
Backend responses are transformed to match frontend expectations:
- Snake_case → camelCase
- `user_id` → fetches full `user` object (where needed)
- Nested data population

### Type Safety
All functions are fully typed with TypeScript interfaces from `@/types/api`.

## Migration Examples

### Before (Mock Data)
```typescript
import { getList, getById } from '@lib/fetcher';

// Fetch projects
const projects = await getList<Project>(`${baseUrl}/projects.json`);

// Fetch project by ID
const project = await getById<Project>(`${baseUrl}/projects.json`, projectId);
```

### After (Real API)
```typescript
import { getProjects, getProjectById } from '@/api';

// Fetch projects
const projects = await getProjects();

// Fetch project by ID
const project = await getProjectById(projectId);
```

## Complete API Reference

### Authentication

```typescript
import { getCurrentUser, loginWithGitHub, logout } from '@/api';

// Get current user + memberships
const data = await getCurrentUser();
// Returns: { user: User, memberships: Membership[] } | null

// Redirect to GitHub OAuth
loginWithGitHub();

// Logout
await logout();
```

### Projects

```typescript
import { 
  getProjects, 
  getProjectById, 
  createProject, 
  updateProject, 
  deleteProject 
} from '@/api';

// List all projects for current user
const projects = await getProjects();

// Get project details
const project = await getProjectById('project-id');

// Create project
const { project } = await createProject({
  name: 'My Project',
  key: 'MYPROJ'
});

// Update project
const { project } = await updateProject('project-id', {
  name: 'Updated Name'
});

// Delete project
await deleteProject('project-id');
```

### Sprints

```typescript
import { 
  getSprintsByProject, 
  getSprintById, 
  createSprint, 
  updateSprint, 
  deleteSprint 
} from '@/api';

// List sprints in a project
const sprints = await getSprintsByProject('project-id');

// Get sprint details
const sprint = await getSprintById('sprint-id');

// Create sprint
const { sprint } = await createSprint('project-id', {
  name: 'Sprint 1',
  start: '2024-01-01',
  end: '2024-01-14'
});

// Update sprint
const { sprint } = await updateSprint('sprint-id', {
  name: 'Updated Sprint Name'
});

// Delete sprint
await deleteSprint('sprint-id');
```

### Issues

```typescript
import { 
  getIssuesByProject, 
  getIssuesBySprint, 
  getIssuesByTicket,
  getIssueById, 
  createIssue, 
  updateIssue, 
  deleteIssue,
  linkIssueToTicket
} from '@/api';

// List issues (multiple contexts)
const projectIssues = await getIssuesByProject('project-id');
const sprintIssues = await getIssuesBySprint('sprint-id');
const ticketIssues = await getIssuesByTicket('ticket-id');

// Get issue details
const issue = await getIssueById('issue-id');

// Create issue
const { issue } = await createIssue('project-id', {
  title: 'Fix bug',
  description: 'Bug description',
  sprint_id: 'sprint-id',      // optional
  assignee_id: 'user-id'        // optional
});

// Update issue
const { issue } = await updateIssue('issue-id', {
  status: 'progress',
  assignee_id: 'user-id'
});

// Link issue to ticket
const { link } = await linkIssueToTicket('ticket-id', 'issue-id');

// Delete issue
await deleteIssue('issue-id');
```

### Tickets

```typescript
import { 
  getTicketsByProject, 
  getTicketsByIssue, 
  getTicketById, 
  createTicket, 
  updateTicket,
  addUpvote,
  removeUpvote,
  getTicketComments,
  createTicketComment,
  getTicketAttachments
} from '@/api';

// List tickets
const projectTickets = await getTicketsByProject('project-id');
const issueTickets = await getTicketsByIssue('issue-id');

// Get ticket details
const ticket = await getTicketById('ticket-id');

// Create ticket
const { ticket } = await createTicket('project-id', {
  title: 'Bug report',
  body: 'Description',
  category: 'complaint',
  expected: 'Expected behavior',
  actual: 'Actual behavior',
  steps: '1. Do this\n2. Do that',
  environment: 'Chrome 114'
});

// Update ticket
const { ticket } = await updateTicket('ticket-id', {
  status: 'triaged'
});

// Upvote management
await addUpvote('ticket-id');
await removeUpvote('ticket-id');

// Comments
const comments = await getTicketComments('ticket-id');
const { comment } = await createTicketComment('ticket-id', 'My comment');

// Attachments
const attachments = await getTicketAttachments('ticket-id');
```

## Error Handling

All API functions throw errors on failure. Wrap calls in try/catch:

```typescript
try {
  const projects = await getProjects();
} catch (error) {
  console.error('Failed to fetch projects:', error);
  // Show error message to user
}
```

## Component Update Examples

### ProjectsListPage.tsx

```typescript
// Before
import { getList } from '@lib/fetcher';

const { data: projects } = useQuery({
  queryKey: ['projects'],
  queryFn: () => getList<Project>(`${baseUrl}/projects.json`)
});

// After
import { getProjects } from '@/api';

const { data: projects } = useQuery({
  queryKey: ['projects'],
  queryFn: getProjects
});
```

### ProjectDetailsPage.tsx

```typescript
// Before
const [project, sprints, issues] = await Promise.all([
  getById<Project>(`${baseUrl}/projects.json`, projectId),
  getList<Sprint>(`${baseUrl}/sprints.json`),
  getList<Issue>(`${baseUrl}/issues.json`),
]);

// After
import { getProjectById, getSprintsByProject, getIssuesByProject } from '@/api';

const [project, sprints, issues] = await Promise.all([
  getProjectById(projectId),
  getSprintsByProject(projectId),
  getIssuesByProject(projectId),
]);
```

## Data Transformation Notes

### Projects
- Backend returns flat list with `project_id`, `project_name`, etc.
- Frontend needs nested `Project` type with `stats` and `members`
- API client handles transformation automatically

### Tickets
- Backend returns `user_id`
- Frontend expects full `user` object with `name`, `avatar_url`
- API client fetches user data automatically (currently returns minimal data)

### Timestamps
- Backend: `created_at` (snake_case)
- Frontend: `createdAt` (camelCase)
- API client transforms automatically

## Next Steps

1. Update authentication context to use `getCurrentUser()`
2. Replace all `getList`/`getById` calls with specific API functions
3. Add proper error handling UI
4. Implement loading states
5. Add optimistic updates for mutations

## Testing Checklist

- [ ] Login redirects to GitHub OAuth
- [ ] Session cookie persists across requests
- [ ] All CRUD operations work
- [ ] Error messages display correctly
- [ ] Loading states show during requests
- [ ] Type safety maintained throughout

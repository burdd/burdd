# Issues

## Sprint Board Frontend

#### Tasks

- [ ] Bootstrap client workspace
    - [ ] Scaffold `frontend/` with Vite (React + TS template)
    - [ ] Enable `strict` mode and path aliases in `tsconfig.json`
    - [ ] Configure CSS Modules plus sample usage
    - [ ] Add `src/styles/globals.css` and `variables.css` for shared tokens

- [ ] Layout and navigation shell
    - [ ] Install React Router v6 and register routes for `/login`, `/projects`, `/projects/:id`, `/sprints/:id`, `/issues/:id`, `/tickets/triage`
    - [ ] Build `AppLayout` with header, sidebar navigation, and project switcher
    - [ ] Add responsive grid, active link styling, 404 route, and refresh-safe deep links

- [ ] Mock data and fetch helpers
    - [ ] Create `mock-api/projects.json`, `sprints.json`, `issues.json`, `tickets.json`
    - [ ] Implement `src/lib/fetcher.ts` with `getList<T>` and `getById<T>` helpers
    - [ ] Add `ApiProvider` context to toggle between mocks and future real API
    - [ ] Wire the projects page to fetch from mocks and prove end-to-end typing

- [ ] Projects list and detail views
    - [ ] Build `/projects` table with search filter and empty state component
    - [ ] Create `/projects/:id` summary showing description, members, active sprint, issue stats
    - [ ] Ship reusable `DataTable`, `Tag`, and `EmptyState` components styled via CSS Modules
    - [ ] Ensure navigation from list to detail is instant and preserves scroll position

- [ ] Sprint board
    - [ ] Implement `/sprints/:id` board with In Queue, In Progress, Code Review, Done columns
    - [ ] Group issues by status with column totals and empty messaging
    - [ ] Add drag-and-drop plus keyboard “Move to Column” controls with ARIA labels

- [ ] Issue detail surface
    - [ ] Build `/issues/:id` view showing title, status, assignee, description, linked tickets
    - [ ] Create `FormField` components for inline edits with validation and error states
    - [ ] Support optimistic updates for description/status changes

- [ ] Ticket triage dashboard
    - [ ] Implement `/tickets/triage` list with filters for new / linked / converted tickets
    - [ ] Add “Convert to Issue” flow that creates a mock issue and removes ticket from queue
    - [ ] Add “Link to Issue” modal with search, selection, and toast confirmations
    - [ ] Update mock data after each action to reflect queue changes

- [ ] Auth shell and protected routes
    - [ ] Create `AuthProvider` with `login`, `logout`, and `user` state
    - [ ] Build `/login` form including error handling and redirect logic
    - [ ] Protect developer routes, redirect unauthenticated visitors, and surface user info in header

- [ ] Styling polish and docs
    - [ ] Define typography scale, spacing system, and responsive breakpoints in `variables.css`
    - [ ] Add loading, error, and empty skeletons plus mobile-specific tweaks for tables/boards
    - [ ] Verify tab order, focus states, and Lighthouse contrast goals
    - [ ] Configure `npm run build` with `VITE_API_BASE`, ensure mock data serves from `dist/`, and document setup in `README_frontend.md` with a v1.0 changelog entry

#### Routes

- /login — developer auth shell
- /projects — project list with filters
- /projects/:id — project overview with related sprints/issues
- /sprints/:id — kanban board grouped by status
- /issues/:id — issue details and inline editing
- /tickets/triage — developer triage queue


## Public Feedback Frontend

#### Tasks

- [ ] Implement Feedback Dashboard (Homepage)
    - [ ] Build the main dashboard list/feed view
    - [ ] Create the "Submit New Idea" primary CTA button
    - [ ] Render each submission as a FeedbackCard component
    - [ ] Display title, upvote count, comment count, category, and status on each card
    - [ ] Implement filter controls for Category (Feature, Issue, Suggestion)
    - [ ] Implement filter controls for Status (Under Review, In Progress, Shipped)
    - [ ] Implement sort controls (Hot, Top, Newest)

- [ ] Build Submission Form Page
    - [ ] Create the dedicated /submit route and page
    - [ ] Add "Title" text input
    - [ ] Add "Category" dropdown/radio (Feature, Issue, Suggestion)
    - [ ] Add "Description" textarea (support simple Markdown)
    - [ ] Add (optional) attachment/screenshot upload field
    - [ ] Implement client-side validation for required fields

- [ ] Build Submission Success Page
    - [ ] Create the confirmation screen shown after successful submission
    - [ ] Display the unique "tracking link" for the user
    - [ ] Add a "Copy Link" button

- [ ] Implement Feedback Detail Page
    - [ ] Build the /feedback/:id route and page
    - [ ] Display the full submission details (title, description)
    - [ ] Implement the UpvoteButton (stateful, increments count per session)
    - [ ] Display the read-only StatusBadge (e.g., "In Progress")
    - [ ] Build the CommentThread section
        - [ ] Add a "Post a comment" form
        - [ ] Display a read-only list of all existing comments

- [ ] Create Core Reusable Components
    - [ ] FeedbackCard (for the dashboard list)
    - [ ] UpvoteButton (stateful)
    - [ ] StatusBadge (props for color based on status)
    - [ ] CategoryTag (props for color/text)
    - [ ] CommentThread (container)
    - [ ] Comment (individual comment display)

#### Routes

- / — The main feedback dashboard (list view)
- /feedback/:id — The detail page for a single submission
- /submit — The new feedback submission form page
- /success — The confirmation page shown after submission


## Backend

#### Tasks

- [ ] Set up server
    - [ ] Create server directory and initialize npm project
    - [ ] Install dependencies: `cors`, `express`, `pg`, `nodemon`, `dotenv`
    - [ ] Create `server.js` file and make it the primary entry point to application
    - [ ] In `server.js`, import `express`, and start app to listen and use the necessary middleware functions

- [ ] Connect to database
    - [ ] Set up database on Render
    - [ ] Create `.env` file with the relevant database connection values
    - [ ] Create `config/database.js` and `config/reset.js` files
    - [ ] In `config/database.js`, create and export `pool` with the relevant config values
    - [ ] In `config/reset.js`, import `pool` and create tables

- [ ] Set up controllers
    - [ ] Create a `/controllers` directory
    - [ ] In `/controllers`, create javascript files for each endpoint
    - [ ] In each file, create and export functions to perform the different CRUD operations

- [ ] Define routes
    - [ ] Create a `/routes` directory
    - [ ] In `/routes`, create javascript files for each endpoint
    - [ ] In each file, define routes to use the different controller functions
    - [ ] In `server.js`, specify the api path to use for each router
    - [ ] Test endpoints with postman

- [ ] Connect frontend
    - [ ] In client, create an `/api` directory
    - [ ] In `/api`, create and export functions for all api calls
    - [ ] Configure vite to proxy `/api` requests to server 


#### API endpoints

- /auth
    - GET /auth/github — start GitHub OAuth
    - GET /auth/github/callback — handle callback, create session, redirect
    - POST /auth/logout — destroy session

- /me
    - GET /me — current user + memberships

- /projects
    - GET /projects — list my projects
    - GET /projects/:projectId — get project
    - POST /projects — create project
    - PATCH /projects/:projectId — update project
    - DELETE /projects/:projectId — delete project

- /projects/:projectId/members
    - GET /projects/:projectId/members — list members
    - GET /projects/:projectId/members/:userId — get member
    - POST /projects/:projectId/members — add member { userId, role }
    - PATCH /projects/:projectId/members/:userId — change role
    - DELETE /projects/:projectId/members/:userId — remove member

- /projects/:projectId/sprints
    - GET /projects/:projectId/sprints — list sprints
    - POST /projects/:projectId/sprints — create sprint

- /projects/:projectId/issues
    - GET /projects/:projectId/issues — list issues
    - POST /projects/:projectId/issues — create issue

- /projects/:projectId/tickets
    - GET /projects/:projectId/tickets — list tickets (add fields: upvoteCount, hasVoted)
    - POST /projects/:projectId/tickets - create ticket

- /sprints
    - GET /sprints/:sprintId - get sprint
    - PATCH /sprints/:sprintId — update sprint
    - DELETE /sprints/:sprintId — delete sprint

- /sprints/:sprintId/issues
    - GET /sprints/:sprintId/issues - list issues

- /issues
    - GET /issues/:issueId — get issue
    - PATCH /issues/:issueId — update issue (change status, change sprint)
    - DELETE /issues/:issueId — delete issue

- /tickets
    - GET /tickets/:ticketId — get ticket
    - PATCH /tickets/:ticketId — update ticket (change status)

- /tickets/:ticketId/issues
    - POST /tickets/:ticketId/issues — link issue to ticket { issueId }

- /tickets/:ticketId/comments
    - GET /tickets/:ticketId/comments - get comments
    - POST /tickets/:ticketId/comments - add comment

- /tickets/:ticketId/upvotes
    - POST /tickets/:ticketId/upvotes - add my vote
    - DELETE /tickets/:ticketId/upvotes - remove my vote

- /tickets/:ticketId/attachments
    - GET /tickets/:ticketId/attachments - get attachments
    - POST /tickets/:ticketId/attachments/presign — create upload URL
    - POST /tickets/:ticketId/attachments — record uploaded file metadata
    - DELETE /tickets/:ticketId/attachments/:attachmentId - delete attachment


#### Data Model

Enum role_type {
  admin
  dev
}

Enum ticket_status {
  new
  triaged
  closed
}

Enum issue_status {
  queue
  progress
  review
  done
}

Enum ticket_category {
  feature_request
  complaint
}

Table users {
  id uuid [pk, not null]
  github_id text [not null]
  full_name text
  first_name text 
  last_name text
  email text [not null]
  handle text [not null]
  avatar_url text
  created_at timestamptz
}

Table projects {
  id uuid [pk, not null]
  name text
  key text [unique]
  created_at timestamptz
}

Table project_members {
  project_id uuid [not null, ref: > projects.id]
  user_id uuid [not null, ref: > users.id]
  role role_type [not null]
  joined_at timestamptz

  indexes {
    (project_id, user_id) [pk]
  }
}

Table sprints {
  id uuid [pk, not null]
  project_id uuid [not null, ref: > projects.id]
  name text
  start date
  end date
}

Table issues {
  id uuid [pk, not null]
  project_id uuid [not null, ref: > projects.id]
  sprint_id uuid [ref: > sprints.id] // nullable
  assignee_id uuid [ref: > users.id] // nullable
  title text
  description text
  status issue_status [not null]
  created_at timestamptz
  updated_at timestamptz
}

Table tickets {
  id uuid [pk, not null]
  project_id uuid [not null, ref: > projects.id]
  user_id uuid [not null, ref: > users.id]
  title text
  body text
  category ticket_category
  expected text 
  actual text 
  steps text 
  environment text 
  status ticket_status [not null]
  created_at timestamptz
}

Table ticket_issues {
  ticket_id uuid [not null, ref: > tickets.id]
  issue_id uuid [not null, ref: > issues.id]
  created_at timestamptz

  indexes {
    (ticket_id, issue_id) [pk]
  }
}

Table ticket_comments {
  id uuid [pk, not null]
  ticket_id uuid [not null, ref: > tickets.id]
  user_id uuid [not null, ref: > users.id]
  body text
  created_at timestamptz
}

Table ticket_upvotes {
  ticket_id uuid [not null, ref: > tickets.id]
  user_id uuid [not null, ref: > users.id]
  created_at timestamptz

  indexes {
    (ticket_id, user_id) [pk]
  }
}

Table ticket_attachments {
  id uuid [pk, not null]
  ticket_id uuid [not null, ref: > tickets.id]
  url text [not null]
  object_key text
  filename text [not null]
  mime_type text [not null]
  size_bytes int [not null]
  created_at timestamptz
}

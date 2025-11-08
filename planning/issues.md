# Issues

## Frontend

- []
- []
- []
- []
- []

## Tickets

- []
- []
- []
- []
- []

## Backend

#### Tasks

- [ ] Set up server
    - [ ] Create server directory and initialize npm project
    - [ ] Install dependencies: cors, express, pg, nodemon, dotenv
    - [ ] Create server.js file and make it the primary entry point to application
    - [ ] In server.js, import express, and start app to listen and use the necessary middleware functions

- [ ] Connect to database
    - [ ] Set up database on Render
    - [ ] Create .env file with the relevant database connection values
    - [ ] Create config/database.js and config/reset.js files
    - [ ] In config/database.js, create and export pool with the relevant config values
    - [ ] In config/reset.js, import pool and create tables

- [ ] Set up controllers
    - [ ] Create a /controllers directory
    - [ ] In /controllers, create javascript files for each endpoint
    - [ ] In each file, create and export functions to perform the different CRUD operations

- [ ] Define routes
    - [ ] Create a /routes directory
    - [ ] In /routes, create javascript files for each endpoint
    - [ ] In each file, define routes to use the different controller functions
    - [ ] In server.js, specify the api path to use for each router
    - [ ] Test endpoints with postman

- [ ] Connect frontend
    - [ ] In client, create an /api directory
    - [ ] In /api, create and export functions for all api calls
    - [ ] Configure vite to proxy /api requests to server 


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
import './dotenv.js'
import { pool } from "./database.js"

const dropTables = async () => {
    const query = `
        DROP TABLE IF EXISTS ticket_attachments CASCADE;
        DROP TABLE IF EXISTS ticket_upvotes CASCADE;
        DROP TABLE IF EXISTS ticket_comments CASCADE;
        DROP TABLE IF EXISTS ticket_issues CASCADE;
        DROP TABLE IF EXISTS tickets CASCADE;
        DROP TABLE IF EXISTS issues CASCADE;
        DROP TABLE IF EXISTS sprints CASCADE;
        DROP TABLE IF EXISTS project_members CASCADE;
        DROP TABLE IF EXISTS projects CASCADE;
        DROP TABLE IF EXISTS users CASCADE;

        DROP TYPE IF EXISTS role_type CASCADE;
        DROP TYPE IF EXISTS ticket_status CASCADE;
        DROP TYPE IF EXISTS issue_status CASCADE;
        DROP TYPE IF EXISTS ticket_category CASCADE;
    `

    try {
        await pool.query(query)
        console.log('Dropped all tables and types')
    } catch (error) {
        console.error('Error dropping tables:', error)
        throw error
    }
}

const createExtensions = async () => {
    const query = `
        CREATE EXTENSION IF NOT EXISTS "pgcrypto";
    `

    try {
        await pool.query(query)
        console.log('Extensions enabled')
    } catch (error) {
        console.error('Error creating extensions:', error)
        throw error
    }
}

const createEnums = async () => {
    const query = `
        CREATE TYPE "role_type" AS ENUM (
            'admin',
            'dev'
        );

        CREATE TYPE "ticket_status" AS ENUM (
            'new',
            'triaged',
            'closed',
            'rejected'
        );

        CREATE TYPE "issue_status" AS ENUM (
            'queue',
            'progress',
            'review',
            'done'
        );

        CREATE TYPE "ticket_category" AS ENUM (
            'feature_request',
            'complaint'
        );
    `

    try {
        await pool.query(query)
        console.log('Custom types created')
    } catch (error) {
        console.error('Error creating custom types:', error)
        throw error
    }
}

const createUsersTable = async () => {
    const query = `
        CREATE TABLE "users" (
            "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            "github_id" text NOT NULL UNIQUE,
            "full_name" text,
            "first_name" text,
            "last_name" text,
            "email" text,
            "handle" text NOT NULL,
            "avatar_url" text,
            "created_at" timestamptz DEFAULT NOW()
        );
    `

    try {
        await pool.query(query)
        console.log('users table created')
    } catch (error) {
        console.error('Error creating users table:', error)
        throw error
    }
}

const createProjectsTable = async () => {
    const query = `
        CREATE TABLE "projects" (
            "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            "name" text,
            "key" text,
            "created_at" timestamptz DEFAULT NOW()
        );
    `

    try {
        await pool.query(query)
        console.log('projects table created')
    } catch (error) {
        console.error('Error creating projects table:', error)
        throw error
    }
}

const createProjectMembersTable = async () => {
    const query = `
        CREATE TABLE "project_members" (
            "project_id" uuid NOT NULL,
            "user_id" uuid NOT NULL,
            "role" role_type NOT NULL,
            "joined_at" timestamptz DEFAULT NOW(),
            PRIMARY KEY ("project_id", "user_id"),
            FOREIGN KEY ("project_id") REFERENCES "projects" ("id") ON DELETE CASCADE,
            FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE
        );
    `

    try {
        await pool.query(query)
        console.log('project_members table created')
    } catch (error) {
        console.error('Error creating project_members table:', error)
        throw error
    }
}

const createSprintsTable = async () => {
    const query = `
        CREATE TABLE "sprints" (
            "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            "project_id" uuid NOT NULL,
            "name" text,
            "start" date,
            "end" date,
            FOREIGN KEY ("project_id") REFERENCES "projects" ("id") ON DELETE CASCADE
        );
    `

    try {
        await pool.query(query)
        console.log('sprints table created')
    } catch (error) {
        console.error('Error creating sprints table:', error)
        throw error
    }
}

const createIssuesTable = async () => {
    const query = `
        CREATE TABLE "issues" (
            "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            "project_id" uuid NOT NULL,
            "sprint_id" uuid,
            "assignee_id" uuid,
            "title" text,
            "description" text,
            "status" issue_status NOT NULL DEFAULT 'queue',
            "created_at" timestamptz DEFAULT NOW(),
            "updated_at" timestamptz DEFAULT NOW(),
            FOREIGN KEY ("project_id") REFERENCES "projects" ("id") ON DELETE CASCADE,
            FOREIGN KEY ("sprint_id") REFERENCES "sprints" ("id") ON DELETE SET NULL,
            FOREIGN KEY ("assignee_id") REFERENCES "users" ("id") ON DELETE SET NULL
        );
    `

    try {
        await pool.query(query)
        console.log('issues table created')
    } catch (error) {
        console.error('Error creating issues table:', error)
        throw error
    }
}

const createTicketsTable = async () => {
    const query = `
        CREATE TABLE "tickets" (
            "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            "project_id" uuid NOT NULL,
            "user_id" uuid NOT NULL,
            "title" text,
            "body" text,
            "category" ticket_category,
            "expected" text,
            "actual" text,
            "steps" text,
            "environment" text,
            "status" ticket_status NOT NULL DEFAULT 'new',
            "created_at" timestamptz DEFAULT NOW(),
            FOREIGN KEY ("project_id") REFERENCES "projects" ("id") ON DELETE CASCADE,
            FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE
        );
    `

    try {
        await pool.query(query)
        console.log('tickets table created')
    } catch (error) {
        console.error('Error creating tickets table:', error)
        throw error
    }
}

const createTicketIssuesTable = async () => {
    const query = `
        CREATE TABLE "ticket_issues" (
            "ticket_id" uuid NOT NULL,
            "issue_id" uuid NOT NULL,
            "created_at" timestamptz DEFAULT NOW(),
            PRIMARY KEY ("ticket_id", "issue_id"),
            FOREIGN KEY ("ticket_id") REFERENCES "tickets" ("id") ON DELETE CASCADE,
            FOREIGN KEY ("issue_id") REFERENCES "issues" ("id") ON DELETE CASCADE
        );
    `

    try {
        await pool.query(query)
        console.log('ticket_issues table created')
    } catch (error) {
        console.error('Error creating ticket_issues table:', error)
        throw error
    }
}

const createTicketCommentsTable = async () => {
    const query = `
        CREATE TABLE "ticket_comments" (
            "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            "ticket_id" uuid NOT NULL,
            "user_id" uuid NOT NULL,
            "body" text,
            "created_at" timestamptz DEFAULT NOW(),
            FOREIGN KEY ("ticket_id") REFERENCES "tickets" ("id") ON DELETE CASCADE,
            FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE
        );
    `

    try {
        await pool.query(query)
        console.log('ticket_comments table created')
    } catch (error) {
        console.error('Error creating ticket_comments table:', error)
        throw error
    }
}

const createTicketUpvotesTable = async () => {
    const query = `
        CREATE TABLE "ticket_upvotes" (
            "ticket_id" uuid NOT NULL,
            "user_id" uuid NOT NULL,
            "created_at" timestamptz DEFAULT NOW(),
            PRIMARY KEY ("ticket_id", "user_id"),
            FOREIGN KEY ("ticket_id") REFERENCES "tickets" ("id") ON DELETE CASCADE,
            FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE
        );
    `

    try {
        await pool.query(query)
        console.log('ticket_upvotes table created')
    } catch (error) {
        console.error('Error creating ticket_upvotes table:', error)
        throw error
    }
}

const createTicketAttachmentsTable = async () => {
    const query = `
        CREATE TABLE "ticket_attachments" (
            "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
            "ticket_id" uuid NOT NULL,
            "url" text NOT NULL,
            "object_key" text,
            "filename" text NOT NULL,
            "mime_type" text NOT NULL,
            "size_bytes" int NOT NULL,
            "created_at" timestamptz DEFAULT NOW(),
            FOREIGN KEY ("ticket_id") REFERENCES "tickets" ("id") ON DELETE CASCADE
        );
    `

    try {
        await pool.query(query)
        console.log('ticket_attachments table created')
    } catch (error) {
        console.error('Error creating ticket_attachments table:', error)
        throw error
    }
}

const main = async () => {
    try {
        await dropTables()
        await createExtensions()
        await createEnums()
        await createUsersTable()
        await createProjectsTable()
        await createProjectMembersTable()
        await createSprintsTable()
        await createIssuesTable()
        await createTicketsTable()
        await createTicketIssuesTable()
        await createTicketCommentsTable()
        await createTicketUpvotesTable()
        await createTicketAttachmentsTable()
        
        console.log('Database reset complete')
    } catch (error) {
        console.error('Database reset failed:', error)
        process.exit(1)
    }
}

main()
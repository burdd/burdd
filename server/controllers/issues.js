import { pool } from '../config/database.js'
import { asyncHandler } from '../middleware/asyncHandler.js'

export const getIssuesInProject = asyncHandler(async (req, res) => {
    const projectId = req.project.id

    const query = `
        SELECT 
            id, 
            project_id, 
            sprint_id, 
            assignee_id, 
            title, 
            description, 
            status, 
            created_at, 
            updated_at
        FROM issues
        WHERE project_id = $1
        ORDER BY created_at DESC
    `
    const { rows } = await pool.query(query, [projectId])
    return res.status(200).json({ issues: rows })
})

export const createIssueInProject = asyncHandler(async (req, res) => {
    const projectId = req.project.id
    const { title, description, sprint_id, assignee_id } = req.body

    if (!title) {
        const err = new Error('title is required')
        err.status = 400
        throw err
    }

    const query = `
        INSERT INTO issues (project_id, title, description, sprint_id, assignee_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, project_id, sprint_id, assignee_id, title, description, status, created_at, updated_at
    `
    const { rows } = await pool.query(query, [
        projectId, 
        title, 
        description || null, 
        sprint_id || null, 
        assignee_id || null
    ])
    const issue = rows[0]

    return res.status(201).json({ issue })
})

export const getIssuesInSprint = asyncHandler(async (req, res) => {
    const sprintId = req.sprint.id

    const query = `
        SELECT 
            id, 
            project_id, 
            sprint_id, 
            assignee_id, 
            title, 
            description, 
            status, 
            created_at, 
            updated_at
        FROM issues
        WHERE sprint_id = $1
        ORDER BY status, created_at DESC
    `
    const { rows } = await pool.query(query, [sprintId])
    return res.status(200).json({ issues: rows })
})

export const getIssueById = asyncHandler(async (req, res) => {
    const issue = req.issue
    return res.status(200).json({ issue })
})

export const updateIssueById = asyncHandler(async (req, res) => {
    const issue = req.issue
    const { title, description, status, sprint_id, assignee_id } = req.body

    const query = `
        UPDATE issues
        SET title = COALESCE($1, title),
            description = COALESCE($2, description),
            status = COALESCE($3, status),
            sprint_id = COALESCE($4, sprint_id),
            assignee_id = COALESCE($5, assignee_id),
            updated_at = NOW()
        WHERE id = $6
        RETURNING id, project_id, sprint_id, assignee_id, title, description, status, created_at, updated_at
    `
    const { rows } = await pool.query(query, [
        title || null,
        description || null,
        status || null,
        sprint_id || null,
        assignee_id || null,
        issue.id
    ])
    const updatedIssue = rows[0]

    return res.status(200).json({ issue: updatedIssue })
})

export const deleteIssueById = asyncHandler(async (req, res) => {
    const issue = req.issue

    const query = `
        DELETE FROM issues
        WHERE id = $1
    `
    await pool.query(query, [issue.id])

    return res.status(204).end()
})

export const getIssuesForTicket = asyncHandler(async (req, res) => {
    const ticketId = req.ticket.id

    const query = `
        SELECT 
            i.id,
            i.project_id,
            i.sprint_id,
            i.assignee_id,
            i.title,
            i.description,
            i.status,
            i.created_at,
            i.updated_at,
            ti.created_at AS linked_at
        FROM issues AS i
        INNER JOIN ticket_issues AS ti 
            ON ti.issue_id = i.id
        WHERE ti.ticket_id = $1
        ORDER BY ti.created_at DESC
    `
    const { rows } = await pool.query(query, [ticketId])
    return res.status(200).json({ issues: rows })
})

export const linkIssueToTicket = asyncHandler(async (req, res) => {
    const ticketId = req.ticket.id
    const { issueId } = req.body

    if (!issueId) {
        const err = new Error('issueId is required')
        err.status = 400
        throw err
    }

    const issueQuery = `
        SELECT id FROM issues 
        WHERE id = $1 AND project_id = $2
    `
    const { rows: issueRows } = await pool.query(issueQuery, [issueId, req.project.id])
    
    if (issueRows.length === 0) {
        const err = new Error('Issue not found or does not belong to this project')
        err.status = 404
        throw err
    }

    const linkQuery = `
        INSERT INTO ticket_issues (ticket_id, issue_id)
        VALUES ($1, $2)
        ON CONFLICT (ticket_id, issue_id) DO NOTHING
        RETURNING ticket_id, issue_id, created_at
    `
    const { rows } = await pool.query(linkQuery, [ticketId, issueId])
    
    if (rows.length === 0) {
        return res.status(200).json({ message: 'Issue already linked to ticket' })
    }

    return res.status(201).json({ link: rows[0] })
})

export const getTicketsForIssue = asyncHandler(async (req, res) => {
    const issueId = req.issue.id

    const query = `
        SELECT 
            t.id,
            t.project_id,
            t.user_id,
            t.title,
            t.body,
            t.category,
            t.expected,
            t.actual,
            t.steps,
            t.environment,
            t.status,
            t.created_at
        FROM tickets AS t
        INNER JOIN ticket_issues AS ti 
            ON t.id = ti.ticket_id
        WHERE ti.issue_id = $1
        ORDER BY t.created_at DESC
    `
    const { rows } = await pool.query(query, [issueId])
    return res.status(200).json({ tickets: rows })
})

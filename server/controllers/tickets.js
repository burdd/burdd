import { pool } from '../config/database.js'
import { asyncHandler } from '../middleware/asyncHandler.js'

export const getAllTicketsInProject = asyncHandler(async (req, res) => {
    const projectId = req.project.id
    const userId = req.user.id

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
            t.created_at,
            COUNT(DISTINCT tu.user_id) AS upvote_count,
            EXISTS(
                SELECT 1 FROM ticket_upvotes 
                WHERE ticket_id = t.id AND user_id = $2
            ) AS has_voted
        FROM tickets AS t
        LEFT JOIN ticket_upvotes AS tu 
            ON tu.ticket_id = t.id
        WHERE t.project_id = $1
        GROUP BY t.id
        ORDER BY t.created_at DESC
    `
    const { rows } = await pool.query(query, [projectId, userId])
    return res.status(200).json({ tickets: rows })
})

export const createTicketInProject = asyncHandler(async (req, res) => {
    const projectId = req.project.id
    const userId = req.user.id
    const { title, body, category, expected, actual, steps, environment } = req.body

    if (!title) {
        const err = new Error('title is required')
        err.status = 400
        throw err
    }

    const query = `
        INSERT INTO tickets (
            project_id, 
            user_id, 
            title, 
            body, 
            category, 
            expected, 
            actual, 
            steps, 
            environment
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING id, project_id, user_id, title, body, category, expected, actual, steps, environment, status, created_at
    `
    const { rows } = await pool.query(query, [
        projectId,
        userId,
        title,
        body || null,
        category || null,
        expected || null,
        actual || null,
        steps || null,
        environment || null
    ])
    const ticket = rows[0]

    return res.status(201).json({ ticket })
})

export const getAllTicketsForIssue = asyncHandler(async (req, res) => {
    const issueId = req.issue.id

    const query = `
        SELECT 
            t.id,
            t.project_id,
            t.user_id,
            t.title,
            t.body,
            t.category,
            t.status,
            t.created_at,
            ti.created_at AS linked_at
        FROM tickets AS t
        INNER JOIN ticket_issues AS ti 
            ON ti.ticket_id = t.id
        WHERE ti.issue_id = $1
        ORDER BY ti.created_at DESC
    `
    const { rows } = await pool.query(query, [issueId])
    return res.status(200).json({ tickets: rows })
})

export const getTicketById = asyncHandler(async (req, res) => {
    const ticket = req.ticket
    return res.status(200).json({ ticket })
})

export const updateTicket = asyncHandler(async (req, res) => {
    const ticket = req.ticket
    const { title, body, category, expected, actual, steps, environment, status } = req.body

    const query = `
        UPDATE tickets
        SET title = COALESCE($1, title),
            body = COALESCE($2, body),
            category = COALESCE($3, category),
            expected = COALESCE($4, expected),
            actual = COALESCE($5, actual),
            steps = COALESCE($6, steps),
            environment = COALESCE($7, environment),
            status = COALESCE($8, status)
        WHERE id = $9
        RETURNING id, project_id, user_id, title, body, category, expected, actual, steps, environment, status, created_at
    `
    const { rows } = await pool.query(query, [
        title || null,
        body || null,
        category || null,
        expected || null,
        actual || null,
        steps || null,
        environment || null,
        status || null,
        ticket.id
    ])
    const updatedTicket = rows[0]

    return res.status(200).json({ ticket: updatedTicket })
})

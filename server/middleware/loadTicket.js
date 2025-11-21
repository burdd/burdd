import { pool } from "../config/database.js"
import { asyncHandler } from "./asyncHandler.js"

export const loadTicket = asyncHandler(async (req, res, next) => {
    const id = req.params.ticketId
    
    if (!id) {
        const err = new Error('Invalid ticket Id')
        err.status = 400
        throw err
    }

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
            p.id AS project_id,
            p.name AS project_name,
            p.key AS project_key,
            p.created_at AS project_created_at
        FROM tickets AS t
        INNER JOIN projects AS p
            ON p.id = t.project_id
        WHERE t.id = $1
    `

    const { rows } = await pool.query(query, [id])
    const ticket = rows[0]

    if (!ticket) {
        const err = new Error('Ticket not found')
        err.status = 404
        throw err
    }

    req.ticket = {
        id: ticket.id,
        project_id: ticket.project_id,
        user_id: ticket.user_id,
        title: ticket.title,
        body: ticket.body,
        category: ticket.category,
        expected: ticket.expected,
        actual: ticket.actual,
        steps: ticket.steps,
        environment: ticket.environment,
        status: ticket.status,
        created_at: ticket.created_at
    }
    req.project = {
        id: ticket.project_id,
        name: ticket.project_name,
        key: ticket.project_key,
        created_at: ticket.project_created_at
    }

    return next()
})
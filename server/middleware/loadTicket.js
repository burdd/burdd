import { pool } from "../config/database.js"
import { asyncHandler } from "./asyncHandler.js"

export const loadTicket = asyncHandler(async (req, res, next) => {
    const id = parseInt(req.params.ticketId)
    if (Number.isNaN(id)) {
        const err = new Error('Invalid ticket Id')
        err.status = 400
        throw err
    }

    const query = `
        SELECT id, project_id, user_id, title, body, category, expected, actual, steps, environment, status, created_at
        FROM tickets
        WHERE id = $1
    `

    const { rows } = await pool.query(query, [id])
    const ticket = rows[0]

    if (!ticket) {
        const err = new Error('Ticket not found')
        err.status = 404
        throw err
    }

    req.ticket = ticket

    return next()
})
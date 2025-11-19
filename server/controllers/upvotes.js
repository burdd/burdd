import { pool } from '../config/database.js'
import { asyncHandler } from '../middleware/asyncHandler.js'

export const addUpvote = asyncHandler(async (req, res) => {
    const ticketId = req.ticket.id
    const userId = req.user.id

    const query = `
        INSERT INTO ticket_upvotes (ticket_id, user_id)
        VALUES ($1, $2)
        ON CONFLICT (ticket_id, user_id) DO NOTHING
        RETURNING ticket_id, user_id, created_at
    `
    const { rows } = await pool.query(query, [ticketId, userId])

    if (rows.length === 0) {
        return res.status(200).json({ message: 'Already upvoted' })
    }

    return res.status(201).json({ upvote: rows[0] })
})

export const removeUpvote = asyncHandler(async (req, res) => {
    const ticketId = req.ticket.id
    const userId = req.user.id

    const query = `
        DELETE FROM ticket_upvotes
        WHERE ticket_id = $1 AND user_id = $2
        RETURNING ticket_id, user_id
    `
    const { rows } = await pool.query(query, [ticketId, userId])

    if (rows.length === 0) {
        const err = new Error('Upvote not found')
        err.status = 404
        throw err
    }

    return res.status(204).end()
})

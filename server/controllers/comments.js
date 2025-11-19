import { pool } from '../config/database.js'
import { asyncHandler } from '../middleware/asyncHandler.js'

export const getTicketComments = asyncHandler(async (req, res) => {
    const ticketId = req.ticket.id

    const query = `
        SELECT 
            tc.id,
            tc.ticket_id,
            tc.user_id,
            tc.body,
            tc.created_at,
            u.full_name     AS user_name,
            u.handle        AS user_handle,
            u.avatar_url    AS user_avatar_url
        FROM ticket_comments AS tc
        INNER JOIN users AS u 
            ON u.id = tc.user_id
        WHERE tc.ticket_id = $1
        ORDER BY tc.created_at ASC
    `
    const { rows } = await pool.query(query, [ticketId])
    return res.status(200).json({ comments: rows })
})

export const createTicketComment = asyncHandler(async (req, res) => {
    const ticketId = req.ticket.id
    const userId = req.user.id
    const { body } = req.body

    if (!body || body.trim().length === 0) {
        const err = new Error('Comment body is required')
        err.status = 400
        throw err
    }

    const query = `
        INSERT INTO ticket_comments (ticket_id, user_id, body)
        VALUES ($1, $2, $3)
        RETURNING id, ticket_id, user_id, body, created_at
    `
    const { rows } = await pool.query(query, [ticketId, userId, body])
    const comment = rows[0]

    const userQuery = `
        SELECT 
            full_name   AS user_name, 
            handle      AS user_handle, 
            avatar_url  AS user_avatar_url 
        FROM users 
        WHERE id = $1
    `
    const { rows: userRows } = await pool.query(userQuery, [userId])
    
    return res.status(201).json({ 
        comment: {
            ...comment,
            ...userRows[0]
        }
    })
})

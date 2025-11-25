import { pool } from '../config/database.js'
import { asyncHandler } from '../middleware/asyncHandler.js'

export const searchUsers = asyncHandler(async (req, res) => {
    const { q, limit = 10 } = req.query

    if (!q || q.trim().length < 2) {
        const err = new Error('Search query must be at least 2 characters')
        err.status = 400
        throw err
    }

    const searchTerm = `%${q.trim()}%`
    const query = `
        SELECT 
            id,
            github_id,
            handle,
            full_name,
            avatar_url,
            created_at
        FROM users
        WHERE full_name ILIKE $1 OR handle ILIKE $1
        ORDER BY full_name
        LIMIT $2
    `
    const { rows } = await pool.query(query, [searchTerm, limit])

    return res.status(200).json({ users: rows })
})

export const getUser = asyncHandler(async (req, res) => {
    const userId = req.params.userId

    const query = `
        SELECT 
            id,
            github_id,
            handle,
            full_name,
            avatar_url,
            created_at
        FROM users
        WHERE id = $1
    `
    const { rows } = await pool.query(query, [userId])
    const user = rows[0]

    if (!user) {
        const err = new Error('User not found')
        err.status = 404
        throw err
    }

    return res.status(200).json({ user })
})

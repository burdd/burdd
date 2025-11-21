import { pool } from '../config/database.js'
import { asyncHandler } from '../middleware/asyncHandler.js'

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

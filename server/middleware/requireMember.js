import { pool } from '../config/database.js'
import { asyncHandler } from './asyncHandler.js'

export const requireMember = asyncHandler(async (req, res, next) => {
    const userId = req.user.id
    const projectId = req.project.id

    const query = `
        SELECT role
        FROM project_members
        WHERE project_id = $1 AND user_id = $2
    `
    const { rows } = await pool.query(query, [projectId, userId])
    const member = rows[0]

    if (!member) {
        const err = new Error('Must be a project member')
        err.status = 403
        throw err
    }

    return next()
})

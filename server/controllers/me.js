import { pool } from '../config/database.js'
import { asyncHandler } from '../middleware/asyncHandler.js'

export const getUser = asyncHandler(async (req, res) => {
    const user = req.user
    
    const query = `
        SELECT 
            pm.project_id,
            pm.role,
            pm.joined_at,
            p.name AS project_name,
            p.key AS project_key
        FROM project_members AS pm
        INNER JOIN projects AS p 
            ON p.id = pm.project_id
        WHERE pm.user_id = $1
        ORDER BY pm.joined_at DESC
    `
    const { rows } = await pool.query(query, [user.id])
    
    return res.status(200).json({ 
        user,
        memberships: rows
    })
})
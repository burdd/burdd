import { pool } from "../config/database.js"
import { asyncHandler } from "./asyncHandler.js"

export const loadProject = asyncHandler(async (req, res, next) => {
    const id = parseInt(req.params.projectId)
    if (Number.isNaN(id)) {
        const err = new Error('Invalid project Id')
        err.status = 400
        throw err
    }

    const query = `
        SELECT id, name, key, created_at 
        FROM projects
        WHERE id = $1
    `

    const { rows } = await pool.query(query, [id])
    const project = rows[0]

    if (!project) {
        const err = new Error('Project not found')
        err.status = 404
        throw err
    }

    req.project = project

    return next()
})
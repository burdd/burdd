import { pool } from "../config/database.js"
import { asyncHandler } from "./asyncHandler.js"

export const loadSprint = asyncHandler(async (req, res, next) => {
    const id = parseInt(req.params.sprintId)
    if (Number.isNaN(id)) {
        const err = new Error('Invalid sprint Id')
        err.status = 400
        throw err
    }

    const query = `
        SELECT id, project_id, name, start, end
        FROM sprints
        WHERE id = $1
    `

    const { rows } = await pool.query(query, [id])
    const sprint = rows[0]

    if (!sprint) {
        const err = new Error('Sprint not found')
        err.status = 404
        throw err
    }

    req.sprint = sprint

    return next()
})
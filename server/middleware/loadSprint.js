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
        SELECT 
            s.id, 
            s.project_id, 
            s.name, 
            s.start, 
            s.end,
            p.id AS project_id,
            p.name AS project_name,
            p.key AS project_key,
            p.created_at AS project_created_at
        FROM sprints AS s
        INNER JOIN projects AS p 
            ON p.id = s.project_id
        WHERE s.id = $1
    `

    const { rows } = await pool.query(query, [id])
    const sprint = rows[0]

    if (!sprint) {
        const err = new Error('Sprint not found')
        err.status = 404
        throw err
    }

    req.sprint = {
        id: sprint.id,
        project_id: sprint.project_id,
        name: sprint.name,
        start: sprint.start,
        end: sprint.end
    }
    req.project = {
        id: sprint.project_id,
        name: sprint.project_name,
        key: sprint.project_key,
        created_at: sprint.project_created_at
    }

    return next()
})
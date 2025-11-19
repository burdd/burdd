import { pool } from '../config/database.js'
import { asyncHandler } from '../middleware/asyncHandler.js'

export const getAllSprintsInProject = asyncHandler(async (req, res) => {
    const projectId = req.project.id

    const query = `
        SELECT id, project_id, name, start, "end"
        FROM sprints
        WHERE project_id = $1
        ORDER BY start DESC
    `
    const { rows } = await pool.query(query, [projectId])
    return res.status(200).json({ sprints: rows })
})

export const createSprintInProject = asyncHandler(async (req, res) => {
    const projectId = req.project.id
    const { name, start, end } = req.body

    if (!name || !start || !end) {
        const err = new Error('name, start, and end are required')
        err.status = 400
        throw err
    }

    const query = `
        INSERT INTO sprints (project_id, name, start, "end")
        VALUES ($1, $2, $3, $4)
        RETURNING id, project_id, name, start, "end"
    `
    const { rows } = await pool.query(query, [projectId, name, start, end])
    const sprint = rows[0]

    return res.status(201).json({ sprint })
})

export const getSprintById = asyncHandler(async (req, res) => {
    const sprint = req.sprint
    return res.status(200).json({ sprint })
})

export const updateSprintById = asyncHandler(async (req, res) => {
    const sprint = req.sprint
    const { name, start, end } = req.body

    const query = `
        UPDATE sprints
        SET name = COALESCE($1, name),
            start = COALESCE($2, start),
            "end" = COALESCE($3, "end")
        WHERE id = $4
        RETURNING id, project_id, name, start, "end"
    `
    const { rows } = await pool.query(query, [name || null, start || null, end || null, sprint.id])
    const updatedSprint = rows[0]

    return res.status(200).json({ sprint: updatedSprint })
})

export const deleteSprintById = asyncHandler(async (req, res) => {
    const sprint = req.sprint

    const query = `
        DELETE FROM sprints
        WHERE id = $1
    `
    await pool.query(query, [sprint.id])

    return res.status(204).end()
})
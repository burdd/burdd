import { pool } from '../config/database.js'
import { asyncHandler } from '../middleware/asyncHandler.js'

export const getAllProjectsForUser = asyncHandler(async (req, res) => {
    const userId = req.user.id

    const query = `
        SELECT
            p.id            AS project_id,
            p.name          AS project_name,
            p.key           AS project_key,
            p.created_at    AS project_created_at,
            pm.role         AS member_role,
            pm.joined_at    AS member_joined_at
        FROM projects AS p
        INNER JOIN project_members AS pm
            ON p.id = pm.project_id
        WHERE pm.user_id = $1
        ORDER BY p.name
    `
    const { rows } = await pool.query(query, [userId])
    return res.status(200).json({ projects: rows })
})

export const createProject = asyncHandler(async (req, res) => {
    const { name, key } = req.body
    if (!name || !key) {
        const err = new Error('Name and key are required')
        err.status = 400
        throw err
    }
    const userId = req.user.id

    const client = await pool.connect()
    try {
        await client.query('BEGIN')

        const projectQuery = `
            INSERT INTO projects (name, key)
            VALUES ($1, $2)
            RETURNING id, name, key, created_at
        `
        const projectResult = await client.query(projectQuery, [name, key])
        const project = projectResult.rows[0]

        const memberQuery = `
            INSERT INTO project_members (project_id, user_id, role)
            VALUES ($1, $2, 'admin')
        `
        await client.query(memberQuery, [project.id, userId])

        await client.query('COMMIT')

        return res.status(201).json({ project })
    } catch (err) {
        await client.query('ROLLBACK')
        throw err
    } finally {
        client.release()
    }
})

export const updateProject = asyncHandler(async (req, res) => {
    const { name, key } = req.body
    const project = req.project

    const query = `
        UPDATE projects
        SET name = COALESCE($1, name),
            key = COALESCE($2, key)
        WHERE id = $3
        RETURNING id, name, key, created_at
    `
    const { rows } = await pool.query(query, [name || null, key || null, project.id])
    const updatedProject = rows[0]

    return res.status(200).json({ project: updatedProject })
})

export const getProjectById = asyncHandler(async (req, res) => {
    const project = req.project
    return res.status(200).json({ project })
})

export const deleteProject = asyncHandler(async (req, res) => {
    const project = req.project

    const query = `
        DELETE FROM projects
        WHERE id = $1
    `
    await pool.query(query, [project.id])

    return res.status(204).end()
})
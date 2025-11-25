import { pool } from '../config/database.js'
import { asyncHandler } from '../middleware/asyncHandler.js'

export const getAllProjectMembers = asyncHandler(async (req, res) => {
    const projectId = req.project.id

    const query = `
        SELECT 
            pm.user_id,
            pm.role,
            pm.joined_at,
            u.handle,
            u.full_name,
            u.avatar_url
        FROM project_members AS pm
        INNER JOIN users AS u 
            ON u.id = pm.user_id
        WHERE pm.project_id = $1
        ORDER BY pm.joined_at
    `
    const { rows } = await pool.query(query, [projectId])
    return res.status(200).json({ members: rows })
})

export const getProjectMember = asyncHandler(async (req, res) => {
    const projectId = req.project.id
    const userId = req.params.userId

    const query = `
        SELECT 
            pm.user_id,
            pm.role,
            pm.joined_at,
            u.handle,
            u.full_name,
            u.avatar_url
        FROM project_members AS pm
        INNER JOIN users AS u 
            ON u.id = pm.user_id
        WHERE pm.project_id = $1 AND pm.user_id = $2
    `
    const { rows } = await pool.query(query, [projectId, userId])
    const member = rows[0]

    if (!member) {
        const err = new Error('Member not found')
        err.status = 404
        throw err
    }

    return res.status(200).json({ member })
})

export const addMemberToProject = asyncHandler(async (req, res) => {
    const projectId = req.project.id
    const { userId, role } = req.body

    if (!userId || !role) {
        const err = new Error('userId and role are required')
        err.status = 400
        throw err
    }

    if (role !== 'admin' && role !== 'dev') {
        const err = new Error('role must be admin or dev')
        err.status = 400
        throw err
    }

    const query = `
        INSERT INTO project_members (project_id, user_id, role, joined_at)
        VALUES ($1, $2, $3, NOW())
        RETURNING project_id, user_id, role, joined_at
    `
    const { rows } = await pool.query(query, [projectId, userId, role])
    const member = rows[0]

    return res.status(201).json({ member })
})

export const removeMemberFromProject = asyncHandler(async (req, res) => {
    const projectId = req.project.id
    const userId = req.params.userId

    const query = `
        DELETE FROM project_members
        WHERE project_id = $1 AND user_id = $2
    `
    const result = await pool.query(query, [projectId, userId])

    if (result.rowCount === 0) {
        const err = new Error('Member not found')
        err.status = 404
        throw err
    }

    return res.status(204).end()
})

export const changeMemberRole = asyncHandler(async (req, res) => {
    const projectId = req.project.id
    const userId = req.params.userId
    const { role } = req.body

    if (!role) {
        const err = new Error('role is required')
        err.status = 400
        throw err
    }

    if (role !== 'admin' && role !== 'dev') {
        const err = new Error('role must be admin or dev')
        err.status = 400
        throw err
    }

    const query = `
        UPDATE project_members
        SET role = $1
        WHERE project_id = $2 AND user_id = $3
        RETURNING project_id, user_id, role, joined_at
    `
    const { rows } = await pool.query(query, [role, projectId, userId])
    const member = rows[0]

    if (!member) {
        const err = new Error('Member not found')
        err.status = 404
        throw err
    }

    return res.status(200).json({ member })
})

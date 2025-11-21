import { pool } from '../config/database.js'
import { asyncHandler } from './asyncHandler.js'

export const loadIssue = asyncHandler(async (req, res, next) => {
    const id = req.params.issueId
    
    if (!id) {
        const err = new Error('Invalid issue Id')
        err.status = 400
        throw err
    }

    const query = `
        SELECT 
            i.id ,
            i.project_id,
            i.sprint_id,
            i.assignee_id,
            i.title,
            i.description,
            i.status,
            i.created_at,
            i.updated_at,
            p.id AS project_id,
            p.name AS project_name,
            p.key AS project_key,
            p.created_at AS project_created_at
        FROM issues AS i
        INNER JOIN projects AS p
            ON p.id = i.project_id
        WHERE i.id = $1
    `

    const { rows } = await pool.query(query, [id])
    const issue = rows[0]

    if (!issue) {
        const err = new Error('Issue not found')
        err.status = 404
        throw err
    }

    req.issue = {
        id: issue.id,
        project_id: issue.project_id,
        sprint_id: issue.sprint_id,
        assignee_id: issue.assignee_id,
        title: issue.title,
        description: issue.description,
        status: issue.status,
        created_at: issue.created_at,
        updated_at: issue.updated_at
    }
    req.project = {
        id: issue.project_id,
        name: issue.project_name,
        key: issue.project_key,
        created_at: issue.project_created_at
    }

    return next()
})

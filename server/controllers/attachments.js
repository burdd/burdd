import { pool } from '../config/database.js'
import { asyncHandler } from '../middleware/asyncHandler.js'

export const getTicketAttachments = asyncHandler(async (req, res) => {
    const ticketId = req.ticket.id

    const query = `
        SELECT 
            id,
            ticket_id,
            url,
            object_key,
            filename,
            mime_type,
            size_bytes,
            created_at
        FROM ticket_attachments
        WHERE ticket_id = $1
        ORDER BY created_at DESC
    `
    const { rows } = await pool.query(query, [ticketId])
    return res.status(200).json({ attachments: rows })
})

export const presignUpload = asyncHandler(async (req, res) => {
    const ticketId = req.ticket.id
    const { filename, mimeType, sizeBytes } = req.body

    if (!filename || !mimeType || !sizeBytes) {
        const err = new Error('filename, mimeType, and sizeBytes are required')
        err.status = 400
        throw err
    }

    // TODO: Generate actual presigned URL when S3 is configured
    // For now, return a mock structure
    const objectKey = `tickets/${ticketId}/${Date.now()}-${filename}`
    const presignedUrl = `https://s3.example.com/presigned-upload-url?key=${objectKey}`

    return res.status(200).json({
        presignedUrl,
        objectKey,
        expiresIn: 3600 // 1 hour
    })
})

export const recordAttachment = asyncHandler(async (req, res) => {
    const ticketId = req.ticket.id
    const { url, objectKey, filename, mimeType, sizeBytes } = req.body

    if (!url || !filename || !mimeType || !sizeBytes) {
        const err = new Error('url, filename, mimeType, and sizeBytes are required')
        err.status = 400
        throw err
    }

    const query = `
        INSERT INTO ticket_attachments (
            ticket_id,
            url,
            object_key,
            filename,
            mime_type,
            size_bytes
        )
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, ticket_id, url, object_key, filename, mime_type, size_bytes, created_at
    `
    const { rows } = await pool.query(query, [
        ticketId,
        url,
        objectKey || null,
        filename,
        mimeType,
        sizeBytes
    ])
    const attachment = rows[0]

    return res.status(201).json({ attachment })
})

export const deleteAttachment = asyncHandler(async (req, res) => {
    const ticketId = req.ticket.id
    const attachmentId = parseInt(req.params.attachmentId)

    if (Number.isNaN(attachmentId)) {
        const err = new Error('Invalid attachmentId')
        err.status = 400
        throw err
    }

    const query = `
        DELETE FROM ticket_attachments
        WHERE id = $1 AND ticket_id = $2
        RETURNING id, object_key
    `
    const { rows } = await pool.query(query, [attachmentId, ticketId])

    if (rows.length === 0) {
        const err = new Error('Attachment not found')
        err.status = 404
        throw err
    }

    // TODO: Delete from S3 using object_key when S3 is configured

    return res.status(204).send()
})

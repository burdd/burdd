import express from 'express'
import { getTicketAttachments, presignUpload, recordAttachment, deleteAttachment } from '../controllers/attachments.js'

const router = express.Router()

router.get('/', getTicketAttachments)
router.post('/presign', presignUpload)
router.post('/', recordAttachment)
router.delete('/:attachmentId', deleteAttachment)

export default router

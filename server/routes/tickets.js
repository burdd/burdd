import express from 'express'
import { requireMember } from '../middleware/requireMember.js'
import { loadTicket } from '../middleware/loadTicket.js'
import { getAllTicketsInProject, createTicketInProject, getAllTicketsForIssue, getTicketById, updateTicket } from '../controllers/tickets.js'
import issuesRouter from './issues.js'
import commentsRouter from './comments.js'
import upvotesRouter from './upvotes.js'
import attachmentsRouter from './attachments.js'

const router = express.Router()

router.get('/', (req, res, next) => {
    // If issue was loaded, show issue tickets
    if (req.issue) {
        return getAllTicketsForIssue(req, res, next)
    }
    // Otherwise show project tickets 
    if (req.project) {
        return getAllTicketsInProject(req, res, next)
    }
})

router.post('/', createTicketInProject)

router.use('/:ticketId', loadTicket)

router.get('/:ticketId', getTicketById)
router.patch('/:ticketId', requireMember, updateTicket)

router.use('/:ticketId/issues', issuesRouter)
router.use('/:ticketId/comments', commentsRouter)
router.use('/:ticketId/upvotes', upvotesRouter)
router.use('/:ticketId/attachments', attachmentsRouter)

export default router
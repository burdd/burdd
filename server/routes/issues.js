import express from 'express'
import { requireMember } from '../middleware/requireMember.js'
import { requireAdmin } from '../middleware/requireAdmin.js'
import { loadIssue } from '../middleware/loadIssue.js'
import { getIssuesInProject, createIssueInProject, getIssuesInSprint, getIssuesForTicket, getIssueById, updateIssueById, deleteIssueById, linkIssueToTicket } from '../controllers/issues.js'

const router = express.Router()

router.get('/', requireMember, (req, res, next) => {
    // If ticket was loaded, show ticket issues
    if (req.ticket) {
        return getIssuesForTicket(req, res, next)
    }
    // If sprint was loaded, show sprint issues
    if (req.sprint) {
        return getIssuesInSprint(req, res, next)
    }
    // Otherwise show project issues
    return getIssuesInProject(req, res, next)
})

router.post('/', requireMember, (req, res, next) => {
    // If ticket was loaded, link issue to ticket
    if (req.ticket) {
        return linkIssueToTicket(req, res, next)
    }
    // Otherwise create issue in project
    return createIssueInProject(req, res, next)
})

router.use('/:issueId', loadIssue)

router.get('/:issueId', requireMember, getIssueById)
router.patch('/:issueId', requireMember, updateIssueById)
router.delete('/:issueId', requireAdmin, deleteIssueById)

export default router
import express from 'express'
import { requireMember } from '../middleware/requireMember.js'
import { requireAdmin } from '../middleware/requireAdmin.js'
import { getAllProjectMembers, getProjectMember, addMemberToProject, removeMemberFromProject, changeMemberRole } from '../controllers/members.js'

const router = express.Router()

router.get('/', requireMember, getAllProjectMembers)
router.post('/', requireAdmin, addMemberToProject)

router.get('/:userId', requireMember, getProjectMember)
router.patch('/:userId', requireAdmin, changeMemberRole)
router.delete('/:userId', requireAdmin, removeMemberFromProject)

export default router

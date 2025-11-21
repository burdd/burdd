import express from 'express'
import { loadProject } from '../middleware/loadProject.js'
import { requireAdmin } from '../middleware/requireAdmin.js'
import { requireMember } from '../middleware/requireMember.js'
import { getAllProjectsForUser, createProject, getProjectById, updateProject, deleteProject } from '../controllers/projects.js'
import membersRouter from './members.js'
import sprintsRouter from './sprints.js'
import issuesRouter from './issues.js'
import ticketsRouter from './tickets.js'

const router = express.Router()

router.get('/', getAllProjectsForUser)
router.post('/', createProject)

router.use('/:projectId', loadProject)

router.get('/:projectId', requireMember, getProjectById)
router.patch('/:projectId', requireAdmin, updateProject)
router.delete('/:projectId', requireAdmin, deleteProject)

router.use('/:projectId/members', membersRouter)
router.use('/:projectId/sprints', sprintsRouter)
router.use('/:projectId/issues', issuesRouter)
router.use('/:projectId/tickets', ticketsRouter)

export default router
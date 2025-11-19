import express from 'express'
import { requireMember } from '../middleware/requireMember.js'
import { requireAdmin } from '../middleware/requireAdmin.js'
import { loadSprint } from '../middleware/loadSprint.js'
import { getAllSprintsInProject, createSprintInProject, getSprintById, updateSprintById, deleteSprintById } from '../controllers/sprints.js'
import issuesRouter from './issues.js'

const router = express.Router()

router.get('/', requireMember, getAllSprintsInProject)
router.post('/', requireAdmin, createSprintInProject)

router.use('/:sprintId', loadSprint)

router.get('/:sprintId', requireMember, getSprintById)
router.patch('/:sprintId', requireAdmin, updateSprintById)
router.delete('/:sprintId', requireAdmin, deleteSprintById)

router.use('/:sprintId/issues', issuesRouter)

export default router
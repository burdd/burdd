import express from 'express'
import passport from 'passport'
import { loginSuccess, loginFailed, logout } from '../controllers/auth.js'

const router = express.Router()

router.get('/login/success', loginSuccess)
router.get('/login/failed', loginFailed)
router.post('/logout', logout)

router.get('/github', 
    passport.authenticate('github', { 
        scope: [ 'read:user' ] 
    })
)

router.get('/github/callback',
    passport.authenticate('github', {
        failureRedirect: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?error=auth_failed`
    }),
    (req, res) => {
        res.redirect(process.env.FRONTEND_URL || 'http://localhost:5173')
    }
)

export default router
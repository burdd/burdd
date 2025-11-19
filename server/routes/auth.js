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
        successRedirect: '/auth/login/success',
        failureRedirect: '/auth/login/failed'
    })
)

export default router
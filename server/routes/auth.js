import express from 'express'
import passport from 'passport'

const router = express.Router()

router.get('/login/success', (req, res) => {
    if (req.user) {
        return res.status(200).json({ success: true, user: req.user })
    }
    return res.status(401).json({ success: false, user: null })
})

router.get('/login/failed', (req, res) => {
    res.status(401).json({ success: false, message: "Authentication failed" })
})

router.post('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err)

        req.session.destroy((err) => {
            if (err) return next(err)

            res.clearCookie('connect.sid')
            return res.status(204).end()
        })
    })
})

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
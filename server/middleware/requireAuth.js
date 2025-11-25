export const requireAuth = (req, res, next) => {
    console.log(
        'requireAuth:',
        req.method,
        req.originalUrl,
        'User:', req.user,
        'Session ID:', req.sessionID,
        'Session:', req.session
    )

    if (!req.user) {
        const err = new Error('Unauthorized')
        err.status = 401
        throw err
    }
    next()
}

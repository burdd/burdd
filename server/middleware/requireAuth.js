export const requireAuth = (req, res, next) => {
    console.log('requireAuth check - User:', req.user);
    console.log('requireAuth check - Session ID:', req.sessionID);
    console.log('requireAuth check - Session:', req.session);
    if (!req.user) {
        const err = new Error('Unauthorized')
        err.status = 401
        throw err
    }
    next()
}

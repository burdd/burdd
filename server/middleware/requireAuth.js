export const requireAuth = (req, res, next) => {
    if (!req.user) {
        const err = new Error('Unauthorized')
        err.status = 401
        throw err
    }
    next()
}

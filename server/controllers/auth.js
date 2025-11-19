export const loginSuccess = (req, res) => {
    if (req.user) {
        return res.status(200).json({ success: true, user: req.user })
    }
    return res.status(401).json({ success: false, user: null })
}

export const loginFailed = (req, res) => {
    res.status(401).json({ success: false, message: 'Authentication failed' })
}

export const logout = (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err)

        req.session.destroy((err) => {
            if (err) return next(err)

            res.clearCookie('connect.sid')
            return res.status(204).end()
        })
    })
}

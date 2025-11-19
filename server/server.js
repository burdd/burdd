import './config/dotenv.js'
import express from 'express'
import cors from 'cors'
import passport from 'passport'
import session from 'express-session'
import { GitHub } from './config/auth.js'
import { pool } from './config/database.js'
import authRoutes from './routes/auth.js'
import { notFoundHandler } from './middleware/notFoundHandler.js'
import { errorHandler } from './middleware/errorHandler.js'

const app = express()

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}))

app.use(passport.initialize())
app.use(passport.session())
passport.use(GitHub)

passport.serializeUser((user, done) => {
    done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
    try {
        const query = `
            SELECT id, github_id, handle, full_name, avatar_url, created_at
            FROM users
            WHERE id =$1
        `
        const res = await pool.query(query, [id])
        const user = res.rows[0] || false

        done(null, user)
    } catch (error) {
        done(error)
    }
})

app.use(express.json())

app.use(cors({
    origin: process.env.FRONTEND_URL,
    methods: 'GET,POST,PUT,DELETE,PATCH',
    credentials: true
}))

app.use('/auth', authRoutes)

app.use(notFoundHandler)
app.use(errorHandler)

const PORT = process.env.PORT 
app.listen(PORT, () => {
    console.log(`🚀 Server running on ${process.env.SERVER_URL}`)
})


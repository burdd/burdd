import './config/dotenv.js'
import express from 'express'
import cors from 'cors'
import passport from 'passport'
import session from 'express-session'
import pgSession from 'connect-pg-simple'
import { GitHub } from './config/auth.js'
import { pool } from './config/database.js'
import authRouter from './routes/auth.js'
import meRouter from './routes/me.js'
import usersRouter from './routes/users.js'
import projectsRouter from './routes/projects.js'
import sprintsRouter from './routes/sprints.js'
import issuesRouter from './routes/issues.js'
import ticketsRouter from './routes/tickets.js'
import { requireAuth } from './middleware/requireAuth.js'
import { notFoundHandler } from './middleware/notFoundHandler.js'
import { errorHandler } from './middleware/errorHandler.js'

const app = express()
const PgStore = pgSession(session)

app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: 'GET,POST,PUT,DELETE,PATCH',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(session({
    store: new PgStore({
        pool: pool,
        tableName: 'session',
        createTableIfMissing: true
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', 
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 24 * 60 * 60 * 1000,
        domain: process.env.NODE_ENV === 'production' ? '.onrender.com' : undefined
    }
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

app.use('/auth', authRouter)

app.use(requireAuth)
app.use('/me', meRouter)
app.use('/users', usersRouter)
app.use('/projects', projectsRouter)
app.use('/sprints', sprintsRouter)
app.use('/issues', issuesRouter)
app.use('/tickets', ticketsRouter)

app.use(notFoundHandler)
app.use(errorHandler)

const PORT = process.env.PORT 
app.listen(PORT, () => {
    console.log(`🚀 Server running on ${process.env.SERVER_URL}`)
})


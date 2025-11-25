import GitHubStrategy from 'passport-github2'
import { pool } from './database.js'

const options = {
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: `${process.env.CLIENT_URL}/api/auth/github/callback`
}

const verify = async (accessToken, refreshToken, profile, done) => {
    const { _json: {id, login, name, avatar_url } } = profile

    try {
        const query = `
            INSERT INTO users (github_id, handle, full_name, avatar_url)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (github_id) DO UPDATE SET
                handle = EXCLUDED.handle,
                full_name = EXCLUDED.full_name,
                avatar_url = EXCLUDED.avatar_url
            RETURNING id, github_id, handle, full_name, avatar_url, created_at
        `
        const values = [id, login, name, avatar_url]

        const res = await pool.query(query, values)
        const user = res.rows[0]

        return done(null, user)
    } catch (error) {
        return done(error)
    }
}

export const GitHub = new GitHubStrategy(options, verify)
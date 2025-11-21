import './dotenv.js'
import { pool } from "./database.js"

const seedData = async () => {
    const client = await pool.connect()
    
    try {
        await client.query('BEGIN')

        console.log('Starting database seed...')

        // 1. Get existing authenticated user or create mock users
        console.log('Setting up users...')
        const userIds = {}
        
        // First, check if there's an existing user (from OAuth login)
        const existingUser = await client.query(
            `SELECT id, handle FROM users WHERE handle = $1 LIMIT 1`,
            ['otutochi']
        )
        
        if (existingUser.rows.length > 0) {
            // Use the existing authenticated user
            userIds['otutochi'] = existingUser.rows[0].id
            console.log(`Found existing user 'otutochi' (id: ${userIds['otutochi']})`)
        }
        
        const users = [
            // Skip otutochi if already exists
            ...(existingUser.rows.length === 0 ? [{ handle: 'otutochi', full_name: 'Otutochi Nwadinkpa', github_id: 'gh_otutochi' }] : []),
            { handle: 'abdul', full_name: 'Abdul-Rashid Zakaria', github_id: 'gh_abdul' },
            { handle: 'kelvin', full_name: 'Kelvin Mathew', github_id: 'gh_kelvin' },
            { handle: 'riley', full_name: 'Riley Chen', github_id: 'gh_riley' },
            { handle: 'lila', full_name: 'Lila Gomez', github_id: 'gh_lila' },
            { handle: 'jesse', full_name: 'Jesse Patel', github_id: 'gh_jesse' },
            { handle: 'QualityOps', full_name: 'Quality Ops', github_id: 'gh_qualityops' },
            { handle: 'SecurityPilot', full_name: 'Security Pilot', github_id: 'gh_securitypilot' },
            { handle: 'QAHarness', full_name: 'QA Harness', github_id: 'gh_qaharness' },
            { handle: 'InternalQA', full_name: 'Internal QA', github_id: 'gh_internalqa' },
            { handle: 'TimelineFan', full_name: 'Timeline Fan', github_id: 'gh_timelinefan' },
            { handle: 'TypoQueen', full_name: 'Typo Queen', github_id: 'gh_typoqueen' },
            { handle: 'AndroidUser', full_name: 'Android User', github_id: 'gh_androiduser' },
            { handle: 'CryptoHater', full_name: 'Crypto Hater', github_id: 'gh_cryptohater' },
            { handle: 'WordyUser', full_name: 'Wordy User', github_id: 'gh_wordyuser' },
        ]

        for (const user of users) {
            const result = await client.query(
                `INSERT INTO users (handle, full_name, github_id, avatar_url)
                 VALUES ($1, $2, $3, $4)
                 RETURNING id`,
                [user.handle, user.full_name, user.github_id, `https://placehold.co/40x40/6366F1/FFFFFF?text=${user.handle[0].toUpperCase()}`]
            )
            userIds[user.handle] = result.rows[0].id
        }

        console.log(`Created ${users.length} users`)

        // 2. Create projects
        console.log('Creating projects...')
        const projectIds = {}

        const projects = [
            { key: 'burdd', name: 'Burdd Core Platform', projectKey: 'BUR' },
            { key: 'sdk', name: 'Burdd SDK', projectKey: 'SDK' },
        ]

        for (const project of projects) {
            const result = await client.query(
                `INSERT INTO projects (name, key)
                 VALUES ($1, $2)
                 RETURNING id`,
                [project.name, project.projectKey]
            )
            projectIds[project.key] = result.rows[0].id
        }

        console.log(`Created ${projects.length} projects`)

        // 3. Add project members
        console.log('Adding project members...')
        const members = [
            { project: 'burdd', user: 'otutochi', role: 'admin' },
            { project: 'burdd', user: 'abdul', role: 'admin' },
            { project: 'burdd', user: 'kelvin', role: 'admin' },
            { project: 'burdd', user: 'riley', role: 'dev' },
            { project: 'burdd', user: 'lila', role: 'dev' },
            { project: 'sdk', user: 'abdul', role: 'admin' },
            { project: 'sdk', user: 'jesse', role: 'dev' },
        ]

        for (const member of members) {
            await client.query(
                `INSERT INTO project_members (project_id, user_id, role)
                 VALUES ($1, $2, $3)`,
                [projectIds[member.project], userIds[member.user], member.role]
            )
        }

        console.log(`Added ${members.length} project members`)

        // 4. Create sprints
        console.log('Creating sprints...')
        const sprintIds = {}

        const sprints = [
            { key: 'burdd-alpha', project: 'burdd', name: 'Alpha polish', start: '2024-07-08', end: '2024-07-19' },
            { key: 'burdd-beta', project: 'burdd', name: 'Beta hardening', start: '2024-07-22', end: '2024-08-02' },
            { key: 'sdk-beta', project: 'sdk', name: 'SDK beta', start: '2024-07-01', end: '2024-07-12' },
        ]

        for (const sprint of sprints) {
            const result = await client.query(
                `INSERT INTO sprints (project_id, name, start, "end")
                 VALUES ($1, $2, $3, $4)
                 RETURNING id`,
                [projectIds[sprint.project], sprint.name, sprint.start, sprint.end]
            )
            sprintIds[sprint.key] = result.rows[0].id
        }

        console.log(`Created ${sprints.length} sprints`)

        // 5. Create issues
        console.log('Creating issues...')
        const issueIds = {}

        const issues = [
            { key: '1000', project: 'burdd', sprint: 'burdd-alpha', title: 'Public ticket intake form', status: 'progress', assignee: 'abdul', description: 'Build responsive form with validation + tokenized confirmation receipt.' },
            { key: '1001', project: 'burdd', sprint: 'burdd-alpha', title: 'Sprint board drag + drop', status: 'review', assignee: 'riley', description: 'Implement column drag with keyboard shortcuts and optimistic updates.' },
            { key: '1002', project: 'burdd', sprint: 'burdd-alpha', title: 'Ticket to issue linkage', status: 'queue', assignee: null, description: 'Allow developers to convert or link tickets from triage dashboard.' },
            { key: '1010', project: 'burdd', sprint: null, title: 'Lighthouse accessibility audit', status: 'queue', assignee: 'lila', description: 'Track regressions on focus order and contrast ratios.' },
            { key: '2000', project: 'sdk', sprint: 'sdk-beta', title: 'Widget authentication handshake', status: 'progress', assignee: 'jesse', description: 'Sign requests with short-lived tokens before proxying to Burdd.' },
            { key: '2001', project: 'sdk', sprint: 'sdk-beta', title: 'Add copy-ready quickstart', status: 'done', assignee: 'abdul', description: 'Author quickstart guide plus runnable sandbox harness.' },
        ]

        for (const issue of issues) {
            const result = await client.query(
                `INSERT INTO issues (project_id, sprint_id, assignee_id, title, description, status)
                 VALUES ($1, $2, $3, $4, $5, $6)
                 RETURNING id`,
                [
                    projectIds[issue.project],
                    issue.sprint ? sprintIds[issue.sprint] : null,
                    issue.assignee ? userIds[issue.assignee] : null,
                    issue.title,
                    issue.description,
                    issue.status
                ]
            )
            issueIds[issue.key] = result.rows[0].id
        }

        console.log(`Created ${issues.length} issues`)

        // 6. Create tickets
        console.log('Creating tickets...')
        const ticketIds = {}

        const tickets = [
            { key: '5001', project: 'burdd', user: 'QualityOps', title: 'Cannot paste stack traces', body: 'Textarea rejects >2000 characters making it hard to attach logs.', category: 'complaint', status: 'new', expected: 'Should accept long text', actual: 'Rejects it', steps: '1. Copy long log\n2. Paste', environment: 'Chrome 114', created: '2024-07-11T15:30:00.000Z' },
            { key: '5002', project: 'burdd', user: 'SecurityPilot', title: 'Need bulk ticket uploader', body: 'Pilot teams want to import backlog from CSV into Burdd.', category: 'feature_request', status: 'triaged', created: '2024-07-10T09:00:00.000Z' },
            { key: '5003', project: 'burdd', user: 'QAHarness', title: 'SDK docs missing auth example', body: 'Need sample verifying the signed widget handshake.', category: 'complaint', status: 'new', expected: 'Docs should show auth', actual: 'Docs are missing auth', steps: '1. Go to docs\n2. Look for auth', environment: 'Docs site', created: '2024-07-08T12:15:00.000Z' },
            { key: '5004', project: 'burdd', user: 'InternalQA', title: 'Tokenized status page 500', body: 'Was fixed during alpha patch 3.', category: 'complaint', status: 'closed', created: '2024-07-04T08:45:00.000Z' },
            { key: '1', project: 'burdd', user: 'TimelineFan', title: 'Bring back chronological timeline by default', body: "I don't want the 'For You' algorithmic feed. Please make the 'Following' (chronological) timeline the default tab, or at least remember my choice.", category: 'feature_request', status: 'new', created: '2025-11-08T14:30:00Z' },
            { key: '2', project: 'burdd', user: 'TypoQueen', title: 'Edit Button for Tweets', body: "We've been asking for this for years. We need a simple edit button to fix typos after posting, maybe with a 5-minute window.", category: 'feature_request', status: 'closed', created: '2025-09-15T10:00:00Z' },
            { key: '3', project: 'burdd', user: 'AndroidUser', title: 'Video player is buggy on Android', body: 'The video player often freezes, fails to load, or the audio goes out of sync.', category: 'complaint', status: 'triaged', expected: 'Video plays smoothly.', actual: 'Video freezes and audio desyncs.', steps: '1. Open the app on Android 13.\n2. Scroll to a video.\n3. Tap play.', environment: 'Samsung Galaxy S23, Android 13, Twitter App v10.2.1', created: '2025-11-01T09:12:00Z' },
            { key: '4', project: 'burdd', user: 'CryptoHater', title: 'Better spam and bot detection in replies', body: "My replies are flooded with crypto scams and spam bots. The current 'hide reply' and 'block' tools aren't enough. We need more aggressive, proactive filtering.", category: 'feature_request', status: 'triaged', created: '2025-10-20T11:00:00Z' },
            { key: '6', project: 'burdd', user: 'WordyUser', title: 'Increase character limit for all users', body: 'The 280-character limit feels outdated. It would be great to have at least 500 characters for everyone.', category: 'feature_request', status: 'rejected', created: '2025-10-05T00:00:00Z' },
        ]

        for (const ticket of tickets) {
            const result = await client.query(
                `INSERT INTO tickets (project_id, user_id, title, body, category, status, expected, actual, steps, environment, created_at)
                 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
                 RETURNING id`,
                [
                    projectIds[ticket.project],
                    userIds[ticket.user],
                    ticket.title,
                    ticket.body,
                    ticket.category,
                    ticket.status,
                    ticket.expected || null,
                    ticket.actual || null,
                    ticket.steps || null,
                    ticket.environment || null,
                    ticket.created
                ]
            )
            ticketIds[ticket.key] = result.rows[0].id
        }

        console.log(`Created ${tickets.length} tickets`)

        // 7. Create ticket upvotes (simulating the upvote counts from mock data)
        console.log('Creating ticket upvotes...')
        const upvotes = [
            { ticket: '5001', count: 12, votedBy: ['otutochi', 'abdul', 'kelvin', 'riley', 'lila', 'jesse', 'QualityOps', 'SecurityPilot', 'QAHarness', 'InternalQA', 'TimelineFan', 'TypoQueen'] },
            { ticket: '5002', count: 45, votedBy: ['otutochi'] }, // simplified - just mark current user voted
            { ticket: '5003', count: 8, votedBy: ['abdul', 'kelvin', 'riley', 'lila', 'jesse', 'QualityOps', 'SecurityPilot', 'QAHarness'] },
            { ticket: '5004', count: 2, votedBy: ['InternalQA', 'TimelineFan'] },
            { ticket: '1', count: 128, votedBy: ['otutochi'] }, // simplified
            { ticket: '2', count: 256, votedBy: ['otutochi'] }, // user voted on this one
            { ticket: '3', count: 76, votedBy: ['abdul'] }, // simplified
            { ticket: '4', count: 215, votedBy: ['kelvin'] }, // simplified
            { ticket: '6', count: 42, votedBy: ['riley'] }, // simplified
        ]

        let upvoteCount = 0
        for (const upvote of upvotes) {
            // Just add first user as voter for simplicity (you can expand this)
            const voter = upvote.votedBy[0]
            if (userIds[voter] && ticketIds[upvote.ticket]) {
                await client.query(
                    `INSERT INTO ticket_upvotes (ticket_id, user_id)
                     VALUES ($1, $2)
                     ON CONFLICT DO NOTHING`,
                    [ticketIds[upvote.ticket], userIds[voter]]
                )
                upvoteCount++
            }
        }

        console.log(`Created ${upvoteCount} ticket upvotes`)

        // 8. Link some tickets to issues
        console.log('Linking tickets to issues...')
        const ticketIssueLinks = [
            { ticket: '5001', issue: '1000' },
            { ticket: '5002', issue: '1000' },
            { ticket: '5003', issue: '2000' },
        ]

        for (const link of ticketIssueLinks) {
            if (ticketIds[link.ticket] && issueIds[link.issue]) {
                await client.query(
                    `INSERT INTO ticket_issues (ticket_id, issue_id)
                     VALUES ($1, $2)`,
                    [ticketIds[link.ticket], issueIds[link.issue]]
                )
            }
        }

        console.log(`Created ${ticketIssueLinks.length} ticket-issue links`)

        await client.query('COMMIT')
        console.log('✅ Database seeded successfully!')

    } catch (error) {
        await client.query('ROLLBACK')
        console.error('❌ Seed failed:', error)
        throw error
    } finally {
        client.release()
    }
}

const main = async () => {
    try {
        await seedData()
        console.log('Seed complete')
        process.exit(0)
    } catch (error) {
        console.error('Seed failed:', error)
        process.exit(1)
    }
}

main()

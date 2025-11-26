# Burdd

CodePath WEB103 Final Project

Designed and developed by: [Otutochi Nwadinkpa, Abdul-Rashid Zakaria, Kelvin Mathew]

🔗 Link to deployed app: https://burdd.onrender.com

## About

### Description and Purpose

Burdd is a lightweight ticket intake + sprint board app for small teams and testing phases. End users can file public tickets (no login) and recieve a tokenized status link, while developers triage those tickets into internal issues, assign owners, add to sprints and track progress

### Inspiration

Most issues trackers separate public intake from internal planning. Burdd merges the two: a no-login ticket portal for users and a minimal sprint board for developers, so feedback moves straight from "reported" to "being fixed"

## Tech Stack

Frontend: JavaScript, React, CSS

Backend: Node.js, Express, Passport.js, PostgreSQL

## Features

### Postgres ✅
The web app uses an appropriately structured PostgreSQL database to store data

<img src='/assets/feature_gifs/postgres.gif' title='Postgres GIF' alt='Postgres GIF' />

### Projects CRUD ✅

Admins can create, add developers to, and delete projects

<img src='/assets/feature_gifs/projects_crud.gif' title='Projects CRUD GIF' alt = 'Projects CRUD GIF' />

### Public ticket intake ✅

End users can submit a public ticket and track its status

<img src='/assets/feature_gifs/public_ticket_intake.gif' title='Public ticket intake GIF' alt='Public ticket intake GIF' />

### Manual triage ✅

Developers can review tickets on their projects, and convert them into new issues or link them to existing issues

<img src='/assets/feature_gifs/manual_triage.gif' title='Manual triage GIF' alt='Manual triage GIF' />

### Issues CRUD ✅

Developers can create, read and update issues

<img src='/assets/feature_gifs/issues_crud.gif' title='Issues CRUD GIF' alt='Issues CRUD GIF' />

### Sprint Board ✅

Developers can manage issues with sprints, and track status across different stages (In Queue, In Progress, Code Review, Done)

<img src='/assets/feature_gifs/sprint_board.gif' title='Sprint Board GIF' alt='Sprint Board GIF' />

### Authentication ✅

Users login via GitHub and only see projects they have been added to

<img src='/assets/feature_gifs/authentication.gif' title='Authentication GIF' alt='Authentication GIF' />


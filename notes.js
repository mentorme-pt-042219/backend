// INSTALL DEPENDENCIES 
const express = require('express'); // REQUIRE EXPRESS
const server = express(); // CREATE SERVER
const helmet = require('helmet'); // REQUIRE HELMET
const knex = require('knex') // REQUIRE KNEX 

// DEFINE KNEX CONFIGURATION
// const knexConfig = {
//     client: 'sqlite3',
//     connection: {
//         filename: './data/projectx.db3',
//     },
//     useNullAsDefault: true, // needed for sqlite
//     };
    
// DEFINE DATABASE CONFIGURATION
const dbConfig = require("./knexfile")
// DEFINE DATABASE
const db = knex(dbConfig.development);


// TEST ROUTE HANDLER FUNCTION
server.get('/', (req, res) => {
  res.send('Server is running ');
});

// SET PORT 
const port = process.env.PORT || 9000; 

// USE MIDDLEWARE
server.use(express.json())

// TEST
server.get('/api/test', (req, res) => {
    db.select().from('projects').then(data => res.json(data)).catch(err => console.log(err))
});

// RETRIEVE ALL PROJECTS    1
server.get('/api/projects', (req, res, next) => {
    db('projects')
        .then(data => res.status(200).json(data))
        .catch(next)
});

// RETREIVE PROJECT BY ID   2
server.get('/api/projects/:id', (req, res, next) => {
    const { id } = req.params;
        db.select()
            .from('projects')
            .where({ id })
            .then(projectArr => {
                db.select()
                    .from('actions')
                    .where('project_id', id)
                    .then(actions => {
                        const project = projectArr[0];
                res.status(200).json({
                    id: project.id,
                    name: project.name,
                    description: project.description,
                    completed: project.completed ? true : false,
                    actions: actions.map(action => {
                        return {
                            id: action.id,
                            description: action.description,
                            notes: action.notes,
                            completed: action.completed ? true : false
                        }
                    })
                })
            })
            .catch(next)
        })
        .catch(next)
    }, (req, res, next) => {
        res.status(500).json({ err });
    }
);

// CREATE A PROJECT 3
server.post('/api/projects', (req, res, next) => {
    const { name, description, completed } = req.body;
    db.insert({ name, description, completed })
        .into('projects')
        .then(id => res.status(201).json({ id }))
        .catch(next);
    }, (req, res, next) => {
    res.status(500).json({ err });
});

// LOGIC FOR LISTING ALL ACTIONS
server.get('/api/actions', (req, res, next) => {
    db
        .select()
        .from('actions')
        .then(actions => res.status(200).json(actions))
        .catch(next)
    }, (req, res, next) => {
    res.status(500).json(err);
});

// LOGIC FOR CREATING A NEW ACTOIN
server.post('/api/actions', (req, res, next) => {
    const { description, notes, completed, project_id } = req.body;
    db
        .insert({ description, notes, completed, project_id })
        .into('actions')
        .then(id => res.status(201).json({ id }))
        .catch(next)
    }, (req, res, next) => {
    res.status(500).json(err);
});

// RUN SERVER
server.listen(port, () => 
    console.log(`\n Server running on PORT ${port} \n`)
);

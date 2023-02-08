// Import Dependencies
const express = require('express')
const Console = require('../models/console')
// Create router
const router = express.Router()

//////////////////////
/// Routers //////////
//////////////////////

router.get('/', (req, res) => {
    const { username, loggedIn, userId } = req.session
    Console.find({})
        .populate('owner', 'username')
        .populate('reviews.author', '-password')
        .then(consoles => { 
            res.render('consoles/index', { consoles, username, loggedIn, userId })
        })
        // catch errors if they occur
        .catch(err => {
            console.log(err)
            res.redirect(`/error?error=${err}`)
        })
})

// index that shows only the user's consoles
router.get('/mine', (req, res) => {
    const { username, userId, loggedIn } = req.session
	Console.find({ owner: userId })
		.then(consoles => {
			res.render('consoles/index', { consoles, username, loggedIn })
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

// new route -> GET route that renders our page with the form
router.get('/new', (req, res) => {
	const { username, userId, loggedIn } = req.session
	res.render('consoles/new', { username, loggedIn })
})

// create -> POST route that actually calls the db and makes a new document
router.post('/', (req, res) => {
	req.body.ready = req.body.ready === 'on' ? true : false

	req.body.owner = req.session.userId
	Console.create(req.body)
		.then(gameConsole => {
			console.log('this was returned from create', { gameConsole })
			res.redirect('/consoles')
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

// edit route -> GET that takes us to the edit form view
router.get('/:id/edit', (req, res) => {
	// we need to get the id
	const consoleId = req.params.id
	Console.findById(consoleId)
		.then(gameConsole => {
			res.render('consoles/edit', { gameConsole })
		})
		.catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})

// update route
router.put('/:id', (req, res) => {
	const gameConsoleId = req.params.id
	req.body.ready = req.body.ready === 'on' ? true : false

	Console.findByIdAndUpdate(gameConsoleId, req.body, { new: true })
		.then(console => {
			res.redirect(`/consoles/${gameConsole.id}`)
		})
		.catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})

// show route
router.get('/:id', (req, res) => {
	const consoleId = req.params.id
	Console.findById(consoleId)
        .populate('reviews.author', 'username')
		.then(console => {
            const {username, loggedIn, userId} = req.session
			res.render('consoles/show', { console, username, loggedIn, userId })
		})
		.catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})

// delete route
router.delete('/:id', (req, res) => {
	const gameConsoleId = req.params.id
	Console.findByIdAndRemove(gameConsoleId)
		.then(gameConsole => {
			res.redirect('/consoles')
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

// Export the Router
module.exports = router

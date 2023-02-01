// Import Dependencies
const express = require('express')
const Console = require('../models/console')
// Create router
const router = express.Router()

// Router Middleware
// Authorization middleware
// If you have some resources that should be accessible to everyone regardless of loggedIn status, this middleware can be moved, commented out, or deleted. 
//router.use((req, res, next) => {
//	// checking the loggedIn boolean of our session
//	if (req.session.loggedIn) {
//		// if they're logged in, go to the next thing(thats the controller)
//		next()
//	} else {
//		// if they're not logged in, send them to the login page
//		res.redirect('/auth/login')
//	}
//})

// Routes

// index ALL
//router.get('/', (req, res) => {
//	Console.find({})
//		.then(consoles => {
//			const username = req.session.username
//			const loggedIn = req.session.loggedIn
//			res.status(201).json({ consoles: consoles })
//			// res.render('consoles/index', { consoles, username, loggedIn })
//		})
//		.catch(error => {
//			res.redirect(`/error?error=${error}`)
//		})
//})

router.get('/', (req, res) => {
    const { username, loggedIn, userId } = req.session
    // find all the fruits
    Console.find({})
        // there's a built in function that runs before the rest of the promise chain
        // this function is called populate, and it's able to retrieve info from other documents in other collections
        .populate('owner', 'username')
        .populate('reviews.author', '-password')
        // send json if successful
        .then(consoles => { 
            // res.json({ consoles: consoles })
            // now that we have liquid installed, we're going to use render as a response for our controllers
            res.render('consoles/index', { consoles, username, loggedIn, userId })
        })
        // catch errors if they occur
        .catch(err => {
            console.log(err)
            // res.status(404).json(err)
            res.redirect(`/error?error=${err}`)
        })
})

// index that shows only the user's consoles
router.get('/mine', (req, res) => {
    // destructure user info from req.session
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
		.then(console => {
			console.log('this was returned from create', console)
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
		.then(console => {
			res.render('consoles/edit', { console })
		})
		.catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})

// update route
router.put('/:id', (req, res) => {
	const consoleId = req.params.id
	req.body.ready = req.body.ready === 'on' ? true : false

	Console.findByIdAndUpdate(consoleId, req.body, { new: true })
		.then(console => {
			res.redirect(`/consoles/${console.id}`)
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
	const consoleId = req.params.id
	Console.findByIdAndRemove(consoleId)
		.then(console => {
			res.redirect('/consoles')
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

// Export the Router
module.exports = router

/////////////////////////////////////
//// Import Dependencies         ////
/////////////////////////////////////
const express = require('express')
const Review = require('../models/review')

/////////////////////////////////////
//// Create Router               ////
/////////////////////////////////////
const router = express.Router()

//////////////////////////////
//// Routes               ////
//////////////////////////////

// INDEX route 
// Read -> finds and displays all reviews
// ('/')
router.get('/review', (req, res) => {
    const { username, loggedIn, userId } = req.session
    // find all the reviews
    Review.find({})
        // there's a built in function that runs before the rest of the promise chain
        // this function is called populate, and it's able to retrieve info from other documents in other collections
        .populate('owner', 'username')
        .populate('comments.author', '-password')
        // send json if successful
        .then(reviews => { 
            // res.json({ reviews: reviews })
            // now that we have liquid installed, we're going to use render as a response for our controllers
            res.render('reviews/index', { reviews, username, loggedIn, userId })
        })
        // catch errors if they occur
        .catch(err => {
            console.log(err)
            // res.status(404).json(err)
            res.redirect(`/error?error=${err}`)
        })
})

// GET for the new page
// should show a form where a user can create a new review
router.get('/new', (req, res) => {
    res.render('reviews/new', { ...req.session })
})

// CREATE route
// Create -> receives a request body, and creates a new document in the database
router.post('/review', (req, res) => {
    // console.log('this is req.body before owner: \n', req.body)
    // here, we'll have something called a request body
    // inside this function, that will be called req.body
    // we want to pass our req.body to the create method
    // we want to add an owner field to our review
    // luckily for us, we saved the user's id on the session object, so it's really easy for us to access that data
    req.body.owner = req.session.userId

    // we need to do a little js magic, to get our checkbox turned into a boolean
    // here we use a ternary operator to change the on value to send as true
    // otherwise, make that field false
    req.body.readyToEat = req.body.readyToEat === 'on' ? true : false
    const newReview = req.body
    console.log('this is req.body aka newReview, after owner\n', newReview)
    Review.create(newReview)
        // send a 201 status, along with the json response of the new review
        .then(review => {
            // in the API server version of our code we sent json and a success msg
            // res.status(201).json({ review: review.toObject() })
            // we could redirect to the 'mine' page
            // res.status(201).redirect('/reviews/mine')
            // we could also redirect to the new review's show page
            res.redirect(`/reviews/${review.id}`)
        })
        // send an error if one occurs
        .catch(err => {
            console.log(err)
            // res.status(404).json(err)
            res.redirect(`/error?error=${err}`)
        })
})

// GET route
// Index -> This is a user specific index route
// this will only show the logged in user's reviews
router.get('/myreviews', (req, res) => {
    // find reviews by ownership, using the req.session info
    Review.find({ owner: req.session.userId })
        .populate('owner', 'username')
        .populate('comments.author', '-password')
        .then(reviews => {
            // if found, display the reviews
            // res.status(200).json({ reviews: reviews })
            res.render('reviews/index', { reviews, ...req.session })
        })
        .catch(err => {
            // otherwise throw an error
            console.log(err)
            // res.status(400).json(err)
            res.redirect(`/error?error=${err}`)
        })
})

// Get route to see all user's reviews on a console
router.get('/:consoleId', (req, res) => {
    const consoleId = req.params.consoleId
    // then we'll protect this route against non-logged in users
    console.log('this is the session\n', req.session)
        // if logged in, make the logged in user the author of the review
        //req.body.author = req.session.userId
        //const theReview = req.body
        Review.find({ console: consoleId })
            .then(reviews => {       
                console.log(reviews)
                // res.render(view, data)
            })
            .then(console => {       
                res.redirect(`/consoles/${consoleId}`)
            })
            .catch(err => {
                console.log(err)                
                res.redirect(`/error?error=${err}`)
            })
})

// GET route for getting json for specific user reviews
// Index -> This is a user specific index route
// this will only show the logged in user's reviews
router.get('/json', (req, res) => {
    // find reviews by ownership, using the req.session info
    Review.find({ owner: req.session.userId })
        .populate('owner', 'username')
        .populate('comments.author', '-password')
        .then(reviews => {
            // if found, display the reviews
            res.status(200).json({ reviews: reviews })
            // res.render('reviews/index', { reviews, ...req.session })
        })
        .catch(err => {
            // otherwise throw an error
            console.log(err)
            res.status(400).json(err)
        })
})

// GET request -> edit route
// shows the form for updating a review
router.get('/edit/:id', (req, res) => {
    // because we're editing a specific review, we want to be able to access the review's initial values. so we can use that info on the page.
    const reviewId = req.params.id
    Review.findById(reviewId)
        .then(review => {
            res.render('reviews/edit', { review, ...req.session })
        })
        .catch(err => {
            res.redirect(`/error?error=${err}`)
        })
})

// PUT route
// Update -> updates a specific review(only if the review's owner is updating)
router.put('/:id', (req, res) => {
    const id = req.params.id
    req.body.readyToEat = req.body.readyToEat === 'on' ? true : false
    Review.findById(id)
        .then(review => {
            // if the owner of the review is the person who is logged in
            if (review.owner == req.session.userId) {
                // send success message
                // res.sendStatus(204)
                // update and save the review
                return review.updateOne(req.body)
            } else {
                // otherwise send a 401 unauthorized status
                // res.sendStatus(401)
                res.redirect(`/error?error=You%20Are%20not%20allowed%20to%20edit%20this%20review`)
            }
        })
        .then(() => {
            // console.log('the review?', review)
            res.redirect(`/reviews/mine`)
        })
        .catch(err => {
            console.log(err)
            // res.status(400).json(err)
            res.redirect(`/error?error=${err}`)
        })
})

// DELETE route
// Delete -> delete a specific review
router.delete('review/:id', (req, res) => {
    const id = req.params.id
    Review.findById(id)
        .then(review => {
            // if the owner of the review is the person who is logged in
            if (review.owner == req.session.userId) {
                // send success message
                // res.sendStatus(204)
                // delete the review
                return review.deleteOne()
            } else {
                // otherwise send a 401 unauthorized status
                // res.sendStatus(401)
                res.redirect(`/error?error=You%20Are%20not%20allowed%20to%20delete%20this%20review`)
            }
        })
        .then(() => {
            res.redirect('/reviews/mine')
        })
        .catch(err => {
            console.log(err)
            // res.status(400).json(err)
            res.redirect(`/error?error=${err}`)
        })
})

// SHOW route
// Read -> finds and displays a single resource
router.get('review/:id', (req, res) => {
    // get the id -> save to a variable
    const id = req.params.id
    // use a mongoose method to find using that id
    Review.findById(id)
        .populate('comments.author', 'username')
        // send the review as json upon success
        .then(review => {
            // res.json({ review: review })
            res.render('reviews/show.liquid', {review, ...req.session})
        })
        // catch any errors
        .catch(err => {
            console.log(err)
            // res.status(404).json(err)
            res.redirect(`/error?error=${err}`)
        })
})


//////////////////////////////
//// Export Router        ////
//////////////////////////////
module.exports = router
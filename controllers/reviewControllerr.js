/////////////////////////////////////
//// Import Dependencies         ////
/////////////////////////////////////
const express = require('express')
const Review = require('../models/review')

const Console = require('../models/console')

/////////////////////////////////////
//// Create Router               ////
/////////////////////////////////////
const router = express.Router()

//////////////////////////////
//// Routes               ////
//////////////////////////////

// from server.js
// (/reviews/...)

// INDEX route 
// Read -> finds and displays all reviews
// ('/')
//router.get('/', (req, res) => {
//    const { username, loggedIn, userId } = req.session
//    // find all the reviews
//    Review.find({})
//        .populate('owner', 'username')
//        .populate('reviews.author', '-password')
//        .then(reviews => { 
//            // now that we have liquid installed, we're going to use render as a response for our controllers
//            res.render('reviews/index', { reviews, username, loggedIn, userId })
//        })
//        // catch errors if they occur
//        .catch(err => {
//            console.log(err)
//            // res.status(404).json(err)
//            res.redirect(`/error?error=${err}`)
//        })
//})
//
//// GET for the new page
//// should show a form where a user can create a new review
//router.get('/new', (req, res) => {
//    res.render('reviews/new', { ...req.session })
//})
////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////

// CREATE route
// Create -> receives a request body, and creates a new document in the database
router.post('/:consoleId', (req, res) => {
    const consoleId = req.params.consoleId
    if (req.session.loggedIn) {
        req.body.arthor = req.session.userId
        const theReview = req.content
        Console.findById(consoleId)
            .then(gameConsole => {
                console.log(req.body.author)
                gameConsole.reviews.push(theReview)

                return gameConsole.save()
            })
            .then(console => {
                res.redirect(`/consoles/${console.id}`)
            })
            .catch(err => {
                console.log(err)
                res.redirect(`/error?error=${err}`)
            })
    } else {
        res.redirect(`/error?error=You%20Can%20Not%20review`)
    }
    // here we use a ternary operator to change the on value to send as true
    //const newReview = req.body
    //console.log('this is req.body aka newReview, after owner\n', newReview)
    //Review.create(newReview)
    //    // send a 201 status, along with the json response of the new review
    //    .then(review => {
    //        // in the API server version of our code we sent json and a success msg
    //        // res.status(201).json({ review: review.toObject() })
    //        // we could redirect to the 'mine' page
    //        // res.status(201).redirect('/reviews/mine')
    //        // we could also redirect to the new review's show page
    //        res.redirect(`/reviews`)
    //    })
    //    // send an error if one occurs
    //    .catch(err => {
    //        console.log(err)
    //        res.redirect(`/error?error=${err}`)
    //    })
})
// DESTROY 
router.delete('/delete/:consoleId/:revId', (req, res) => {
    // isolate the ids and save to variables so we don't have to keep typing req.params
    // const consoleId = req.params.consoleId
    // const revId = req.params.revId
    const { consoleId, revId } = req.params
    // get the console
    Console.findById(consoleId)
        .then(console => {
            // get the review, we'll use the built in subdoc method called .id()
            const theReview = console.reviews.id(revId)
            console.log('this is the review to be deleted: \n', theReview)
            // then we want to make sure the user is loggedIn, and that they are the author of the review
            if (req.session.loggedIn) {
                // if they are the author, allow them to delete
                if (theReview.author == req.session.userId) {
                    // we can use another built in method - remove()
                    theReview.remove()
                    console.save()
                    // res.sendStatus(204) //send 204 no content
                    res.redirect(`/consoles/${console.id}`)
                } else {
                    // otherwise send a 401 - unauthorized status
                    // res.sendStatus(401)
                    res.redirect(`/error?error=You%20Are%20not%20allowed%20to%20delete%20this%20review`)
                }
            } else {
                // otherwise send a 401 - unauthorized status
                // res.sendStatus(401)
                res.redirect(`/error?error=You%20Are%20not%20allowed%20to%20delete%20this%20review`)
            }
        })
        .catch(err => {
            console.log(err)
            // res.status(400).json(err)
            res.redirect(`/error?error=${err}`)
        })
})

// GET route
// Index -> This is a user specific index route
// this will only show the logged in user's reviews
//router.get('/myreviews', (req, res) => {
//    // find reviews by ownership, using the req.session info
//    Review.find({ owner: req.session.userId })
//        .populate('owner', 'username')
//        .populate('reviews.author', '-password')
//        .then(reviews => {
//            // if found, display the reviews
//            // res.status(200).json({ reviews: reviews })
//            res.render('reviews/index', { reviews, ...req.session })
//        })
//        .catch(err => {
//            // otherwise throw an error
//            console.log(err)
//            // res.status(400).json(err)
//            res.redirect(`/error?error=${err}`)
//        })
//})
//
//// Get route to see all user's reviews on a console
//router.get('/:consoleId', (req, res) => {
//    const consoleId = req.params.consoleId
//    // then we'll protect this route against non-logged in users
//    console.log('this is the session\n', req.session)
//        // if logged in, make the logged in user the author of the review
//        //req.body.author = req.session.userId
//        //const theReview = req.body
//        Review.find({ console: consoleId })
//            .then(reviews => {       
//                console.log(reviews)
//                // res.render(view, data)
//            })
//            .then(console => {       
//                res.redirect(`/consoles/${consoleId}`)
//            })
//            .catch(err => {
//                console.log(err)                
//                res.redirect(`/error?error=${err}`)
//            })
//})
//
//// GET route for getting json for specific user reviews
//// Index -> This is a user specific index route
//// this will only show the logged in user's reviews
//router.get('/json', (req, res) => {
//    // find reviews by ownership, using the req.session info
//    Review.find({ owner: req.session.userId })
//        .populate('owner', 'username')
//        .populate('reviews.author', '-password')
//        .then(reviews => {
//            // if found, display the reviews
//            res.status(200).json({ reviews: reviews })
//            // res.render('reviews/index', { reviews, ...req.session })
//        })
//        .catch(err => {
//            // otherwise throw an error
//            console.log(err)
//            res.status(400).json(err)
//        })
//})
//
//// GET request -> edit route
//// shows the form for updating a review
//router.get('/edit/:id', (req, res) => {
//    // because we're editing a specific review, we want to be able to access the review's initial values. so we can use that info on the page.
//    const reviewId = req.params.id
//    Review.findById(reviewId)
//        .then(review => {
//            res.render('reviews/edit', { review, ...req.session })
//        })
//        .catch(err => {
//            res.redirect(`/error?error=${err}`)
//        })
//})
//
//// PUT route
//// Update -> updates a specific review(only if the review's owner is updating)
//router.put('/:id', (req, res) => {
//    const id = req.params.id
//    req.body.readyToEat = req.body.readyToEat === 'on' ? true : false
//    Review.findById(id)
//        .then(review => {
//            // if the owner of the review is the person who is logged in
//            if (review.owner == req.session.userId) {
//                // send success message
//                // res.sendStatus(204)
//                // update and save the review
//                return review.updateOne(req.body)
//            } else {
//                // otherwise send a 401 unauthorized status
//                // res.sendStatus(401)
//                res.redirect(`/error?error=You%20Are%20not%20allowed%20to%20edit%20this%20review`)
//            }
//        })
//        .then(() => {
//            // console.log('the review?', review)
//            res.redirect(`/reviews/mine`)
//        })
//        .catch(err => {
//            console.log(err)
//            // res.status(400).json(err)
//            res.redirect(`/error?error=${err}`)
//        })
//})
//
//// DELETE route
//// Delete -> delete a specific review
//router.delete('review/:id', (req, res) => {
//    const id = req.params.id
//    Review.findById(id)
//        .then(review => {
//            // if the owner of the review is the person who is logged in
//            if (review.owner == req.session.userId) {
//                // send success message
//                // res.sendStatus(204)
//                // delete the review
//                return review.deleteOne()
//            } else {
//                // otherwise send a 401 unauthorized status
//                // res.sendStatus(401)
//                res.redirect(`/error?error=You%20Are%20not%20allowed%20to%20delete%20this%20review`)
//            }
//        })
//        .then(() => {
//            res.redirect('/reviews/mine')
//        })
//        .catch(err => {
//            console.log(err)
//            // res.status(400).json(err)
//            res.redirect(`/error?error=${err}`)
//        })
//})
//
//// SHOW route
//// Read -> finds and displays a single resource
//router.get('review/:id', (req, res) => {
//    // get the id -> save to a variable
//    const id = req.params.id
//    // use a mongoose method to find using that id
//    Review.findById(id)
//        .populate('reviews.author', 'username')
//        // send the review as json upon success
//        .then(review => {
//            // res.json({ review: review })
//            res.render('reviews/show.liquid', {review, ...req.session})
//        })
//        // catch any errors
//        .catch(err => {
//            console.log(err)
//            // res.status(404).json(err)
//            res.redirect(`/error?error=${err}`)
//        })
//})
//
//
////////////////////////////////
//// Export Router        ////
//////////////////////////////
module.exports = router
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
        req.body.author = req.session.userId
        const theReview = req.body
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
})

/// EDIT
router.put('/edit/:consoleId/:revId', (req, res) => {
    const { consoleId, revId } = req.params
    // only for document/models
    Console.findById(consoleId)
        .then(gameConsole => {
            // subdocument line
            const theReview = gameConsole.reviews.id(revId)
            console.log('this is the review to be updated: \n', theReview)
            if (req.session.loggedIn) {
                if (theReview.author == req.session.userId) {
                    // theReview.remove()
                    theReview.title = req.body.title
                    theReview.content = req.body.content
                    // markModified updates the reviews field in the console model
                    gameConsole.markModified('reviews')
                    gameConsole.save()
                    res.redirect(`/consoles/${gameConsole.id}`)
                } else {
                    res.redirect(`/error?error=You%20Are%20not%20allowed%20to%20delete%20this%20review`)
                }
            } else {
                res.redirect(`/error?error=You%20Are%20not%20allowed%20to%20delete%20this%20review`)
            }
        })
        .catch(err => {
            console.log(err)
            res.redirect(`/error?error=${err}`)
        })
})
    // find the consoleId we want to update
    // find the reviewId we need to update
    // replace old reviewId with new reviewId
    // send back an error if it doesn't work

// DESTROY 
// ('/reviews/delete/:id')
router.delete('/delete/:consoleId/:revId', (req, res) => {
    // isolate the ids and save to variables so we don't have to keep typing req.params
    // const consoleId = req.params.consoleId
    // const revId = req.params.revId
    const { consoleId, revId } = req.params
    // get the console
    Console.findById(consoleId)
        .then(gameConsole => {
            // get the review, we'll use the built in subdoc method called .id()
            const theReview = gameConsole.reviews.id(revId)
            console.log('this is the review to be deleted: \n', theReview)
            // then we want to make sure the user is loggedIn, and that they are the author of the review
            if (req.session.loggedIn) {
                // if they are the author, allow them to delete
                if (theReview.author == req.session.userId) {
                    // we can use another built in method - remove()
                    theReview.remove()
                    gameConsole.save()
                    // res.sendStatus(204) //send 204 no content
                    res.redirect(`/consoles/${gameConsole.id}`)
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


////////////////////////////////
//// Export Router        ////
//////////////////////////////
module.exports = router
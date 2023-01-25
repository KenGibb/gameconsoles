const express = require('express')
const Review = require('../models/review')

const router = express.Router()

/////////////////////////////
/////// Routes //////////////
/////////////////////////////

// INDEX Route -> displays all reviews
// 
//router.post('/reviews/:consoleId', (req, res) => {
//    const consoleId = req.params.consoleId
//    Review.find({})
//        .populate('owner', 'username')
//        .populate('reviews.author', '-password')
//        .then(reviews => {
//            res.json({ reviews: reviews})
//        })
//        .catch(err => {
//            console.log(err)
//            res.redirect(`/error?error=${err}`)
//        })
//})

// Get Route for new review
//router.get('/new', (rew, res) => {
//    res.render('reviews/new', { ...req.session })
//})

//// CREATE Route
//router.post('/', (req, res) => {
//    req.body.owner = req.session.userId
//    req.body.
//})

router.post('/:consoleId', (req, res) => {
    const consoleId = req.params.consoleId
    // then we'll protect this route against non-logged in users
    console.log('this is the session\n', req.session)
    if (req.session.loggedIn) {
        // if logged in, make the logged in user the author of the review
        req.body.author = req.session.userId
        const theReview = req.body
        Console.findById(consoleId)
            .then(console => {       
                console.reviews.push(theReview)      
                return console.save()
            })
            .then(console => {       
                res.redirect(`/consoles/${console.id}`)
            })
            .catch(err => {
                console.log(err)                
                res.redirect(`/error?error=${err}`)
            })
    } else {
        res.redirect(`/error?error=You%20Are%20not%20allowed%20to%20review%20this%20console`)
    }
})

// DELETE -> `/reviews/delete/<someConsoleId>/<somereviewId>`
// only the author of the review can delete the review
router.delete('/delete/:consoleId/:commId', (req, res) => {
    // isolate the ids and save to variables so we don't have to keep typing req.params
    const { consoleId, commId } = req.params
    Console.findById(consoleId)
        .then(console => {
            const theReview = console.reviews.id(commId)
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

////////////////////////////
/////// Export Router //////
/////////////////////////////
module.exports = router
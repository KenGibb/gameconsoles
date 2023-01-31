// Import Dependencies
const express = require('express')
const Favorite = require('../models/favorite')
const Console = require('../models/console')
/////////////////////////////////////
//// Create Router               ////
/////////////////////////////////////
const router = express.Router()

//////////////////////////////
//// Routes               ////
//////////////////////////////
// Subdocuments are not mongoose models. That means they don't have their own collection, and they don't come with the same model methods that we're used to(they have some their own built in.)
// This also means, that a subdoc is never going to be viewed without it's parent document. We'll never see a favorite without seeing the console it was favoriteed on first.

// This also means, that when we make a subdocument, we must MUST refer to the parent so that mongoose knows where in mongodb to store this subdocument

// index for user favorites 
// similar to my consoles index but with favorites 
// render from the path favorites/index 

router.get('/', (req,res) => {
    const { username, userId, loggedIn } = req.session
	Favorite.find({ owner: userId })
        .populate('console')
		.then(favorites => {
            // console.log(favorites)
            res.render('favs/index', { favorites, username, loggedIn })
            // res.redirect('/favorites')
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})

})

// DELETE -> `/favorites/delete/<someFaveId>`
// make sure only the author of the favorite can delete the favorite
router.delete('/:favoriteID', (req, res) => {
    // isolate the ids and save to variables so we don't have to keep typing req.params
    // const consoleID = req.params.consoleID
    console.log("DELETE ROUTE HIT")
    const favoriteID  = req.params.favoriteID
    // get the console
    Favorite.findById(favoriteID)
        .then(favorite => {
            console.log('favorite found')
            // get the favorite, we'll use the built in subdoc method called .id()
            // then we want to make sure the user is loggedIn, and that they are the author of the favorite
            if (req.session.loggedIn) {
                // if they are the author, allow them to delete
                if (favorite.owner == req.session.userId) {
                    // we can use another built in method - remove()
                    return favorite.deleteOne()
        
                    // res.sendStatus(204) //send 204 no content
                   // res.redirect(`/favorites`)
                } else {
                    // otherwise send a 401 - unauthorized status
                    // res.sendStatus(401)
                    res.redirect(`/error?error=You%20Are%20not%20allowed%20to%20delete%20this%20favorite`)
                }
            } else {
                // otherwise send a 401 - unauthorized status
                // res.sendStatus(401)
                res.redirect(`/error?error=You%20Are%20not%20allowed%20to%20delete%20this%20favorite`)
            }
        })
        .then(()=> {
            res.redirect('/favorites')
        })
        .catch(err => {
            console.log(err)
            // res.status(400).json(err)
            res.redirect(`/error?error=${err}`)
        })
})
// POST -> `/favorites/<someFaveId>`
// only loggedin users can post favorites
// bc we have to refer to a console, we'll do that in the simplest way via the route
router.post('/:consoleID', (req, res) => {
    // first we get the consoleID and save to a variable
    const consoleID = req.params.consoleID

    req.body.fav = req.body.fav === 'on' ? true : false
    // then we'll protect this route against non-logged in users
    console.log('this is the session\n', req.session)
    if (req.session.loggedIn) {
        // if logged in, make the logged in user the author of the favorite
        // this is exactly like how we added the owner to our consoles
        // saves the req.body to a variable for easy reference later
        // find a specific console
        Favorite.create({console: consoleID, owner: req.session.userId })

            // respond with a 201 and the console itself
            .then(console => {
                // res.status(201).json({ console: console })
                res.redirect(`/favorites`)
            })
            // catch and handle any errors
            .catch(err => {
                console.log(err)
                // res.status(400).json(err)
                res.redirect(`/error?error=${err}`)
            })
    } else {
        // res.sendStatus(401) //send a 401-unauthorized
        res.redirect(`/error?error=You%20Are%20not%20allowed%20to%20favorite%20on%20this%20console`)
    }
})



//////////////////////////////
//// Export Router        ////
//////////////////////////////
module.exports = router
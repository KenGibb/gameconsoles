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


router.get('/', (req,res) => {
    const { username, userId, loggedIn } = req.session
	Favorite.find({ owner: userId })
        .populate('console')
		.then(favorites => {
            // console.log(favorites)
            res.render('favorites/index', { favorites, username, loggedIn })
            // res.redirect('/favorites')
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})

})



// DELETE -> `/favorites/delete/<someFaveId>`
// make sure only the author of the favorite can delete the favorite
router.delete('/:favoriteID', (req, res) => {
    console.log("Removed favorite?")
    const favoriteID  = req.params.favoriteID
    Favorite.findById(favoriteID)
        .then(favorite => {
            console.log('favorite found')
            if (req.session.loggedIn) {
                if (favorite.owner == req.session.userId) {
                    return favorite.deleteOne()
                } else {
                    res.redirect(`/error?error=You%20Are%20not%20allowed%20to%20delete%20this%20favorite`)
                }
            } else {
                // otherwise send a 401 - unauthorized status
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
router.post('/:consoleID', (req, res) => {
    const consoleID = req.params.consoleID

    req.body.fav = req.body.fav === 'on' ? true : false
    // then we'll protect this route against non-logged in users
    console.log('this is the session\n', req.session)
    if (req.session.loggedIn) {
        Favorite.create({console: consoleID, owner: req.session.userId })
            .then(console => {
                res.redirect(`/favorites`)
            })
            .catch(err => {
                console.log(err)
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
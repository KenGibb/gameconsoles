const express = require('express')
const Review = require('../models/review')

const router = express.Router()

/////////////////////////////
/////// Routes //////////////
/////////////////////////////

// INDEX Route -> displays all reviews
router.get('/', (req, res) => {
    const { username , loggedIn, userId } = req.session
    Review.find({})
        .populate('owner', 'username')
        .populate('reviews.author', '-password')
        .then(reviews => {
            res.json({ reviews: reviews})
        })
        .catch(err => {
            console.log(err)
            res.redirect(`/error?error=${err}`)
        })
})


////////////////////////////
/////// Export Router //////
/////////////////////////////
module.exports = router
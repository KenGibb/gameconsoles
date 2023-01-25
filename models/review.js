const mongoose = require('../utils/connection.js')

const { Schema, model } = mongoose

// review schema
const reviewSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String
    },
    console: {
		type: Schema.Types.ObjectId,
		ref: 'Console',
        required: true
	},
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
}, {
    timestamps: true
})

//const Review = model('Review', reviewSchema)

////////////////////////////////////
//// Export our Schema          ////
////////////////////////////////////

 module.exports = reviewSchema
// module.exports = Review
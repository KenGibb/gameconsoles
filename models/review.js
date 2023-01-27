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
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
}, {
    timestamps: true
})

////////////////////////////////////
//// Export our Schema          ////
////////////////////////////////////

module.exports = reviewSchema
// module.exports = Review
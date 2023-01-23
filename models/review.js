const mongoose = require('../utils/')

const { Schema } = mongoose

// comment schema
const reviewSchema = new Schema({
    note: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
})



////////////////////////////////////
//// Export our Schema          ////
////////////////////////////////////

module.exports = reviewSchema
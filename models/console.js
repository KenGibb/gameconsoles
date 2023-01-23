// import dependencies
const mongoose = require('./connection')

const reviewSchema = require('./review')

// destructure the schema and model constructors from mongoose
const { Schema, model } = mongoose

const consoleSchema = new Schema ({
	name: {
		type: String,
	},
	price: {
		type: Number,
	},
	manyExclusives: {
		type: Boolean
	}, 
	owner: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	reviews: [reviewSchema]
}, { timeStamps: true })

const Console = model('Console', consoleSchema)
/////////////////////////////////
// Export our Model
/////////////////////////////////
module.exports = Console

// import dependencies
const mongoose = require('./connection')

const reviewSchema = require('./review')

// destructure the schema and model constructors from mongoose
const { Schema, model } = mongoose

const consoleSchema = new Schema ({
	manufacturer: {
		type: String,
	},
	name: {
		type: String,
	},
	releaseYear: {
		type: Number
	}, 
	ratings: {
		type: String
	},
	owner: {
		type: Schema.Types.ObjectId,
		ref: 'User'
	},
	reviews: [
		reviewSchema
	],
	
}, { timeStamps: true })

const Console = model('Console', consoleSchema)
/////////////////////////////////
// Export our Model
/////////////////////////////////
module.exports = Console

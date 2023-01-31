// import dependencies
const mongoose = require('./connection')

const consoleSchema = require('./console')

// destructure the schema and model constructors from mongoose
const { Schema, model } = mongoose

const favoriteSchema = new Schema ({
	manufacturer: {
		type: String,
	},
	name: {
		type: String,
	},
	releaseYear: {
		type: Number
	}
	
}, { timeStamps: true })

const Favorite = model('Favorite', favoriteSchema)
/////////////////////////////////
// Export our Model
/////////////////////////////////
module.exports = Favorite

// import dependencies
const mongoose = require('./connection')

const User = require('./user')

// destructure the schema and model constructors from mongoose
const { Schema, model } = mongoose

const favoriteSchema = new Schema ({
	manufacturer: {
		type: Schema.Types.ObjectId,
        ref: 'Console',
	},
	name: {
		type: Schema.Types.ObjectId,
        ref: 'Console',
	},
	releaseYear: {
		type: Schema.Types.ObjectId,
        ref: 'Console',
	},
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    }
	
}, { timeStamps: true })

const Favorite = model('Favorite', favoriteSchema)
/////////////////////////////////
// Export our Model
/////////////////////////////////
module.exports = Favorite

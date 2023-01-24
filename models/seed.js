const mongoose = require('../utils/connection')
const Console = require('./console')

/////// Seed Script ////////
const db = mongoose.connection

db.on('open', () => {
    const startConsoles = [
        { manufacturer: 'Microsoft', name: 'Xbox Series X', releaseYear: 2022 },
        { manufacturer: 'Microsoft', name: 'Xbox Series S', releaseYear: 2022 },
        { manufacturer: 'Microsoft', name: 'Xbox One', releaseYear: 2013 },
        { manufacturer: 'Microsoft', name: 'Xbox 360', releaseYear: 2005 },
        { manufacturer: 'Microsoft', name: 'Xbox', releaseYear: 2001 },
        { manufacturer: 'Sony', name: 'Playstation 5', releaseYear: 2022 },
        { manufacturer: 'Sony', name: 'Playstation 4', releaseYear: 2013 },
        { manufacturer: 'Sony', name: 'Playstation 3', releaseYear: 2006 },
        { manufacturer: 'Sony', name: 'Playstation 2', releaseYear: 2000 },
        { manufacturer: 'Sega', name: 'Dreamcast', releaseYear: 1998 },
        { manufacturer: 'Nintendo', name: 'Wii', releaseYear: 2006 },
        { manufacturer: 'Nintendo', name: 'Wii U', releaseYear: 2012 },
        { manufacturer: 'Nintendo', name: 'Switch', releaseYear: 2017},
        { manufacturer: 'Atari Corp', name: 'Atari', releaseYear: 1995},
        { manufacturer: 'Nintendo', name: 'GameCube', releaseYear: 2001},
    ]
    Console.deleteMany({ owner: null })
        .then(() => {
            Console.create(startConsoles)
            .then(data => {
                console.log('Here are the starter consoles: \n', data)
                db.close
            })
            .catch(err => {
                console.log('The following error occurred: \n', err)
                db.close()
            })
        })
        .catch(err => {
            console.log(err)
            db.close
        })
})
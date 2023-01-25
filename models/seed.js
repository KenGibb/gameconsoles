const mongoose = require('../utils/connection')
const Console = require('./console')

/////// Seed Script ////////
const db = mongoose.connection

db.on('open', () => {
    const startConsoles = [
        { manufacturer: 'Microsoft', name: 'Xbox Series X', ratings:' 4.8/5', releaseYear: 2022 },
        { manufacturer: 'Microsoft', name: 'Xbox Series S', ratings:' 4.7/5', releaseYear: 2022 },
        { manufacturer: 'Microsoft', name: 'Xbox One', ratings:' 4.5/5', releaseYear: 2013 },
        { manufacturer: 'Microsoft', name: 'Xbox 360', ratings:' 4.6/5', releaseYear: 2005 },
        { manufacturer: 'Microsoft', name: 'Xbox', ratings:' 4.2/5', releaseYear: 2001 },
        { manufacturer: 'Sony', name: 'Playstation 5', ratings:' 4.7/5', releaseYear: 2022 },
        { manufacturer: 'Sony', name: 'Playstation 4', ratings:' 4.7/5', releaseYear: 2013 },
        { manufacturer: 'Sony', name: 'Playstation 3', ratings:' 4.3/5', releaseYear: 2006 },
        { manufacturer: 'Sony', name: 'Playstation 2', ratings:' 4.5/5', releaseYear: 2000 },
        { manufacturer: 'Sega', name: 'Dreamcast', ratings:' 4.8/5', releaseYear: 1998 },
        { manufacturer: 'Nintendo', name: 'Wii', ratings:' 4.9/5', releaseYear: 2006 },
        { manufacturer: 'Nintendo', name: 'Wii U', ratings:' 4.7/5', releaseYear: 2012 },
        { manufacturer: 'Nintendo', name: 'Switch', ratings:' 4.8/5', releaseYear: 2017},
        { manufacturer: 'Atari Corp', name: 'Atari', ratings:' 4.4/5', releaseYear: 1995},
        { manufacturer: 'Nintendo', name: 'GameCube', ratings:' 4.6/5', releaseYear: 2001},
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
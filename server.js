require('dotenv').config()

require(`./${process.argv[2]}`).execute()

// Required dependencies 
import 'dotenv/config'
import express from 'express'

import mainRouter from './routes'


import mongoDB from './services/db.service'

const app = express();
const port = process.env.PORT;

// app.use(bodyParser.urlencoded({ extended: true }))

app.use(express.static('public'))
// Routes
app.use('/', mainRouter)

mongoDB.initClient()
  .then( db => {
      app.listen(port, () => console.log(`Server is running on port ${port}`))
  })
  .catch( err => console.log(err));

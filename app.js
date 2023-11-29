import express from 'express'
import mongoose from 'mongoose'
import 'dotenv/config'
import cookieParser from 'cookie-parser'
import { userRouter } from './routes/userRouter.js'
import { corsMiddleware } from './middlewares/cors.js'

const app = express()
app.disable('x-powered-by')

const mongoDBURI = process.env.MONGODB_URI
mongoose.connect(mongoDBURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'inmobiliaria'
}).then(() => {
  console.log('Connected to MongoDB')
}).catch(() => {
  console.log('Error connecting to MongoDB')
})

app.use(corsMiddleware())
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))

app.use('/users', userRouter)

const PORT = process.env.PORT ?? 3000

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})

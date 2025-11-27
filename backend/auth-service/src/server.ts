import express from 'express'
import cors from 'cors'
import authRoutes from './routes/authRoutes'
import 'dotenv/config'

const app = express();

app.use(cors())
app.use(express.json())

// prefix: http://localhost:4001/auth/*
app.use('/auth', authRoutes)

app.listen(4001, () => {
  console.log('Auth Service running at http://localhost:4001')
})
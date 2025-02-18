import dotenv from "dotenv"


dotenv.config()

const PORT=process.env.PORT
const ORIGIN=process.env.ORIGIN
const DB_URL=process.env.DB_URL
const JWT_SECRET=process.env.JWT_SECRET

export {DB_URL, JWT_SECRET,PORT,ORIGIN}
import express from 'express'
import CustomerRoutes from './customers.js'
import RoomRoutes from './rooms.js'
const router = express.Router()


router.get('/',(req,res)=>{
    res.status(200).send(`
    <h1 style="text-align:center">Welcome to Backend of Booking App</h1>`)
})

router.use('/customer',CustomerRoutes)
router.use('/room',RoomRoutes) 

export default router
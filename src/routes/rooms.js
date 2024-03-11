import express from 'express'
import BookingController from '../controllers/booking.js';
import RoomController from '../controllers/rooms.js'
const router = express.Router()


router.get('/getallrooms',RoomController.getAllrooms)
router.get('/getroom/:id',RoomController.getRoomById)
router.post('/bookroom/:id',BookingController.bookRoomById)
router.get('/bookedrooms', BookingController.getAllBookedRooms);
router.get('/customerstotalBookings', BookingController.getCustomersWithTotalBookings);
router.get('/customerBookings/:customerId', BookingController.getCustomerBookings);

export default router
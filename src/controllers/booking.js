import bookingModel from "../models/booking.js";
import roomModel from "../models/rooms.js";
import customerModel from "../models/customers.js";
const bookRoomById = async (req, res) => {
  try {
    const roomId = req.params.id;
    const {
      customerId,
      date,
      startTime,
      endTime,
      totalprice,
      totalhours,
      transactionId,
    } = req.body;
    const existingBookings = await bookingModel.find({
      roomId: roomId,
      date: date,
      $or: [
        { startTime: { $lt: endTime }, endTime: { $gt: startTime } },
        { startTime: { $eq: startTime }, endTime: { $eq: endTime } },
      ],
    });
    if (existingBookings.length > 0) {
      return res.status(400).json({ message: `please change the time slot ` });
    }

    const newBooking = new bookingModel({
      roomId,
      customerId,
      date,
      startTime,
      endTime,
      totalprice,
      totalhours,
      transactionId,
    });

    const booking = await newBooking.save();

    const roomtemp = await roomModel.findById(req.params.id);
    roomtemp.currentbookings.push({
      bookingid: booking._id,
      data: date,
      startTime: startTime,
      endTime: endTime,
      customerId: customerId,
      status: booking.status,
    });
    await roomtemp.save();

    return res
      .status(200)
      .json({ message: "Room booked successfully", booking: newBooking });
  } catch (error) {
    console.error("Error booking room by ID:", error);
    return res.status(500).json({ message: "Internal server Error" });
  }
};

const getAllBookedRooms = async (req, res) => {
    try {
      const bookings = await bookingModel.find().select('roomId customerId status date startTime endTime');
  
      const bookingsWithDetails = await Promise.all(bookings.map(async (booking) => {
        const room = await roomModel.findById(booking.roomId).select('number');
        const customer = await customerModel.findById(booking.customerId).select('name');
    
        return {
          roomNumber: room ? room.number : 'Unknown',
          customerName:customer?customer.name:'unknown',
          status: booking.status,
          date: booking.date,
          startTime: booking.startTime,
          endTime: booking.endTime
        };
      }));
  
      return res.status(200).json({ message: "Booked rooms retrieved successfully", bookings: bookingsWithDetails });
    } catch (error) {
      console.error("Error retrieving booked rooms:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
  const getCustomersWithTotalBookings = async (req, res) => {
    try {
      const bookingsByCustomer = await bookingModel.aggregate([
        {
          $group: {
            _id: "$customerId",
            totalBookings: { $sum: 1 },
            bookings: {
              $push: {
                roomId: "$roomId",
                date: "$date",
                startTime: "$startTime",
                endTime: "$endTime"
              }
            }
          }
        }
      ]);
  
      const formattedData = [];
  
      for (const booking of bookingsByCustomer) {
        const customer = await customerModel.findById(booking._id).select("name");
        formattedData.push({
          customerName: customer.name,
          totalBookings: booking.totalBookings,
          bookings: booking.bookings
        });
      }
  
      return res.status(200).json({ message: "Customers with total bookings and booking details retrieved successfully", data: formattedData });
    } catch (error) {
      console.error("Error retrieving customers with total bookings:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
  const getCustomerBookings = async (req, res) => {
    try {
      const customerId = req.params.customerId;
  
      // Find customer by ID
      const customer = await customerModel.findById(customerId);
      if (!customer) {
        return res.status(404).json({ message: 'Customer not found' });
      }
  
      // Find bookings for the customer
      const bookings = await bookingModel.find({ customerId });
  
      // Get booking details with room number
      const bookingDetails = await Promise.all(bookings.map(async booking => {
        const room = await roomModel.findById(booking.roomId);
        return {
          roomNumber: room.number,
          date: booking.date,
          startTime: booking.startTime,
          endTime: booking.endTime
        };
      }));
  
      return res.status(200).json({ customerName: customer.name, totalBookings: bookings.length, bookings: bookingDetails });
    } catch (error) {
      console.error('Error retrieving customer bookings:', error);
      return res.status(500).json({ message: 'Internal Server Error' });
    }
  };


export default { bookRoomById, getAllBookedRooms,getCustomersWithTotalBookings,getCustomerBookings  };

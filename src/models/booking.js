import mongoose from "mongoose";

const bookingSchema =  mongoose.Schema(
  {
    roomId: {type:String,required:true},
    customerId:{type:String,required:true},  
    date: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    totalprice:{type:Number,required:true},
    totalhours:{type:Number,required:true},
    transactionId:{type:String,required:true},
    status:{type:String,required:true,default:"booked"}
  },
  {
    timestamps: true
  }
);

const bookingModel = mongoose.model("bookings", bookingSchema);
export default bookingModel;

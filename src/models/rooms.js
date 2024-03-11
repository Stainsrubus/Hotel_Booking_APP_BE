import mongoose from "./index.js";

const roomSchema = new mongoose.Schema(
  {
    number: { type: String, required: [true, "Number is required"] },
    status: { type: String, required: [true, "status is required"] },
    rentperHour: { type: String, required: [true, "price is required"] },
    amenities: { type: String, required: [true, "Course is required"] },
    currentbookings:[],
    imageurls:[],
  },
  {
    timestamps:true
  },
  {
    collection: "rooms",
    versionKey: false,
  }
);

const roomModel = mongoose.model("rooms", roomSchema);
export default roomModel;

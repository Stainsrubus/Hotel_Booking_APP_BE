import roomModel from '../models/rooms.js'


const getAllrooms = async (req, res) => {
    try {
        const rooms = await roomModel.find({});
        return res.status(200).send({ message: "Rooms retrieved successfully", rooms });
    } catch (error) {
        console.error("Error retrieving rooms:", error);
        return res.status(500).send({ message: "Internal Server Error" });
    }
};
const getRoomById = async (req, res) => {
    try {
        const roomId = req.params.id;
        const room = await roomModel.findById(roomId);

        if (!room) {
            return res.status(404).send({ message: "Room not found" });
        }

        return res.status(200).send({ message: "Room retrieved successfully", room });
    } catch (error) {
        console.error("Error retrieving room by ID:", error);
        return res.status(500).send({ message: "Internal Server Error" });
    }
};


export default {
    getAllrooms,
    getRoomById,
}
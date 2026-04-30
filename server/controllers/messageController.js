import Message from "../models/Message.js";

// forrr sendingggg msg 
export const sendMessage = async (req, res) => {
     try {
          const { receiverId, text } = req.body;

          const message = await Message.create({
               sender: req.user.id,
               receiver: receiverId,
               text
          });

          res.json(message);
     } catch (error) {
          res.status(500).json(error.message);
     }
};

// forrrr history
export const getMessages = async (req, res) => {
     try {
          const { userId } = req.params;

          const messages = await Message.find({
               $or: [
                    { sender: req.user.id, receiver: userId },
                    { sender: userId, receiver: req.user.id }
               ]
          }).sort({ createdAt: 1 });

          res.json(messages);
     } catch (error) {
          res.status(500).json(error.message);
     }
};
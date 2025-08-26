import Message from "../model/Message.js";
import Conversation from "../model/Conversation.js";
export const newMessage = async (req, res) => {
  try {
    const newMessage = new Message(req.body);

    await newMessage.save();
    await Conversation.findByIdAndUpdate(req.body.conversationId, { message: req.body.text });
    return res.status(200).json("Message has been sent succesfully");
  } catch (error) {
    return res.status(500).json(error.message);
  }
};
//backend api for getting messages
export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ conversationId: req.params.id });
    return res.status(200).json(messages);
  } catch (error) {
    return res.status(500).json(error.message);
  }
  //we have created getMessages api and now we we have to call this api from frontend for that we will declare route in route.js and then we have to create function in api.js file for calling the api in frontend.
};

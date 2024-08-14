import mongoose from "mongoose";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

export const sendMessage = async(req, res)=>{

    try {
        const {message} = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;
        console.log("Sender -> ",senderId);
        console.log("Receiver -> ",receiverId);
        let conversation = await Conversation.findOne({
            participants: { $all: [senderId,receiverId]},
        })

        if(!conversation){
            conversation = await Conversation.create({
                participants: [senderId, receiverId],
            });
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            message,
        });

        if(newMessage){
            conversation.messages.push(newMessage._id);
        }
        //SOCKET.IO FUNCTIONALITY WILL GO HERE...

        //await  conversation.save()   if this take 3 second
        //await  newMessage.save()       This has to wait for 3 second 

        //This will run in parallel
        await Promise.all([conversation.save(),newMessage.save()]);

        return res.status(201).json(newMessage); 
    } catch (error) {
        console.log("Error in sendMessage controller", error.message);
        res.status(500).json({error: "Internal server error @ messageController"});
    }
}

export const getMessages = async(req, res)=>{
    try {
        const {id: userToChatId} = req.params;
        const senderId = req.user._id;

        console.log("Sender ID:", senderId.toString()); // Log the string value of senderId
        console.log("User to Chat ID:", userToChatId.toString()); // Log the string value of userToChatId

        const conversation = await Conversation.findOne({
            participants: { 
                $all: [new mongoose.Types.ObjectId(senderId), new mongoose.Types.ObjectId(userToChatId)]
            }
        }).populate("messages");

        console.log("Query result:", conversation);
        // const conversation = await Conversation.findOne({ 
        //     participants: {$all: [senderId, userToChatId]
        //     },
        // }).populate("messages"); //instead of array of messageId it will give message of object of message
        
        if (!conversation) {
            return res.status(404).json({ error: "Conversation not found" });
        }
        res.status(200).json(conversation.messages);
    } catch (error) {
        console.log("Error in getMessage controller", error.message);
        res.status(500).json({error: "Internal server error @ messageController"});
    }
}
import { Request, Response } from "express";
import Conversation, { IConversation } from "../models/Conversation";
import Message from "../models/Message";

/**
 * messageController.js
 *
 * @description :: Server-side logic for managing messages.
 */

/**
 * messageController.addMessage()
 */
export const getConversationMessages = async (req: Request, res: Response) => {
  try {
    const participants: string[] = req.body.participants;
    let dbConversation = await Conversation.findOne({ participants: { $all: participants } });
    if (!dbConversation) {
      const conversation = new Conversation({
        participants: req.body.participants,
      });
      dbConversation = await conversation.save();
      res.status(201).json(dbConversation.id);
    } else {
      const conversationMessages = await Message.find({ conversation: dbConversation.id })
      .populate("sender", "_id firstName lastName");
      const response = {
        conversationMessages,
        conversationId: dbConversation.id,
      };
      res.status(201).json(response);
    }
  } catch (error) {
    res.status(500).json({
      error: error,
      message: "Error when getting conversation messages.",
    });
  }
};

/**
 * messageController.addMessage()
 */
export const addMessage = async (req: Request, res: Response) => {
  const messageObject = req.body.message;
  const conversationId: string = messageObject.conversationId;
  let dbConversation: IConversation | null;
  try {
    dbConversation = await Conversation.findOne({ _id: conversationId });
    if (!dbConversation) { throw new Error("conversation does not exist"); }
    const message = new Message({
      message: messageObject.message,
      sender: req.user.id,
      receivers: messageObject.receiversIds.map((id: string) => ({ receiverId: id, isRead: false })),
      conversation: dbConversation.id,
    });
    await message.save();
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({
      error: error,
      message: "Error when adding message.",
    });
  }
};

/**
 * messageController.addMessage()
 */
export const updateMessageStatusToRead = async (req: Request, res: Response) => {
  const messageId: string = req.params.messageId;
  const receiverId: string = req.params.receiverId;
  try {
    const message = await Message.findOne({ _id: messageId });
    if (!message) { throw new Error("message does not exist"); }
    message.receivers.forEach((receiver) => {
      if (receiver.receiverId === receiverId) {
        receiver.isRead = true;
      }
    });
    await message.save();
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({
      error: error,
      message: "Error when getting updating message status to read.",
    });
  }
};

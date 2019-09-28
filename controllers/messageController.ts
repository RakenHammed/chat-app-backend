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
  let conversationId: string = req.params.id;
  try {
    if (!conversationId) {
      const conversation = new Conversation({
        participants: req.body.participants,
      });
      const dbConversation = await conversation.save();
      conversationId = dbConversation.id;
    }
    const conversationMessages = await Message.find({ conversationId });
    res.status(201).json(conversationMessages);
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
  const conversationId: string = req.body.conversationId;
  let dbConversation: IConversation | null;
  try {
    dbConversation = await Conversation.findOne({ _id: conversationId });
    if (!dbConversation) { throw new Error("conversation does not exist"); }
    const message = new Message({
      message: req.body.message,
      senderId: req.user.id,
      receivers: req.body.receiversIds.map((id: string) => ({ receiverId: id, isRead: false })),
      conversationId: dbConversation.id,
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

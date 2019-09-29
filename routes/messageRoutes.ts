import { Router } from "express";
import * as  messageController from "../controllers/messageController";

export const messageRoutes = Router();

/*
 * Post
 */
messageRoutes.post("/getConversationMessages", messageController.getConversationMessages);

/*
 * POST
 */
messageRoutes.post("/addMessage", messageController.addMessage);

/*
 * PUT
 */
messageRoutes.put("/updateMessageStatusToRead/:messageId/:receiverId", messageController.updateMessageStatusToRead);

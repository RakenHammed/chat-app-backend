import { Router } from "express";
import * as  messageController from "../controllers/messageController";

export const messageRoutes = Router();

/*
 * GET
 */
messageRoutes.get("/getConversationMessages/:id", messageController.getConversationMessages);

/*
 * POST
 */
messageRoutes.post("/addMessage", messageController.addMessage);

/*
 * PUT
 */
messageRoutes.put("/updateMessageStatusToRead/:messageId/:receiverId", messageController.updateMessageStatusToRead);

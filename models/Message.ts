
import mongoose, { Document, Schema } from "mongoose";
import mongooseDelete = require("mongoose-delete");

export interface IMessage extends Document {
  _id: string;
  message: string;
  senderId: string;
  receivers: Array<{
    receiverId: string,
    isRead: boolean,
  }>;
  conversationId: string;
  createdAt: Date;
  deletedAt: Date;
}

const MessageSchema: Schema = new Schema(
  {
    message: {
      type: String,
      maxlength: 140,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    receivers: {
      type: [{
        receiverId: String,
        isRead: Boolean,
      }],
    },
    conversation: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
    },
  },
  {
    timestamps: true,
  },
);

MessageSchema.plugin(mongooseDelete, { deletedBy: true, deletedAt: true });

// Export the model and return your IUser interface
export default mongoose.model<IMessage>("Message", MessageSchema);

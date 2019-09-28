
import mongoose, { Document, Schema } from "mongoose";
import mongooseDelete = require("mongoose-delete");

export interface IConversation extends Document {
  _id: string;
  participants: string[];
  createdAt: Date;
  deletedAt: Date;
}

const ConversationSchema: Schema = new Schema(
  {
    participants: {
      type: [String],
    },
  },
  {
    timestamps: true,
  },
);

ConversationSchema.plugin(mongooseDelete, { deletedBy: true, deletedAt: true });

// Export the model and return your IUser interface
export default mongoose.model<IConversation>("Conversation", ConversationSchema);

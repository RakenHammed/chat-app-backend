
import mongoose, { Document, Schema } from "mongoose";
import mongooseDelete = require("mongoose-delete");

export interface IUser extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  deletedAt: Date;
}

const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const UserSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (email: string) => {
          return emailRegex.test(email);
        },
      },
    },
    password: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

UserSchema.plugin(mongooseDelete, { deletedBy: true, deletedAt: true });

// Export the model and return your IUser interface
export default mongoose.model<IUser>("User", UserSchema);

// models/Post.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export interface IReply {
  text: string;
  timestamp: Date;
  replies: IReply[];
}

export interface IPost extends Document {
  content: string;
  timestamp: Date;
  replies: IReply[];
}

const ReplySchema: Schema = new Schema({
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  replies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Reply" }],
});

const PostSchema: Schema = new Schema({
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  replies: [ReplySchema],
});

export const Post: Model<IPost> =
  mongoose.models.Post || mongoose.model<IPost>("Post", PostSchema);
export const Reply: Model<IReply> =
  mongoose.models.Reply || mongoose.model<IReply>("Reply", ReplySchema);

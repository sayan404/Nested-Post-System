import { type NextRequest, NextResponse } from "next/server";
import { Post } from "@/app/models/postModels";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
  const { postId, parentReplyId, text } = await req.json();

  if (!text || !postId) {
    return NextResponse.json(
      { message: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    const newReply = {
      _id: new mongoose.Types.ObjectId(),
      text,
      timestamp: new Date(),
      replies: [],
    };
    console.log("New Reply:", newReply);

    if (parentReplyId) {
      const post = await Post.findById(postId);
      if (!post) {
        return NextResponse.json(
          { message: "Post not found", success: false },
          { status: 404 }
        );
      }
      const parentReply = post.replies.find((reply) => {
        console.log("Checking reply:", reply);
        return reply._id == parentReplyId;
      });
      console.log("Parent Reply:", parentReply);

      if (parentReply) {
        parentReply.replies.push(newReply);
        await post.save();
        return NextResponse.json(
          { message: "Reply added", success: true },
          { status: 200 }
        );
      }
    } else {
      await Post.findByIdAndUpdate(postId, {
        $push: { replies: newReply },
      });
      return NextResponse.json(
        { message: "Reply added", success: true },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error adding reply:", error);
    return NextResponse.json(
      { message: "Failed to add reply", success: false },
      { status: 500 }
    );
  }
}

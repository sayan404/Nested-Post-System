import { type NextRequest, NextResponse } from "next/server";
import { connectMongoDb } from "@/app/utils/db";
import { Post } from "@/app/models/postModels";
export async function POST(req: NextRequest) {
  try {
    await connectMongoDb();
    const { content, timestamp } = await req.json();
    if (!content) {
      return NextResponse.json({ message: "Wrong inputs" }, { status: 400 });
    }
    const newPost = new Post({
      content,
      replies: [],
      timestamp: timestamp || Date.now(),
    });
    const savedPost = await newPost.save();

    if (savedPost) {
      return NextResponse.json(
        {
          message: "Success",
          savedPost,
        },
        { status: 200 }
      );
    }
    return NextResponse.json(
      {
        message: "Failed",
        insertPost: [],
      },
      { status: 500 }
    );
  } catch (error: any) {
    console.log("error", error);

    return NextResponse.json(
      {
        message: "Failed",
        insertPost: [],
      },
      { status: 500 }
    );
  }
}

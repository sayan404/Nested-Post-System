import { NextResponse } from "next/server";
import { connectMongoDb } from "@/app/utils/db";
import { Post } from "@/app/models/postModels";
export async function GET() {
  try {
    await connectMongoDb();
    const allPosts = await Post.find().sort({ timestamp: -1 });
    console.log("allPosts", allPosts);

    if (allPosts) {
      return NextResponse.json(
        {
          message: "Success",
          allPosts,
        },
        { status: 200 }
      );
    }
    return NextResponse.json(
      { message: "Failed to load Posts" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({}, {});
  }
}

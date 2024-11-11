"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";

interface IReply {
  _id: string;
  text: string;
  timestamp: string;
  replies: IReply[];
}

interface IPost {
  _id: string;
  content: string;
  timestamp: string;
  replies: IReply[];
}

// Nested Reply Component
const ReplyComponent = ({
  reply,
  postId,
}: {
  reply: IReply;
  postId: string;
}) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");

  const handleReplySubmit = async () => {
    if (!replyText) return;

    try {
      await axios.post("/api/insertReplies", {
        postId,
        parentReplyId: reply._id,
        text: replyText,
      });
      setReplyText("");
      setIsReplying(false);
    } catch (error) {
      console.error("Failed to add nested reply:", error);
    }
  };

  return (
    <div className="ml-6 mt-4 border-l pl-4">
      <p className="font-semibold">{reply.text}</p>
      <p className="text-sm text-gray-500">
        Posted on: {reply.timestamp}{" "}
        {new Date(reply.timestamp).toLocaleDateString()}
      </p>

      <button
        onClick={() => setIsReplying(!isReplying)}
        className="text-blue-500 text-sm mt-2"
      >
        Reply
      </button>

      {isReplying && (
        <div className="mt-2">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Enter your reply"
            className="w-full p-2 border rounded-lg"
          />
          <button
            onClick={handleReplySubmit}
            className="mt-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Submit Reply
          </button>
        </div>
      )}

      {reply.replies &&
        reply.replies.map((nestedReply, index) => (
          <ReplyComponent
            key={`${reply._id}-${index}`}
            reply={nestedReply}
            postId={postId}
          />
        ))}
      {/* <ReplyComponent
          key={nestedReply._id}
          reply={nestedReply}
          postId={postId}
        />
      ))} */}
    </div>
  );
};

// Main Post Component
const PostComponent = ({ post }: { post: IPost }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");

  const handleReplySubmit = async () => {
    if (!replyText) return;

    try {
      await axios.post("/api/insertReplies", {
        postId: post._id,
        text: replyText,
      });
      setReplyText("");
      setIsReplying(false);
    } catch (error) {
      console.error("Failed to add reply:", error);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md mb-6">
      <p className="font-bold text-lg">{post.content}</p>
      <p className="text-sm text-gray-500 mb-4">
        Posted on:
        {new Date(post.timestamp).toLocaleDateString()}
      </p>

      <button
        onClick={() => setIsReplying(!isReplying)}
        className="text-blue-500 mb-4"
      >
        Add Reply
      </button>

      {isReplying && (
        <div className="mt-2">
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Enter your reply"
            className="w-full p-2 border rounded-lg"
          />
          <button
            onClick={handleReplySubmit}
            className="mt-1 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Submit Reply
          </button>
        </div>
      )}

      {post.replies.map((reply) => (
        <ReplyComponent key={reply._id} reply={reply} postId={post._id} />
      ))}
    </div>
  );
};

const Posts = () => {
  const [posts, setPosts] = useState<IPost[]>([]);

  useEffect(() => {
    const getAllPosts = async () => {
      try {
        const response = await axios.get("/api/getAllPosts");
        setPosts(response.data.allPosts);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      }
    };

    getAllPosts();
  }, []);

  return (
    <div className="h-screen w-screen  bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 p-6">
      <div className="max-w-3xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">All Posts</h1>
        {posts.length > 0 ? (
          posts.map((post) => <PostComponent key={post._id} post={post} />)
        ) : (
          <p>No posts available</p>
        )}
      </div>
    </div>
  );
};

export default Posts;

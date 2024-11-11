"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Home() {
  const [postData, setPostData] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!postData) {
      setError("Please enter a post");
      return;
    }

    try {
      const data = {
        content: postData,
      };
      const response = await axios.post("/api/createPost", data);
      console.log("Create post response:", response);

      alert("Post created successfully");
      router.push("/posts");
      setPostData("");
      setError("");
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Something went wrong");
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full sm:w-96 p-8 bg-white rounded-lg shadow-lg space-y-6"
      >
        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Create a Post
        </h2>

        <label htmlFor="postContent" className="text-gray-700 font-medium">
          Post Content
        </label>
        <textarea
          id="postContent"
          placeholder="Enter your post content here..."
          className="w-full h-32 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
          value={postData}
          onChange={(e) => setPostData(e.target.value)}
        ></textarea>

        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all"
        >
          Submit
        </button>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      </form>
    </div>
  );
}

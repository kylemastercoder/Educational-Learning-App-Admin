"use server";

import { VideoSchema } from "@/constants/schema";
import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
} from "firebase/firestore";
import { z } from "zod";

export const createVideo = async (values: z.infer<typeof VideoSchema>) => {
  const user = await currentUser();

  if (!user) return { status: 404, message: "Unauthenticated!" };
  const clerkId = user.id;

  const validatedField = VideoSchema.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { status: 400, message: `Validation Error: ${errors.join(", ")}` };
  }

  const { name, description, videoUrl, method, thumbnail } = validatedField.data;

  try {
    const courseRef = doc(collection(db, "Videos"));
    await setDoc(courseRef, {
      name: name,
      description: description,
      videoUrl: videoUrl,
      userId: clerkId,
      method: method,
      thumbnail: thumbnail,
      createdAt: new Date().toISOString(),
    });

    return {
      status: 200,
    };
  } catch (error) {
    return {
      status: 400,
      message: "Oops! something went wrong. Try again",
    };
  }
};

export const getVideos = async () => {
  try {
    const q = query(collection(db, "Videos"));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const videoDocs = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return {
        status: 200,
        videos: videoDocs,
      };
    }

    return {
      status: 404,
      message: "No videos found",
    };
  } catch (error) {
    console.error("Error fetching videos:", error);
    return {
      status: 400,
      message: "Failed to fetch videos",
    };
  }
};

export const deleteVideo = async (videoId: string) => {
  const user = await currentUser();

  if (!user) return { status: 404, message: "Unauthenticated!" };

  if (!videoId) return { status: 400, message: "Video ID is required" };

  try {
    // Reference to the video document
    const videoRef = doc(db, "Videos", videoId);

    // Delete the video document
    await deleteDoc(videoRef);

    return {
      status: 200,
      message: "Videos deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting videos: ", error);
    return {
      status: 400,
      message: "Oops! Something went wrong. Try again",
    };
  }
};

export const updateVideo = async (
  values: z.infer<typeof VideoSchema>,
  videoId: string
) => {
  const user = await currentUser();

  if (!user) return { status: 404, message: "Unauthenticated!" };
  const clerkId = user.id;

  const validatedField = VideoSchema.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { status: 400, message: `Validation Error: ${errors.join(", ")}` };
  }

  const { name, description, videoUrl, method, thumbnail } = validatedField.data;

  try {
    const videoRef = doc(db, "Videos", videoId);
    await setDoc(videoRef, {
      name: name,
      description: description,
      videoUrl: videoUrl,
      userId: clerkId,
      method: method,
      thumbnail: thumbnail,
      updatedAt: new Date().toISOString(),
    });

    return {
      status: 200,
    };
  } catch (error) {
    return {
      status: 400,
      message: "Oops! something went wrong. Try again",
    };
  }
};

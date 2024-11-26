"use server";

import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { collection, getDocs, query } from "firebase/firestore";

export const getInstructors = async () => {
  const user = await currentUser();

  if (!user) return { status: 404, message: "Unauthenticated!" };

  try {
    const q = query(collection(db, "Instructors"));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const instructorDocs = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: data.clerkId,
          image: data.image || "Unknown Image",
          username: data.username || "Unknown Name",
        };
      });

      instructorDocs.sort((a, b) => a.username.localeCompare(b.username));

      return {
        status: 200,
        instructors: instructorDocs,
      };
    }

    return {
      status: 404,
      message: "No instructors found",
    };
  } catch (error) {
    console.error("Error fetching instructors:", error);
    return {
      status: 400,
      message: "Failed to fetch instructors",
    };
  }
};

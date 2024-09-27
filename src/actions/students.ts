"use server";

import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { collection, getDocs, query } from "firebase/firestore";

export const getStudents = async () => {
  const user = await currentUser();

  if (!user) return { status: 404, message: "Unauthenticated!" };

  try {
    const q = query(collection(db, "Users"));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const studentDocs = querySnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: data.clerkId,
          name: data.name || "Unknown Name",
          email: data.email || "Unknown Email",
          profile: data.profile || "",
          age: data.age || "Unknown Age",
          birthdate: data.birthdate || "Unknown Birthdate",
          course: data.course || "Unknown Course",
          block: data.block || "Unknown Block",
          gender: data.gender || "Unknown Gender",
          studentNumber: data.studentNo || "Unknown Student Number",
          username: data.username || "Unknown Username",
        };
      });

      return {
        status: 200,
        students: studentDocs,
      };
    }


    return {
      status: 404,
      message: "No students found",
    };
  } catch (error) {
    console.error("Error fetching students:", error);
    return {
      status: 400,
      message: "Failed to fetch students",
    };
  }
};

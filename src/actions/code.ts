"use server";

import { CodeSchema } from "@/constants/schema";
import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { z } from "zod";

export const createCode = async (values: z.infer<typeof CodeSchema>) => {
  const user = await currentUser();

  if (!user) return { status: 404, message: "Unauthenticated!" };
  const clerkId = user.id;

  const validatedField = CodeSchema.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { status: 400, message: `Validation Error: ${errors.join(", ")}` };
  }

  const { title, description, correctOutput, imageUrl } = validatedField.data;

  try {
    const courseRef = doc(collection(db, "CodeChallenges"));
    await setDoc(courseRef, {
      title: title,
      description: description,
      correctOutput: correctOutput,
      userId: clerkId,
      isArchive: false,
      thumbnail: imageUrl,
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

export const getCodes = async () => {
  const user = await currentUser();

  if (!user) return { status: 404, message: "Unauthenticated!" };

  try {
    const q = query(
      collection(db, "CodeChallenges"),
      where("isArchive", "==", false)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const codeDocs = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return {
        status: 200,
        codes: codeDocs,
      };
    }

    return {
      status: 404,
      message: "No code challenges found",
    };
  } catch (error) {
    console.error("Error fetching code challenges:", error);
    return {
      status: 400,
      message: "Failed to fetch code challenges",
    };
  }
};

export const getArchivedCode = async () => {
  try {
    // Modify the query to include the where clause to filter by isArchive
    const quizQuery = query(
      collection(db, "CodeChallenges"),
      where("isArchive", "==", true)
    );
    const quizSnapshot = await getDocs(quizQuery);

    if (!quizSnapshot.empty) {
      const quizDocs = await Promise.all(
        quizSnapshot.docs.map(async (doc) => {
          const quizData = doc.data();
          return {
            id: doc.id,
            ...quizData,
          };
        })
      );

      return {
        status: 200,
        codes: quizDocs,
      };
    }

    return {
      status: 404,
      message: "No code challenges found",
    };
  } catch (error) {
    console.error("Error fetching code challenges:", error);
    return {
      status: 400,
      message: "Failed to fetch code challenges",
    };
  }
};

export const deleteCode = async (codeId: string) => {
  const user = await currentUser();

  if (!user) return { status: 404, message: "Unauthenticated!" };

  if (!codeId) return { status: 400, message: "Code ID is required" };

  try {
    // Reference to the code document
    const codeRef = doc(db, "CodeChallenges", codeId);

    // Delete the code document
    await deleteDoc(codeRef);

    return {
      status: 200,
      message: "Code challenge deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting code challenge: ", error);
    return {
      status: 400,
      message: "Oops! Something went wrong. Try again",
    };
  }
};

export const updateCode = async (
  values: z.infer<typeof CodeSchema>,
  codeId: string
) => {
  const user = await currentUser();

  if (!user) return { status: 404, message: "Unauthenticated!" };
  const clerkId = user.id;

  const validatedField = CodeSchema.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { status: 400, message: `Validation Error: ${errors.join(", ")}` };
  }

  const { title, description, correctOutput, imageUrl } = validatedField.data;

  try {
    const courseRef = doc(db, "CodeChallenges", codeId);
    await setDoc(courseRef, {
      title: title,
      description: description,
      correctOutput: correctOutput,
      userId: clerkId,
      thumbnail: imageUrl,
      isArchive: false,
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

export const archiveCode = async (codeId: string) => {
  const user = await currentUser();

  if (!user) return { status: 404, message: "Unauthenticated!" };

  if (!codeId) return { status: 400, message: "Code ID is required" };

  try {
    // Reference to the course document
    const courseRef = doc(db, "CodeChallenges", codeId);

    await updateDoc(courseRef, {
      isArchive: true,
    });

    return {
      status: 200,
      message: "Code archived successfully",
    };
  } catch (error) {
    console.error("Error archiving code: ", error);
    return {
      status: 400,
      message: "Oops! Something went wrong. Try again",
    };
  }
};

export const retrieveCode = async (codeId: string) => {
  const user = await currentUser();

  if (!user) return { status: 404, message: "Unauthenticated!" };

  if (!codeId) return { status: 400, message: "Code ID is required" };

  try {
    // Reference to the Quiz document
    const quizRef = doc(db, "CodeChallenges", codeId);

    await updateDoc(quizRef, {
      isArchive: false,
    });

    return {
      status: 200,
      message: "Code retrieved successfully",
    };
  } catch (error) {
    console.error("Error retrieving code: ", error);
    return {
      status: 400,
      message: "Oops! Something went wrong. Try again",
    };
  }
};

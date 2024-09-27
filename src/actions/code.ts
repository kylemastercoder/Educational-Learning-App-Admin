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

  const { title, description, correctOutput } = validatedField.data;

  try {
    const courseRef = doc(collection(db, "CodeChallenges"));
    await setDoc(courseRef, {
      title: title,
      description: description,
      correctOutput: correctOutput,
      userId: clerkId,
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
    const q = query(collection(db, "CodeChallenges"));
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

  const { title, description, correctOutput } = validatedField.data;

  try {
    const courseRef = doc(db, "CodeChallenges", codeId);
    await setDoc(courseRef, {
      title: title,
      description: description,
      correctOutput: correctOutput,
      userId: clerkId,
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

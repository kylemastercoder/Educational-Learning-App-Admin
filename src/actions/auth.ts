/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";

export const onAuthenticatedUser = async () => {
  try {
    const clerk = await currentUser();
    if (!clerk) return { status: 404 };
    const clerkId = clerk.id;
    const q = query(
      collection(db, "Instructors"),
      where("clerkId", "==", clerkId)
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const userDocs = querySnapshot.docs.map((doc) => doc.data());
      return {
        status: 200,
        id: userDocs[0].id,
        clerkId: userDocs[0].clerkId,
        image: userDocs[0].image,
        username: userDocs[0].username,
        isAdmin: userDocs[0].isAdmin,
      };
    }

    return {
      status: 404,
    };
  } catch (error) {
    return {
      status: 400,
    };
  }
};

export const onSignUpUser = async (data: {
  firstname: string;
  lastname: string;
  image: string;
  clerkId: string;
}) => {
  try {
    const userRef = doc(db, "Instructors", data.clerkId);
    await setDoc(userRef, {
      username: `${data.firstname} ${data.lastname}`,
      image: data.image,
      clerkId: data.clerkId,
      isAdmin: false,
    });

    return {
      status: 200,
      message: "User successfully created",
      id: data.clerkId,
    };
  } catch (error) {
    return {
      status: 400,
      message: "Oops! something went wrong. Try again",
    };
  }
};

export const onSignInUser = async (clerkId: string) => {
  try {
    // Reference the user document in Firestore
    const userRef = doc(db, "Instructors", clerkId);

    // Fetch the user document
    const userSnapshot = await getDoc(userRef);

    // Check if the user document exists
    if (userSnapshot.exists()) {
      // Return the user data if found
      const userData = userSnapshot.data();
      return {
        status: 200,
        message: "User successfully signed in",
        user: userData,
      };
    } else {
      // Handle case where the user is not found
      return {
        status: 404,
        message: "User not found",
      };
    }
  } catch (error: any) {
    // Catch and handle any errors
    return {
      status: 500,
      message: "Oops! Something went wrong. Try again",
      error: error.message,
    };
  }
};

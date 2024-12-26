"use server";

import { currentUser } from "@clerk/nextjs/server";
import { collection, doc, setDoc } from "firebase/firestore";
import { db } from "../lib/db";

export const createAccessSettings = async (
  title: string,
  subTitle: string,
  content: string
) => {
  const user = await currentUser();

  if (!user) return { status: 404, message: "Unauthenticated!" };

  try {
    const settingsRef = doc(collection(db, "Settings"));
    await setDoc(settingsRef, {
      title: title,
      subTitle: subTitle,
      content: content,
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

export const updateAccessSettings = async (
  settingsId: string,
  title: string,
  subTitle: string,
  content: string
) => {
  const user = await currentUser();

  if (!user) return { status: 404, message: "Unauthenticated!" };

  try {
    const settingsRef = doc(db, "Settings", settingsId);
    await setDoc(
      settingsRef,
      {
        title: title,
        subTitle: subTitle,
        content: content,
        updatedAt: new Date().toISOString(),
      },
      { merge: true }
    );

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

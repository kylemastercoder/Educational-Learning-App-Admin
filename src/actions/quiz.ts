"use server";

import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { collection, deleteDoc, doc, getDocs, query, setDoc } from "firebase/firestore";

interface Question {
  question: string;
  correctAnswer: string;
  answers: string;
}

interface QuizValues {
  howManyQuiz: string;
  type: string;
  difficulties: string;
  questions: Question[];
}

export const createQuiz = async (values: QuizValues) => {
  const user = await currentUser();

  if (!user) return { status: 404, message: "Unauthenticated!" };
  const clerkId = user.id;

  try {
    const quizRef = doc(collection(db, "Quizzes"));
    await setDoc(quizRef, {
      userId: clerkId,
      howManyQuiz: values.howManyQuiz,
      difficulties: values.difficulties,
      type: values.type,
      questions: values.questions,
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

export const getQuizzes = async () => {
  const user = await currentUser();

  if (!user) return { status: 404, message: "Unauthenticated!" };

  try {
    const q = query(collection(db, "Quizzes"));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const quizzesDocs = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return {
        status: 200,
        quizzes: quizzesDocs,
      };
    }

    return {
      status: 404,
      message: "No quizzes found",
    };
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    return {
      status: 400,
      message: "Failed to fetch quizzes",
    };
  }
};

export const deleteQuiz = async (quizId: string) => {
  const user = await currentUser();

  if (!user) return { status: 404, message: "Unauthenticated!" };

  if (!quizId) return { status: 400, message: "Quiz ID is required" };

  try {
    // Reference to the quiz document
    const quizRef = doc(db, "Quizzes", quizId);

    // Delete the quiz document
    await deleteDoc(quizRef);

    return {
      status: 200,
      message: "Quiz deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting quiz: ", error);
    return {
      status: 400,
      message: "Oops! Something went wrong. Try again",
    };
  }
};

export const updateQuiz = async (
  values: QuizValues,
  quizId: string
) => {
  const user = await currentUser();

  if (!user) return { status: 404, message: "Unauthenticated!" };
  const clerkId = user.id;

  try {
    const quizRef = doc(db, "Quizzes", quizId);
    await setDoc(quizRef, {
      userId: clerkId,
      howManyQuiz: values.howManyQuiz,
      difficulties: values.difficulties,
      type: values.type,
      questions: values.questions,
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

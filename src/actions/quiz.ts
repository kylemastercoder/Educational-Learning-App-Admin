"use server";

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

interface Question {
  question: string;
  correctAnswer: string;
  answers: string;
}

interface QuizValues {
  quizTitle: string;
  module: string;
  instruction: string;
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
      quizTitle: values.quizTitle,
      instruction: values.instruction,
      courseId: values.module,
      howManyQuiz: values.howManyQuiz,
      difficulties: values.difficulties,
      type: values.type,
      questions: values.questions,
      isArchive: false,
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
    const quizQuery = query(
      collection(db, "Quizzes"),
      where("isArchive", "==", false)
    );
    const querySnapshot = await getDocs(quizQuery);

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

export const getArchivedQuizzes = async () => {
  try {
    // Modify the query to include the where clause to filter by isArchive
    const quizQuery = query(
      collection(db, "Quizzes"),
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
        quizzes: quizDocs,
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

export const updateQuiz = async (values: QuizValues, quizId: string) => {
  const user = await currentUser();

  if (!user) return { status: 404, message: "Unauthenticated!" };
  const clerkId = user.id;

  try {
    const quizRef = doc(db, "Quizzes", quizId);
    await setDoc(quizRef, {
      userId: clerkId,
      quizTitle: values.quizTitle,
      instruction: values.instruction,
      courseId: values.module,
      howManyQuiz: values.howManyQuiz,
      difficulties: values.difficulties,
      type: values.type,
      questions: values.questions,
      isArchive: false,
      updatedAt: new Date().toISOString(),
    });

    // After updating the quiz, refetch the quizzes to ensure UI is updated
    await getQuizzes();

    return {
      status: 200,
    };
  } catch (error) {
    console.error("Error updating quiz:", error); // Debugging: Log error
    return {
      status: 400,
      message: "Oops! something went wrong. Try again",
    };
  }
};

export const archiveQuiz = async (quizId: string) => {
  const user = await currentUser();

  if (!user) return { status: 404, message: "Unauthenticated!" };

  if (!quizId) return { status: 400, message: "Quiz ID is required" };

  try {
    // Reference to the course document
    const courseRef = doc(db, "Quizzes", quizId);

    await updateDoc(courseRef, {
      isArchive: true,
    });

    return {
      status: 200,
      message: "Course archived successfully",
    };
  } catch (error) {
    console.error("Error archiving course: ", error);
    return {
      status: 400,
      message: "Oops! Something went wrong. Try again",
    };
  }
};

export const retrieveQuiz = async (quizId: string) => {
  const user = await currentUser();

  if (!user) return { status: 404, message: "Unauthenticated!" };

  if (!quizId) return { status: 400, message: "Quiz ID is required" };

  try {
    // Reference to the Quiz document
    const quizRef = doc(db, "Quizzes", quizId);

    await updateDoc(quizRef, {
      isArchive: false,
    });

    return {
      status: 200,
      message: "Quiz retrieved successfully",
    };
  } catch (error) {
    console.error("Error retrieving quiz: ", error);
    return {
      status: 400,
      message: "Oops! Something went wrong. Try again",
    };
  }
};

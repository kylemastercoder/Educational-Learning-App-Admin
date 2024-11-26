"use server";

import { UpdateStudentSchema } from "@/constants/schema";
import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
} from "firebase/firestore";
import { z } from "zod";

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
          status: data.status || "Unknown Status",
        };
      });

      studentDocs.sort((a, b) => a.name.localeCompare(b.name));

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

export const getStudentsWithQuizScore = async () => {
  const user = await currentUser();

  if (!user) return { status: 404, message: "Unauthenticated!" };

  try {
    // Fetch students from the "Users" collection
    const studentsQuery = query(collection(db, "Users"));
    const studentsSnapshot = await getDocs(studentsQuery);

    if (!studentsSnapshot.empty) {
      const students = studentsSnapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: data.clerkId,
          name: data.name || "Unknown Name",
          email: data.email || "Unknown Email",
          profile: data.profile || "",
          studentNumber: data.studentNo || "Unknown Student Number",
        };
      });

      // Fetch quiz scores from the "QuizScore" collection
      const quizScoresQuery = query(collection(db, "QuizScore"));
      const quizScoresSnapshot = await getDocs(quizScoresQuery);

      if (!quizScoresSnapshot.empty) {
        const quizScores = quizScoresSnapshot.docs.map((doc) => {
          const data = doc.data();
          console.log("QuizScore Document:", data); // Log quiz scores for debugging
          return {
            studentId: data.userId, // Assuming `studentId` links quiz score to student
            quizId: data.quizId,
            quizScore: `${data.score}/${data.howManyQuiz}`, // Format the score as "score/total"
          };
        });

        // Combine students with their quiz scores
        const studentsWithScores = students.map((student) => {
          // Get the quiz scores for this student
          const studentQuizScores = quizScores.filter(
            (quiz) => quiz.studentId === student.id
          );

          // Log student quiz scores for debugging
          console.log(`Quiz Scores for ${student.name}:`, studentQuizScores);

          // Organize quiz scores by quizId for each student
          const quizScoresByQuizId = studentQuizScores.reduce(
            (acc: { [key: string]: string }, quiz) => {
              acc[quiz.quizId] = quiz.quizScore; // Map each quizId to its score
              return acc;
            },
            {}
          );

          return {
            ...student,
            quizScores: quizScoresByQuizId, // Store the quiz scores mapped by quizId
          };
        });

        return {
          status: 200,
          students: studentsWithScores,
        };
      } else {
        return {
          status: 404,
          message: "No quiz scores found",
        };
      }
    } else {
      return {
        status: 404,
        message: "No students found",
      };
    }
  } catch (error) {
    console.error("Error fetching students with quiz scores:", error);
    return {
      status: 400,
      message: "Failed to fetch students with quiz scores",
    };
  }
};

export const getStudentById = async (studentId: string) => {
  const user = await currentUser();

  if (!user) return { status: 404, message: "Unauthenticated!" };

  try {
    // Reference to the student's document by their ID
    const studentRef = doc(db, "Users", studentId);
    const studentDoc = await getDoc(studentRef);

    // Check if the student document exists
    if (studentDoc.exists()) {
      const data = studentDoc.data();
      const student = {
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
        status: data.status || "Unknown Status",
      };

      return {
        status: 200,
        student,
      };
    } else {
      return {
        status: 404,
        message: "Student not found",
      };
    }
  } catch (error) {
    console.error("Error fetching student:", error);
    return {
      status: 400,
      message: "Failed to fetch student",
    };
  }
};

export const deleteStudents = async (studentId: string) => {
  try {
    // Reference to the student's document by their ID
    const studentRef = doc(db, "Users", studentId);

    // Delete the document
    await deleteDoc(studentRef);

    return { status: 200, message: "Student deleted successfully" };
  } catch (error) {
    console.error("Error deleting student:", error);
    return { status: 400, message: "Failed to delete student" };
  }
};

export const updateStudent = async (
  values: z.infer<typeof UpdateStudentSchema>,
  studentId: string
) => {
  const user = await currentUser();

  if (!user) return { status: 404, message: "Unauthenticated!" };

  const validatedField = UpdateStudentSchema.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { status: 400, message: `Validation Error: ${errors.join(", ")}` };
  }

  const { name, email, gender, username, birthdate, course, age, status } =
    validatedField.data;

  try {
    const studentRef = doc(db, "Users", studentId);
    await updateDoc(studentRef, {
      name: name,
      email: email,
      age: age,
      birthdate: birthdate,
      username: username,
      course: course,
      gender: gender,
      status: status,
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

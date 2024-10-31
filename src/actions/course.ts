"use server";

import { CourseSchema, ModuleSchema } from "@/constants/schema";
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

export const createCourse = async (values: z.infer<typeof CourseSchema>) => {
  const user = await currentUser();

  if (!user) return { status: 404, message: "Unauthenticated!" };
  const clerkId = user.id;

  const validatedField = CourseSchema.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { status: 400, message: `Validation Error: ${errors.join(", ")}` };
  }

  const { name, description, imageUrl } = validatedField.data;

  try {
    const courseRef = doc(collection(db, "Courses"));
    await setDoc(courseRef, {
      name: name,
      description: description,
      imageUrl: imageUrl,
      userId: clerkId,
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

export const getCourses = async () => {
  try {
    // Modify the query to include the where clause to filter by isArchive
    const courseQuery = query(
      collection(db, "Courses"),
      where("isArchive", "==", false)
    );
    const courseSnapshot = await getDocs(courseQuery);

    if (!courseSnapshot.empty) {
      const courseDocs = await Promise.all(
        courseSnapshot.docs.map(async (doc) => {
          const courseData = doc.data();
          const modulesResponse = await getModules(doc.id);

          // Add the module count to each course
          return {
            id: doc.id,
            ...courseData,
            moduleCount:
              modulesResponse.status === 200
                ? modulesResponse.modules?.length ?? 0
                : 0,
          };
        })
      );

      return {
        status: 200,
        courses: courseDocs,
      };
    }

    return {
      status: 404,
      message: "No courses found",
    };
  } catch (error) {
    console.error("Error fetching courses:", error);
    return {
      status: 400,
      message: "Failed to fetch courses",
    };
  }
};

export const getArchivedCourses = async () => {
  try {
    // Modify the query to include the where clause to filter by isArchive
    const courseQuery = query(
      collection(db, "Courses"),
      where("isArchive", "==", true)
    );
    const courseSnapshot = await getDocs(courseQuery);

    if (!courseSnapshot.empty) {
      const courseDocs = await Promise.all(
        courseSnapshot.docs.map(async (doc) => {
          const courseData = doc.data();
          const modulesResponse = await getModules(doc.id);

          // Add the module count to each course
          return {
            id: doc.id,
            ...courseData,
            moduleCount:
              modulesResponse.status === 200
                ? modulesResponse.modules?.length ?? 0
                : 0,
          };
        })
      );

      return {
        status: 200,
        courses: courseDocs,
      };
    }

    return {
      status: 404,
      message: "No courses found",
    };
  } catch (error) {
    console.error("Error fetching courses:", error);
    return {
      status: 400,
      message: "Failed to fetch courses",
    };
  }
};

export const createModule = async (
  values: z.infer<typeof ModuleSchema>,
  courseId: string
) => {
  const user = await currentUser();

  if (!user) return { status: 404, message: "Unauthenticated!" };
  const clerkId = user.id;

  const validatedField = ModuleSchema.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { status: 400, message: `Validation Error: ${errors.join(", ")}` };
  }

  const { name, number, content, imagesUrl } = validatedField.data;

  try {
    const moduleRef = doc(collection(db, "Modules"));
    await setDoc(moduleRef, {
      moduleNumber: number,
      name: name,
      content: content,
      userId: clerkId,
      courseId: courseId,
      imagesUrl: imagesUrl,
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

export const updateModule = async (
  values: z.infer<typeof ModuleSchema>,
  courseId: string,
  moduleId: string
) => {
  const user = await currentUser();

  if (!user) return { status: 404, message: "Unauthenticated!" };
  const clerkId = user.id;

  const validatedField = ModuleSchema.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { status: 400, message: `Validation Error: ${errors.join(", ")}` };
  }

  const { name, number, content, imagesUrl } = validatedField.data;

  try {
    const moduleRef = doc(db, "Modules", moduleId);
    await updateDoc(moduleRef, {
      moduleNumber: number,
      name: name,
      content: content,
      userId: clerkId,
      courseId: courseId,
      imagesUrl: imagesUrl,
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

export const deleteModule = async (moduleId: string) => {
  const user = await currentUser();

  if (!user) return { status: 404, message: "Unauthenticated!" };

  if (!moduleId) return { status: 400, message: "Module ID is required" };

  try {
    const moduleRef = doc(db, "Modules", moduleId);

    await deleteDoc(moduleRef);

    return {
      status: 200,
      message: "Module deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting module: ", error);
    return {
      status: 400,
      message: "Oops! Something went wrong. Try again",
    };
  }
};

export const getModules = async (courseId: string) => {
  try {
    const q = query(
      collection(db, "Modules"),
      where("courseId", "==", courseId)
    );
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const moduleDocs = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      return {
        status: 200,
        modules: moduleDocs,
      };
    }

    return {
      status: 404,
      message: "No modules found",
    };
  } catch (error) {
    console.error("Error fetching modules:", error);
    return {
      status: 400,
      message: "Failed to fetch modules",
    };
  }
};

export const deleteCourse = async (courseId: string) => {
  const user = await currentUser();

  if (!user) return { status: 404, message: "Unauthenticated!" };

  if (!courseId) return { status: 400, message: "Course ID is required" };

  try {
    // Reference to the course document
    const courseRef = doc(db, "Courses", courseId);

    // Delete the course document
    await deleteDoc(courseRef);

    return {
      status: 200,
      message: "Course deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting course: ", error);
    return {
      status: 400,
      message: "Oops! Something went wrong. Try again",
    };
  }
};

export const archiveCourse = async (courseId: string) => {
  const user = await currentUser();

  if (!user) return { status: 404, message: "Unauthenticated!" };

  if (!courseId) return { status: 400, message: "Course ID is required" };

  try {
    // Reference to the course document
    const courseRef = doc(db, "Courses", courseId);

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

export const retrieveCourse = async (courseId: string) => {
  const user = await currentUser();

  if (!user) return { status: 404, message: "Unauthenticated!" };

  if (!courseId) return { status: 400, message: "Course ID is required" };

  try {
    // Reference to the course document
    const courseRef = doc(db, "Courses", courseId);

    await updateDoc(courseRef, {
      isArchive: false,
    });

    return {
      status: 200,
      message: "Course retrieved successfully",
    };
  } catch (error) {
    console.error("Error retrieving course: ", error);
    return {
      status: 400,
      message: "Oops! Something went wrong. Try again",
    };
  }
};

export const updateCourse = async (
  values: z.infer<typeof CourseSchema>,
  courseId: string
) => {
  const user = await currentUser();

  if (!user) return { status: 404, message: "Unauthenticated!" };
  const clerkId = user.id;

  const validatedField = CourseSchema.safeParse(values);

  if (!validatedField.success) {
    const errors = validatedField.error.errors.map((err) => err.message);
    return { status: 400, message: `Validation Error: ${errors.join(", ")}` };
  }

  const { name, description, imageUrl } = validatedField.data;

  try {
    const courseRef = doc(db, "Courses", courseId);
    await setDoc(courseRef, {
      name: name,
      description: description,
      imageUrl: imageUrl,
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

export const getViewedCourses = async (studentId: string) => {
  try {
    const courseQuery = query(
      collection(db, "ViewedCourse"),
      where("userId", "array-contains", studentId)
    );
    const courseSnapshot = await getDocs(courseQuery);

    if (courseSnapshot.empty) {
      return {
        status: 404,
        message: "No courses found",
      };
    }

    const viewedCourses = courseSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return {
      status: 200,
      viewedCourses,
    };
  } catch (error) {
    console.error("Error fetching courses:", error);
    return {
      status: 400,
      message: "Failed to fetch courses",
    };
  }
};

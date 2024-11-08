"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type StudentWithQuizScore = {
  id: string;
  name: string;
  email: string;
  profile: string;
  studentNumber: string;
  quizScores: Record<string, string>;
};

const QuizClient: React.FC<{ data: StudentWithQuizScore[] }> = ({ data }) => {
  // Collect unique quiz IDs from all students
  const quizIds = Array.from(
    new Set(data.flatMap((student) => Object.keys(student.quizScores)))
  );

  // Log quizIds to make sure they are correct
  console.log("Quiz IDs:", quizIds);

  return (
    <div className="container">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student Number</TableHead>
            <TableHead>Student</TableHead>
            {quizIds.map((_, index) => (
              <TableHead key={index}>Quiz {index + 1}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((student) => (
            <TableRow key={student.id}>
              <TableCell>{student.studentNumber}</TableCell>
              <TableCell>{student.name}</TableCell>
              {quizIds.map((_, index) => (
                <TableCell key={index}>
                  {student.quizScores[quizIds[index]] || "0/0"} {/* Use quizId from quizIds array */}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default QuizClient;

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import QuizClient from "./client";
import React from "react";
import { getStudentsWithQuizScore } from "@/actions/students";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

type QuizModalProps = {
  title: string;
  description: string;
  className?: string;
  isOpen: boolean;
  onClose: () => void;
};

type StudentWithQuizScore = {
  id: string;
  name: string;
  email: string;
  profile: string;
  studentNumber: string;
  quizScores: Record<string, string>;
};

export const QuizModal = ({
  title,
  description,
  className,
  isOpen,
  onClose,
}: QuizModalProps) => {
  const [loading, setLoading] = React.useState(true);
  const [studentWithQuizScore, setStudentWithQuizScore] = React.useState<
    StudentWithQuizScore[]
  >([]);
  React.useEffect(() => {
    const fetchStudentsWithScore = async () => {
      setLoading(true);
      const { status, students, message } = await getStudentsWithQuizScore();
      if (status === 200) {
        if (students) {
          const formattedStudents = students.map((student) => {
            const quizScores = Object.keys(student.quizScores);
            console.log("Quiz Scores for student:", student.name, quizScores); // Log quiz scores

            const formattedQuizScores = quizScores.reduce((acc, quizId) => {
              const [score, total] = student.quizScores[quizId].split("/");
              acc[quizId] = `${score}/${total}`; // Map to the expected format
              return acc;
            }, {} as Record<string, string>);

            return {
              id: student.id,
              name: student.name,
              studentNumber: student.studentNumber,
              email: student.email,
              profile: student.profile,
              quizScores: formattedQuizScores, // Store quiz scores mapped by quizId
            };
          });

          // Sort formattedStudents by name in ascending order
          const sortedStudents = formattedStudents.sort((a, b) =>
            a.name.localeCompare(b.name)
          );

          setStudentWithQuizScore(sortedStudents); // Set the sorted students
        }
      } else {
        toast.error(message || "Failed to load data.");
      }
      setLoading(false);
    };

    fetchStudentsWithScore();
  }, []);
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={cn(
          "bg-clip-padding backdrop-filter backdrop--blur__safari backdrop-blur-3xl max-w-7xl mx-auto bg-opacity-20 bg-themeGray max-h-[80vh] overflow-y-auto border-themeGray",
          className
        )}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {loading && (
          <div className="flex justify-center items-center h-20">
            <Loader2 className="w-10 h-10 animate-spin" />
          </div>
        )}
        <QuizClient
          data={studentWithQuizScore.map((student) => ({
            id: student.id,
            name: student.name,
            email: student.email,
            profile: student.profile,
            studentNumber: student.studentNumber,
            quizScores: student.quizScores,
          }))}
        />
      </DialogContent>
    </Dialog>
  );
};

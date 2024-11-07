/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Card } from "@/components/ui/card";
import { Loader2, Edit, EllipsisVertical, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { deleteQuiz, getQuizzes } from "@/actions/quiz";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Modal } from "@/components/ui/modal";
import CreateQuiz from "@/components/forms/add-quiz";
import AlertModal from "@/components/ui/alert-modal";

const QuizList = () => {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<any>(null);
  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoading(true);
      const { status, quizzes, message } = await getQuizzes();
      if (status === 200) {
        if (quizzes) {
          setQuizzes(quizzes);
        }
      } else {
        toast.error(message || "Failed to load quizzes.");
      }
      setLoading(false);
    };

    fetchQuizzes();
  }, []);

  if (loading)
    return (
      <div className="flex items-center m-auto mt-20">
        <Loader2 size={50} className="animate-spin" />
      </div>
    );

  if (editModal) {
    return (
      <Modal
        isOpen={editModal}
        onClose={() => setEditModal(false)}
        title="Update Quizzes"
        description="Update your quizzes for your community"
      >
        <CreateQuiz initialData={selectedQuiz} />
      </Modal>
    );
  }

  const onDelete = async () => {
    setLoading(true);
    try {
      const response = await deleteQuiz(selectedQuiz.id);
      if (response.status === 200) {
        setDeleteModal(false);
        toast.success("Quiz deleted successfully");
        window.location.reload();
      } else {
        toast.error(response.message || "Failed to delete quiz");
      }
    } catch (error) {
      console.error("Error deleting quiz:", error);
      toast.error("Failed to delete quiz");
    } finally {
      setLoading(false);
    }
  };

  const generateRandomColor = () => {
    const colors = [
      "bg-green-700",
      "bg-red-700",
      "bg-blue-700",
      "bg-pink-700",
      "bg-yellow-700",
      "bg-amber-700",
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  return quizzes.map((quiz) => (
    <>
      <AlertModal
        isOpen={deleteModal}
        loading={loading}
        onClose={() => setDeleteModal(false)}
        onConfirm={onDelete}
      />
      <div key={quiz.id}>
        <Card className="bg-transparent border-themeGray h-full rounded-xl overflow-hidden">
          {/* Video Player */}
          <div className={`h-[300px] w-[600px] ${generateRandomColor()}`}>
           
          </div>
          <div className="flex flex-col justify-center px-5 mt-3">
            <div className="flex justify-between items-center">
              <h2 className="text-lg text-white font-semibold">
                {quiz.howManyQuiz} Questions
              </h2>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <EllipsisVertical className="w-4 h-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedQuiz(quiz); // Set the selected quiz data
                      setEditModal(true);
                    }}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedQuiz(quiz); // Set the selected quiz data
                      setDeleteModal(true);
                    }}
                  >
                    <Trash className="w-4 h-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <p className="text-sm text-themeTextGray">
              {quiz.type === "multipleChoice"
                ? "Multiple Choice"
                : "True or False"}
            </p>
          </div>
          <Badge
            className="mt-2 ml-5"
            variant={
              quiz.difficulties === "beginner"
                ? "default"
                : quiz.difficulties === "intermediate"
                ? "secondary"
                : "destructive"
            }
          >
            {quiz.difficulties === "beginner"
              ? "Beginner"
              : quiz.difficulties === "intermediate"
              ? "Intermediate"
              : "Advanced"}
          </Badge>
        </Card>
      </div>
    </>
  ));
};

export default QuizList;

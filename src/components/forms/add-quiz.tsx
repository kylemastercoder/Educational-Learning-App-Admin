/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader } from "../global/loader";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Label } from "../ui/label";
import { createQuiz, updateQuiz } from "@/actions/quiz";

const CreateQuiz = ({ initialData }: { initialData: any }) => {
  const [isPending, setIsPending] = useState(false);
  const [howManyQuiz, setHowManyQuiz] = useState("1");
  const [type, setType] = useState("multipleChoice");
  const [difficulties, setDifficulties] = useState("beginner");
  const [questions, setQuestions] = useState([
    { question: "", correctAnswer: "", answers: "" },
  ]);
  const [errors, setErrors] = useState<string[]>([]);
  const router = useRouter();

  // Set initial state from initialData
  useEffect(() => {
    if (initialData) {
      setHowManyQuiz(initialData.howManyQuiz.toString());
      setType(initialData.type);
      setDifficulties(initialData.difficulties);
      setQuestions(initialData.questions || []);
    }
  }, [initialData]);

  useEffect(() => {
    const numQuestions = parseInt(howManyQuiz, 10);
    if (!isNaN(numQuestions) && numQuestions > 0) {
      setQuestions((prevQuestions) => {
        // Ensure the number of questions matches howManyQuiz
        if (prevQuestions.length < numQuestions) {
          // Add new questions if needed
          return [
            ...prevQuestions,
            ...Array(numQuestions - prevQuestions.length).fill({
              question: "",
              correctAnswer: "",
              answers: "",
            }),
          ];
        } else {
          // Remove excess questions if needed
          return prevQuestions.slice(0, numQuestions);
        }
      });
    } else {
      setQuestions([{ question: "", correctAnswer: "", answers: "" }]); // Reset if invalid number
    }
  }, [howManyQuiz]);

  const handleChange = (
    index: number,
    field: keyof (typeof questions)[0],
    value: string
  ) => {
    const newQuestions = [...questions];
    newQuestions[index] = {
      ...newQuestions[index],
      [field]: value,
    };
    setQuestions(newQuestions);
  };

  const validateForm = (): boolean => {
    const newErrors: string[] = [];

    questions.forEach((question, index) => {
      if (!question.question.trim()) {
        newErrors.push(`Question ${index + 1} is required.`);
      }
      if (!question.correctAnswer.trim()) {
        newErrors.push(`Correct answer for question ${index + 1} is required.`);
      }
      if (type === "multipleChoice" && !question.answers.trim()) {
        newErrors.push(`Answers for question ${index + 1} are required.`);
      }
    });

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Create a payload object
    const payload = {
      howManyQuiz,
      type,
      difficulties,
      questions,
    };

    try {
      setIsPending(true);
      if (initialData) {
        const response = await updateQuiz(payload, initialData.id);
        if (response.status === 200) {
          toast.success("Quiz Updated Successfully");
          router.push("/pages/quizzes");
        } else {
          toast.error("Error updating quiz");
        }
      } else {
        const response = await createQuiz(payload);
        if (response.status === 200) {
          toast.success("Quiz Created Successfully");
          router.push("/pages/quizzes");
        } else {
          toast.error("Error creating quiz");
        }
      }
    } catch (error) {
      toast.error("Oops! Something went wrong. Try again");
      console.log(error);
    } finally {
      setIsPending(false);
    }
  };

  const renderTableRows = () => {
    return questions.map((_, index) => (
      <TableRow key={index} className="hover:bg-transparent">
        <TableCell>
          <div className="space-y-2">
            <Input
              type="text"
              value={questions[index].question || ""}
              onChange={(e) => handleChange(index, "question", e.target.value)}
              placeholder={`Enter question ${index + 1}`}
              className="bg-themeBlack border-themeGray text-themeTextGray"
            />
          </div>
        </TableCell>
        {type === "multipleChoice" && (
          <TableCell>
            <div className="space-y-2">
              <Input
                type="text"
                value={questions[index].answers || ""}
                onChange={(e) => handleChange(index, "answers", e.target.value)}
                placeholder={`Enter answers separated by comma`}
                className="bg-themeBlack border-themeGray text-themeTextGray"
              />
            </div>
          </TableCell>
        )}
        <TableCell>
          <div className="space-y-2">
            <Input
              type="text"
              value={questions[index].correctAnswer || ""}
              onChange={(e) =>
                handleChange(index, "correctAnswer", e.target.value)
              }
              placeholder={`Enter correct answer`}
              className="bg-themeBlack border-themeGray text-themeTextGray"
            />
          </div>
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <form className="mt-5" onSubmit={handleSubmit}>
      <div className="">
        <div>
          <Label>How Many Questions?</Label>
          <Input
            value={howManyQuiz}
            onChange={(e) => setHowManyQuiz(e.target.value)}
            className="bg-themeBlack border-themeGray text-themeTextGray"
          />
        </div>
        <div className="mb-3 mt-3">
          <div className="space-y-3">
            <Label>Quiz Difficulties</Label>
            <RadioGroup
              defaultValue={difficulties}
              onValueChange={(value) => setDifficulties(value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="beginner" id="beginner" />
                <Label htmlFor="beginner">Beginner</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="intermediate" id="intermediate" />
                <Label htmlFor="intermediate">Intermediate</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="advanced" id="advanced" />
                <Label htmlFor="advanced">Advanced</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
        <div className="mb-3 mt-3">
          <div className="space-y-3">
            <Label>Quiz Type</Label>
            <RadioGroup
              defaultValue={type}
              onValueChange={(value) => setType(value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="multipleChoice" id="multipleChoice" />
                <Label htmlFor="multipleChoice">Multiple Choice</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="trueFalse" id="trueFalse" />
                <Label htmlFor="multipleChoice">True or False</Label>
              </div>
            </RadioGroup>
          </div>
          <Table className="mt-3">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-white">Questions</TableHead>
                {type === "multipleChoice" && (
                  <TableHead className="text-white">Answers</TableHead>
                )}
                <TableHead className="text-white">Correct Answer</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>{renderTableRows()}</TableBody>
          </Table>
        </div>
        {errors.length > 0 && (
          <div className="text-red-500 mb-3 text-center">
            {errors.map((error, idx) => (
              <p className="text-sm" key={idx}>
                {error}
              </p>
            ))}
          </div>
        )}
        <Button
          variant="outline"
          type="submit"
          className="bg-themeBlack mt-2 w-full border-themeGray rounded-xl"
        >
          <Loader loading={isPending}>
            {initialData ? "Save Changes" : "Submit Quiz"}
          </Loader>
        </Button>
      </div>
    </form>
  );
};

export default CreateQuiz;

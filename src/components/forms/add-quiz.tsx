/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Loader } from "../global/loader";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCourses } from "@/actions/course";
import { Textarea } from "../ui/textarea";

const CreateQuiz = ({ initialData }: { initialData?: any }) => {
  const [isPending, setIsPending] = useState(false);
  const [quizTitle, setQuizTitle] = useState("");
  const [instruction, setInstruction] = useState("");
  const [module, setModule] = useState("");
  const [moduleData, setModuleData] = useState<
    { moduleCount: number; name: string; id: string }[]
  >([]);
  const [howManyQuiz, setHowManyQuiz] = useState("1");
  const [type, setType] = useState("multipleChoice");
  const [questions, setQuestions] = useState([
    { question: "", correctAnswer: "", answers: "" },
  ]);
  const [errors, setErrors] = useState<string[]>([]);

  // Set initial state from initialData
  useEffect(() => {
    if (initialData) {
      setQuizTitle(initialData.quizTitle);
      setInstruction(initialData.instruction);
      setModule(initialData.module);
      setHowManyQuiz(initialData.howManyQuiz.toString());
      setType(initialData.type);
      setQuestions(initialData.questions || []);
    }
  }, [initialData]);

  useEffect(() => {
    // Fetch module data
    const fetchModuleData = async () => {
      try {
        const response = await getCourses();
        if (response.courses) {
          setModuleData(response.courses);
        } else {
          setModuleData([]);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchModuleData();
  }, []);

  useEffect(() => {
    const numQuestions = parseInt(howManyQuiz, 10);
    if (!isNaN(numQuestions) && numQuestions > 0) {
      setQuestions((prevQuestions) => {
        const updatedQuestions = [...prevQuestions];

        // Add empty question objects if necessary
        while (updatedQuestions.length < numQuestions) {
          updatedQuestions.push({
            question: "",
            correctAnswer: "",
            answers: "",
          });
        }

        // Trim to the desired number of questions
        return updatedQuestions.slice(0, numQuestions);
      });
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
      quizTitle,
      module,
      howManyQuiz,
      type,
      instruction,
      questions,
    };

    try {
      setIsPending(true);
      if (initialData) {
        const response = await updateQuiz(payload, initialData.id);
        if (response.status === 200) {
          toast.success("Quiz Updated Successfully");
          window.location.assign("/pages/quizzes");
        } else {
          toast.error("Error updating quiz");
        }
      } else {
        const response = await createQuiz(payload);
        if (response.status === 200) {
          toast.success("Quiz Created Successfully");
          window.location.assign("/pages/quizzes");
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
    if (initialData) {
      return initialData.questions.map((question: any, index: number) => (
        <TableRow key={index} className="hover:bg-transparent">
          {/* Question Input */}
          <TableCell>
            <div className="space-y-2">
              <Input
                type="text"
                value={question.question || ""}
                onChange={(e) =>
                  handleChange(index, "question", e.target.value)
                }
                placeholder={`Enter question ${index + 1}`}
                className="dark:bg-themeBlack dark:border-themeGray dark:text-themeTextGray bg-white border-zinc-100 text-black"
              />
            </div>
          </TableCell>

          {/* Multiple Choice Answers Input */}
          {type === "multipleChoice" && (
            <TableCell>
              <div className="space-y-2">
                <Input
                  type="text"
                  value={question.answers || ""}
                  onChange={(e) =>
                    handleChange(index, "answers", e.target.value)
                  }
                  placeholder="Enter answers separated by a '|'"
                  className="dark:bg-themeBlack dark:border-themeGray dark:text-themeTextGray bg-white border-zinc-100 text-black"
                />
              </div>
            </TableCell>
          )}

          {/* Correct Answer Input */}
          <TableCell>
            <div className="space-y-2">
              {type === "trueFalse" ? (
                <Select
                  defaultValue={question.correctAnswer || ""}
                  onValueChange={(value) =>
                    handleChange(index, "correctAnswer", value)
                  }
                >
                  <SelectTrigger className="dark:bg-themeBlack dark:border-themeGray dark:text-themeTextGray bg-white border-zinc-100 text-black">
                    <SelectValue placeholder="Select Answer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">True</SelectItem>
                    <SelectItem value="false">False</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  type="text"
                  value={question.correctAnswer || ""}
                  onChange={(e) =>
                    handleChange(index, "correctAnswer", e.target.value)
                  }
                  placeholder="Enter correct answer"
                  className="dark:bg-themeBlack dark:border-themeGray dark:text-themeTextGray bg-white border-zinc-100 text-black"
                />
              )}
            </div>
          </TableCell>
        </TableRow>
      ));
    } else {
      return questions.map((question, index) => (
        <TableRow key={index} className="hover:bg-transparent">
          {/* Question Input */}
          <TableCell>
            <div className="space-y-2">
              <Input
                type="text"
                value={question.question || ""}
                onChange={(e) =>
                  handleChange(index, "question", e.target.value)
                }
                placeholder={`Enter question ${index + 1}`}
                className="dark:bg-themeBlack dark:border-themeGray dark:text-themeTextGray bg-white border-zinc-100 text-black"
              />
            </div>
          </TableCell>

          {/* Multiple Choice Answers Input */}
          {type === "multipleChoice" && (
            <TableCell>
              <div className="space-y-2">
                <Input
                  type="text"
                  value={question.answers || ""}
                  onChange={(e) =>
                    handleChange(index, "answers", e.target.value)
                  }
                  placeholder="Enter answers separated by a '|'"
                  className="dark:bg-themeBlack dark:border-themeGray dark:text-themeTextGray bg-white border-zinc-100 text-black"
                />
              </div>
            </TableCell>
          )}

          {/* Correct Answer Input */}
          <TableCell>
            <div className="space-y-2">
              {type === "trueFalse" ? (
                <Select
                  defaultValue={question.correctAnswer || ""}
                  onValueChange={(value) =>
                    handleChange(index, "correctAnswer", value)
                  }
                >
                  <SelectTrigger className="dark:bg-themeBlack dark:border-themeGray dark:text-themeTextGray bg-white border-zinc-100 text-black">
                    <SelectValue placeholder="Select Answer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">True</SelectItem>
                    <SelectItem value="false">False</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  type="text"
                  value={question.correctAnswer || ""}
                  onChange={(e) =>
                    handleChange(index, "correctAnswer", e.target.value)
                  }
                  placeholder="Enter correct answer"
                  className="dark:bg-themeBlack dark:border-themeGray dark:text-themeTextGray bg-white border-zinc-100 text-black"
                />
              )}
            </div>
          </TableCell>
        </TableRow>
      ));
    }
  };

  return (
    <form className="mt-5" onSubmit={handleSubmit}>
      <div className="max-h-[70vh] overflow-y-auto">
        <div className="mb-3">
          <Label>Quiz Title</Label>
          <Input
            value={quizTitle}
            placeholder="Enter Quiz Title"
            onChange={(e) => setQuizTitle(e.target.value)}
            className="dark:bg-themeBlack dark:border-themeGray dark:text-themeTextGray bg-white border-zinc-100 text-black"
          />
        </div>
        <div className="mb-3">
          <Label>Module</Label>
          <Select value={module} onValueChange={(value) => setModule(value)}>
            <SelectTrigger className="dark:bg-themeBlack dark:border-themeGray dark:text-themeTextGray bg-white border-zinc-100 text-black">
              <SelectValue placeholder="Select Module" />
            </SelectTrigger>
            <SelectContent>
              {moduleData.map((item) => (
                <SelectItem key={item.id} value={item.id}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="mb-3">
          <Label>Quiz Instruction</Label>
          <Textarea
            value={instruction}
            placeholder="Enter Quiz Instruction"
            onChange={(e) => setInstruction(e.target.value)}
            className="dark:bg-themeBlack dark:border-themeGray dark:text-themeTextGray bg-white border-zinc-100 text-black"
          />
        </div>
        <div>
          <Label>How Many Questions?</Label>
          <Input
            value={howManyQuiz}
            onChange={(e) => setHowManyQuiz(e.target.value)}
            className="dark:bg-themeBlack dark:border-themeGray dark:text-themeTextGray bg-white border-zinc-100 text-black"
          />
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
                <TableHead className="dark:text-white text-black">
                  Questions
                </TableHead>
                {type === "multipleChoice" && (
                  <TableHead className="dark:text-white text-black">
                    Answers
                  </TableHead>
                )}
                <TableHead className="dark:text-white text-black">
                  Correct Answer
                </TableHead>
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
          className="dark:bg-themeBlack bg-white mt-2 w-full border-themeGray rounded-xl"
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

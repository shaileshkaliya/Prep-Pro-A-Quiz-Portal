import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import axios from "axios";
import { ENDPOINTS } from "../utils/Constants";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AddQuestionsManual() {
  const { quizId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const hasRunRef = useRef(false);
  const initQuestionsOnce = useRef(false); // ✅ new ref for initialization safeguard
  const token = localStorage.getItem("jwtToken");

  const importedQuestions = location.state?.importedQuestions || [];
  const numQuestions = location.state?.numQuestions || 0;

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const getDefaultQuestion = () => ({
    questionContent: "",
    options: { A: "", B: "", C: "", D: "" },
    correctOptions: [],
    questionCategory: 0,
  });

  useEffect(() => {
    if (hasRunRef.current) return;
    hasRunRef.current = true;

    const checkQuizState = async () => {
      if (!quizId) {
        toast.warning("Invalid quizId in URL", {
          position: "top-right",
          autoClose: 2000,
        });
        navigate("/createQuiz");
        return;
      }

      try {
        const response = await axios.get(
          ENDPOINTS.QUIZ.IS_QUIZ_IN_DRAFT_STATE(quizId),
          {
            headers: { jwtToken: token },
          }
        );

        if (response.status === 200 && response.data !== true) {
          toast.warning("Quiz is not in draft state.", {
            position: "top-right",
            autoClose: 2000,
          });
          navigate("/createQuiz");
        }
      } catch (error) {
        console.error("Error checking quiz state" + error);
        toast.warning("Error checking quiz state", {
          position: "top-right",
          autoClose: 2000,
        });
        navigate("/createQuiz");
      }
    };

    checkQuizState();
  }, [quizId, navigate, token]);

  useEffect(() => {
    if (initQuestionsOnce.current) return; // ✅ prevent re-init on every render
    initQuestionsOnce.current = true;

    if (!numQuestions || numQuestions <= 0) {
      toast.error("Please specify the number of questions before proceeding.", {
        position: "top-right",
        autoClose: 3000,
      });
      navigate("/createQuiz");
      return;
    }

    if (importedQuestions.length > 0) {
      if (importedQuestions.length !== numQuestions) {
        toast.error(
          `CSV contains ${importedQuestions.length} questions, but ${numQuestions} were expected.`,
          {
            position: "top-right",
            autoClose: 3000,
          }
        );
        setQuestions(Array.from({ length: numQuestions }, getDefaultQuestion));
      } else {
        setQuestions(importedQuestions);
      }
    } else {
      setQuestions(Array.from({ length: numQuestions }, getDefaultQuestion));
    }
  }, [importedQuestions, numQuestions, navigate]);

  const handleQuestionChange = (index, value) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, questionContent: value } : q))
    );
  };

  const handleOptionChange = (qIndex, key, value) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIndex ? { ...q, options: { ...q.options, [key]: value } } : q
      )
    );
  };

  const handleCorrectOptionChange = (qIndex, option) => {
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== qIndex) return q;
        let newCorrectOptions;
        if (q.questionCategory === 0) {
          newCorrectOptions = [option];
        } else {
          newCorrectOptions = q.correctOptions.includes(option)
            ? q.correctOptions.filter((opt) => opt !== option)
            : [...q.correctOptions, option];
        }
        return { ...q, correctOptions: newCorrectOptions };
      })
    );
  };

  const handleCategoryChange = (qIndex, category) => {
    setQuestions((prev) =>
      prev.map((q, i) =>
        i === qIndex
          ? { ...q, questionCategory: category, correctOptions: [] }
          : q
      )
    );
  };

  const validateQuestions = () => {
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.questionContent.trim()) {
        toast.error(`Question ${i + 1} is empty`);
        return false;
      }

      const filledOptions = Object.values(q.options).filter((opt) =>
        opt.trim()
      );
      if (filledOptions.length < 2) {
        toast.error(`Question ${i + 1} must have at least 2 options.`);
        return false;
      }

      if (q.correctOptions.length === 0) {
        toast.error(
          `Please select at least one correct answer for question ${i + 1}`
        );
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!questions || questions.length === 0) {
      toast.warning("No questions to submit. Please add at least one.");
      return;
    }
    if (!validateQuestions()) return;

    setLoading(true);
    try {
      const activateResponse = await axios.post(
        ENDPOINTS.QUIZ.ACTIVATE_QUIZ(quizId),{},
        {
          headers: {
            jwtToken: token,
          },
        }
      );
      console.log(activateResponse)
      if (activateResponse.status !== 200) {
        toast.error("Failed to activate quiz.");
        return;
      }

      if (activateResponse.status === 200) {
        const questionResponse = await axios.post(
          ENDPOINTS.QUESTION.ADD_QUESTIONS(quizId),
          questions,
          {
            headers: {
              jwtToken: token,
            },
          }
        );
        if (questionResponse.status === 201) {
          toast.success("Questions added successfully!", {
            position: "top-right",
            autoClose: 2000,
          });
          navigate("/admindashboard");
        } else {
          toast.error("Failed to add questions.", {
            position: "top-right",
            autoClose: 2000,
          });
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while processing your request.", {
        position: "top-right",
        autoClose: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center p-6">
      <h2 className="text-2xl font-semibold mb-4">Add Questions to Quiz</h2>
      <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-8">
        {questions.map((q, qIndex) => (
          <div
            key={qIndex}
            id={`question-${qIndex}`}
            className="border p-4 rounded-md shadow-md"
          >
            <h3 className="text-lg font-semibold mb-2">
              Question {qIndex + 1}
            </h3>
            <textarea
              className="border p-2 w-full mb-4"
              placeholder="Enter question..."
              value={q.questionContent}
              onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
            />

            <h4 className="text-md font-semibold mt-4">Question Type:</h4>
            <div className="flex sm:gap-4 gap-2 mb-4 sm:flex-row flex-col">
              <label className="flex items-center">
                <input
                  type="radio"
                  className="mr-2"
                  name={`category-${qIndex}`}
                  checked={q.questionCategory === 0}
                  onChange={() => handleCategoryChange(qIndex, 0)}
                />
                Single Correct
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  className="mr-2"
                  name={`category-${qIndex}`}
                  checked={q.questionCategory === 1}
                  onChange={() => handleCategoryChange(qIndex, 1)}
                />
                Multiple Correct
              </label>
            </div>

            <h4 className="text-md font-semibold mt-4">Options:</h4>
            {["A", "B", "C", "D"].map((key) => (
              <div key={key} className="flex items-center mb-2">
                <input
                  type={q.questionCategory === 0 ? "radio" : "checkbox"}
                  className="mr-2"
                  checked={q.correctOptions.includes(key)}
                  onChange={() => handleCorrectOptionChange(qIndex, key)}
                />
                <input
                  type="text"
                  className="border p-2 w-full"
                  placeholder={`Option ${key}`}
                  value={q.options[key]}
                  onChange={(e) =>
                    handleOptionChange(qIndex, key, e.target.value)
                  }
                />
              </div>
            ))}
          </div>
        ))}
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {loading ? "Submitting..." : "Submit Questions"}
        </button>
      </form>
    </div>
  );
}

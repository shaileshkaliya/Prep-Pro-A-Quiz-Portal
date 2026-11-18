import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import QuizWindowHeader from "../components/QuizWindowHeader";
import QuizWindowQuestionContent from "../components/QuizWindowQuestionContent";
import QuizWindowSidebar from "../components/QuizWindowSidebar";
import { ENDPOINTS } from "../utils/Constants";

const QuizWindow = () => {
  const { quizId } = useParams();
  const userId = localStorage.getItem("userId");
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(5 * 60); // 5 minutes
  const [userAnswers, setUserAnswers] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [quizStarted, setQuizStarted] = useState(false);
  const [showExitModal, setShowExitModal] = useState(false);

  const navigate = useNavigate();

  // Fetch quiz data
  useEffect(() => {
    fetchQuizData();
  }, []);

  const fetchQuizData = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      const response = await axios.get(ENDPOINTS.QUIZ.GET_QUIZ_BY_ID(quizId), {
        headers: { jwtToken: token },
      });

      if (response.status === 200) {
        setQuestions(response.data);
      } else {
        toast.error("No questions found.");
        navigate("/dashboard/companies", { replace: true });
      }
    } catch (error) {
      console.error("Error fetching quiz:", error);
      toast.error("Failed to load quiz.");
      navigate("/dashboard/companies", { replace: true });
    }
  };

  // Handle full screen change (Exit Fullscreen = show modal)
  useEffect(() => {
    const onFullScreenChange = () => {
      if (!document.fullscreenElement && quizStarted) {
        setShowExitModal(true);
      }
    };
    document.addEventListener("fullscreenchange", onFullScreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", onFullScreenChange);
    };
  }, [quizStarted]);

  // Timer logic
  useEffect(() => {
    let timer = null;
    if (quizStarted) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            handleFinish(); // auto-submit
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [quizStarted]);

  const handleStartQuiz = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      }

      const now = Date.now();
      localStorage.setItem("startTime", now);
      setStartTime(now);
      setQuizStarted(true);
    } catch (err) {
      console.error("Fullscreen request failed", err);
      toast.error("Please allow fullscreen to continue.");
    }
  };

  const handleOptionClick = (selectedOption) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = selectedOption;
    setUserAnswers(newAnswers);
  };

  const handleFinish = async () => {
    try {
      const token = localStorage.getItem("jwtToken");
      const start = parseInt(localStorage.getItem("startTime"), 10);
      const end = Date.now();
      const timeSpent = Math.floor((end - start) / 1000);

      let gainedScore = 0;
      let correctAttempted = 0;
      let incorrectAttempted = 0;
      let unAttempted = 0;

      questions.forEach((q, index) => {
        const userAnswer = userAnswers[index];

        if (!userAnswer) {
          unAttempted++;
        } else if (
          q.correctOptions.length === 1 &&
          userAnswer === q.correctOptions[0]
        ) {
          correctAttempted++;
          gainedScore++;
        } else {
          incorrectAttempted++;
        }
      });

      const scorePayload = {
        maxScore: questions.length,
        gainedScore,
        totalTime: timeLeft + timeSpent,
        timeSpent,
        totalQuestions: questions.length,
        correctAttempted,
        incorrectAttempted,
        unAttempted,
      };

      const res = await axios.post(ENDPOINTS.QPFENTRY.SAVE(userId, quizId), scorePayload, {
        headers: {
          jwtToken: token,
          "Content-Type": "application/json",
        },
      });

      console.log(res);

      toast.success("Quiz submitted successfully!");
      navigate(`/${quizId}/results`, { replace: true });
    } catch (error) {
      console.error("Quiz submission error:", error);
      toast.error("Submission failed. Please try again.");
    }
  };

  const handleExitModalConfirm = () => {
    setShowExitModal(false);
    handleFinish(); // auto-submit when confirming exit
  };

  const handleExitModalCancel = async () => {
    try {
      await document.documentElement.requestFullscreen(); // Re-enter fullscreen
      setShowExitModal(false);
    } catch (err) {
      console.error("Failed to re-enter fullscreen");
    }
  };

  if (!quizStarted) {
    return (
      <div className="h-screen w-screen flex flex-col justify-center items-center bg-gray-100">
        <h1 className="text-3xl font-semibold mb-4">Ready to start your quiz?</h1>
        <button
          onClick={handleStartQuiz}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow"
        >
          Start Quiz
        </button>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen relative">
      <QuizWindowSidebar
        questions={questions}
        userAnswers={userAnswers}
        setCurrentQuestion={setCurrentQuestion}
      />
      <main className="flex-grow ml-1/4 p-4">
        <QuizWindowHeader timeLeft={timeLeft} handleFinish={handleFinish} />
        {questions.length > 0 && (
          <QuizWindowQuestionContent
            currentQuestion={currentQuestion}
            questions={questions}
            userAnswers={userAnswers}
            handleOptionClick={handleOptionClick}
            setCurrentQuestion={setCurrentQuestion}
          />
        )}
      </main>

      {/* Exit Fullscreen Modal */}
      {showExitModal && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-md w-96">
            <h2 className="text-lg font-bold mb-4 text-center">
              You exited fullscreen!
            </h2>
            <p className="text-sm mb-4 text-center">
              You are required to stay in fullscreen during the quiz.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleExitModalCancel}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Re-enter Fullscreen
              </button>
              <button
                onClick={handleExitModalConfirm}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Submit & Exit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizWindow;

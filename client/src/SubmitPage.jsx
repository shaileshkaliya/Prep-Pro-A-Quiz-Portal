import React, { useEffect, useState, useRef } from "react";
import ScoreDashboard from "./components/SubmitDashboard";
import QuestionCheck from "./components/CheckQuestion";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import QuestionGrid from "./components/QuestionnGrid"
function SubmitPanel() {
    const [quizData, setQuizData] = useState(null);
    const [questionsData, setQuestionsData] = useState([]);
    const componentRef = useRef(); 
    useEffect(() => {
        fetch("data.json") 
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch quiz data");
                }
                return response.json();
            })
            .then((data) => {
                const { quizName, quizTime, timeUsed, Questions } = data;
                const quizInfo = {
                    quizName,
                    maxQuestions: Questions.length,
                    questionsAttempted: Questions.filter(
                        (q) => q.currentChoice !== -1
                    ).length,
                    totalTime: timeAllowed,
                    timeUtilized: timeUsed,
                    correctAnswers: Questions.filter(
                        (q) => q.currentChoice === q.correctOption
                    ).length,
                    wrongAnswers: Questions.filter(
                        (q) =>
                            q.currentChoice !== -1 &&
                            q.currentChoice !== q.correctOption
                    ).length,
                    unattempted: Questions.filter(
                        (q) => q.currentChoice === -1
                    ).length,
                    totalQuestion: Questions.length,
                };
                quizInfo.score =
                    quizInfo.totalQuestion > 0
                        ? Math.round(
                            (quizInfo.correctAnswers /
                                quizInfo.totalQuestion) *
                            100
                        )
                        : 0;
                
                const questionList = Questions.map((q, index) => ({
                    i: index + 1,
                    question: q.question,
                    options: q.Options,
                    correctOption: q.correctOption,
                    explanation: q.explaination,
                    currentChoice: q.currentChoice
                }));

                setQuizData(quizInfo);
                setQuestionsData(questionList);
            })
            .catch((error) => console.error("Error loading quiz data:", error));
    }, []);

    const handleDownloadPDF = async () => {
        const element = componentRef.current;
        const canvas = await html2canvas(element, { scale: 2 });
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save("quiz-results.pdf");
    };

    if (!quizData || questionsData.length === 0) {
        return <div>Loading...</div>;
    }

    return (
        <div className="submit-panel">
            {/* <QuestionGrid/> */}
            <div className="flex justify-center m-3">
                <button
                    onClick={handleDownloadPDF}
                    className="mt-5 px-4 py-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-600"
                >
                    Download PDF
                </button>
            </div>
            <div ref={componentRef}>
                <div className="container mx-auto">
                    <ScoreDashboard {...quizData} />
                </div>
                <div className="p-5 font-bold text-3xl">Your Responses</div>
                <hr className="m-3 h-[3px] bg-grey" />
                <div className="quiz-container mt-8">
                    {questionsData.map((questionData, index) => (
                        <QuestionCheck key={index} {...questionData} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default SubmitPanel;
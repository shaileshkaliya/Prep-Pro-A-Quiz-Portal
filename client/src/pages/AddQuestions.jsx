import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import AddQuestionsManual from "../components/AddQuestionsManual";
import AddQuestionsFileUpload from "../components/AddQuestionsFileUpload";

export default function AddQuestions() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("manual");
  const [importedQuestions, setImportedQuestions] = useState([]);
  const [numQuestions, setNumQuestions] = useState(0);

  useEffect(() => {
    if (location.state?.importedQuestions?.length) {
      setActiveTab("manual"); // Switch to manual tab
      setImportedQuestions(location.state.importedQuestions);
      setNumQuestions(location.state.numQuestions || location.state.importedQuestions.length);
    }
  }, [location.state]);

  return (
    <div className="flex flex-col items-center p-6">
      <h2 className="text-2xl font-semibold mb-6">Add Questions to Quiz</h2>

      {/* Tab Switcher */}
      <div className="flex gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded-md ${
            activeTab === "manual" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("manual")}
        >
          Manual Entry
        </button>
        <button
          className={`px-4 py-2 rounded-md ${
            activeTab === "csv" ? "bg-blue-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("csv")}
        >
          Upload via CSV
        </button>
      </div>

      {/* Render components based on tab */}
      {activeTab === "manual" ? (
        <AddQuestionsManual
          importedQuestions={importedQuestions}
          numQuestions={numQuestions}
        />
      ) : (
        <AddQuestionsFileUpload />
      )}
    </div>
  );
}

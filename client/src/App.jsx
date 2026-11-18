import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import HomeContent from "./components/HomeContent";
import AboutUsContent from "./components/AboutUsContent";
import LoginContent from "./components/LoginContent";
import AdminLoginContent from "./components/AdminLoginContent";
import Dashboard from "./components/Dashboard";
import DashboardContent from "./components/DashboardContent";
import ResultDashboard from "./components/ResultDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminDashboard from "./components/AdminDashboard";
import AdminDashboardContent from "./components/AdminDashboardContent";
import CreateQuiz from "./pages/CreateQuiz";
import AddQuestions from "./pages/AddQuestions";
import QuizWindow from "./pages/QuizWindow";
import QuizResults from "./pages/QuizResults";
import CompanyList from "./components/CompanyList";
import CompanyQuizList from "./components/CompanyQuizList";
import AddUser from "./components/AddUser";
import QuizContent from "./components/QuizContent";
import ShowQuizzes from "./components/ShowQuizzes";
import ShowUsers from "./components/ShowUsers";
import UsersContent from "./components/UsersContent";
import ResultsContent from "./components/ResultsContent";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import PageNotFound from "./pages/PageNotFound";
import QuizResultsPage from "./pages/QuizResultsPage";

const App = () => {
  const navigate = useNavigate();

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem("jwtToken");
    const expiry = localStorage.getItem("jwtExpiry");
    const userId = localStorage.getItem("userId");
    const loginContext = localStorage.getItem("loginContext");
    return (
      token &&
      expiry &&
      userId &&
      loginContext === "user" &&
      new Date().getTime() < Number(expiry)
    );
  });

  const [isAdmin, setIsAdmin] = useState(() => {
    const token = localStorage.getItem("jwtToken");
    const expiry = localStorage.getItem("jwtExpiry");
    const userId = localStorage.getItem("userId");
    const loginContext = localStorage.getItem("loginContext");
    return (
      token &&
      expiry &&
      userId &&
      loginContext === "admin" &&
      new Date().getTime() < Number(expiry)
    );
  });

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    const expiry = localStorage.getItem("jwtExpiry");

    if (token && expiry) {
      const now = new Date().getTime();
      const timeLeft = Number(expiry) - now;

      if (timeLeft <= 0) {
        handleLogout();
      } else {
        const timer = setTimeout(() => {
          toast.info("Session expired. Logging out...", { autoClose: 2000 });
          handleLogout();
        }, timeLeft);

        return () => clearTimeout(timer);
      }
    }
  }, [isAuthenticated, isAdmin]);

  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "logout") {
        handleLogout();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogin = () => {
    const loginContext = localStorage.getItem("loginContext");
    if (loginContext === "admin") {
      setIsAdmin(true);
    } else if (loginContext === "user") {
      setIsAuthenticated(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("jwtExpiry");
    localStorage.removeItem("loginContext");
    localStorage.removeItem("userId");
    localStorage.setItem("logout", Date.now());
    setIsAuthenticated(false);
    setIsAdmin(false);
    toast.success("Logged out successfully");
    navigate("/");
  };

  const generateRoutesFromContext = () => {
    if (isAuthenticated && !isAdmin) {
      return (
        <>
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Dashboard onLogout={handleLogout} />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardContent />} />
            <Route path="resultdashboard" element={<ResultDashboard />} />
            <Route path="companies" element={<CompanyList />} />
            <Route path="companies/:companyId" element={<CompanyQuizList />} />
          </Route>
          <Route path="/quiz/:quizId/quizwindow" element={<QuizWindow />} />
          <Route path="/:quizId/results" element={<QuizResults />} />
        </>
      );
    } else if (!isAuthenticated && isAdmin) {
      return (
        <>
          <Route
            path="/admindashboard/*"
            element={
              <AdminProtectedRoute isAdmin={isAdmin}>
                <AdminDashboard onLogout={handleLogout} />
              </AdminProtectedRoute>
            }
          >
            <Route index element={<AdminDashboardContent />} />
            <Route path="quizcontent" element={<QuizContent />} />
            <Route path="createquiz" element={<CreateQuiz />} />
            <Route path="showquizzes" element={<ShowQuizzes />} />
            <Route path="userscontent" element={<UsersContent />} />
            <Route path="showusers" element={<ShowUsers />} />
            <Route path="adduser" element={<AddUser />} />
            <Route path="resultscontent" element={<ResultsContent />} />
            <Route
              path="quiz/:quizName/:quizId/results"
              element={<QuizResultsPage />}
            />
          </Route>

          {/* Shared Functional Routes accessible to Admin */}
          <Route path="/createQuiz" element={<CreateQuiz />} />
          <Route path="/:quizId/addQuestions" element={<AddQuestions />} />
        </>
      );
    } else {
      return <Route path="*" element={<Navigate to="/login" replace />} />;
    }
  };

  return (
    <div className="min-h-screen max-w-screen bg-gray-100">
      {!isAuthenticated && !isAdmin && <Navbar />}

      <div className="w-full flex flex-col min-h-[calc(100vh-64px)]">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomeContent />} />
          <Route path="/about" element={<AboutUsContent />} />
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <LoginContent onLogin={handleLogin} />
              )
            }
          />
          <Route
            path="/adminlogin"
            element={
              isAdmin ? (
                <Navigate to="/admindashboard" replace />
              ) : (
                <AdminLoginContent onLogin={handleLogin} />
              )
            }
          />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {generateRoutesFromContext()}

          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </div>
      <ToastContainer />
    </div>
  );
};

export default App;

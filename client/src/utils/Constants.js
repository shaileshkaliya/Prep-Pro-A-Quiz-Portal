const BASE_URL = 'http://localhost:8080';

export const ENDPOINTS = {
  USER: {
    LOGIN: `${BASE_URL}/user-service/user/login`,
    PROFILE: `${BASE_URL}/user-service/user/profile`,
    SIGNUP: `${BASE_URL}/user-service/user/signup`,
    BULK_ADD: `${BASE_URL}/user-service/user/bulk-signup`,
    VERIFY_TOKEN:  `${BASE_URL}/user-service/user/verifyToken`,
    IS_ADMIN:  `${BASE_URL}/user-service/user/isAdmin`,
    FETCH_ADMIN_DASHBOARD_DATA:  `${BASE_URL}/user-service/user/fetchAdminDashboardData`,
    GET_ALL_USERS:  `${BASE_URL}/user-service/user/allUsers`,
    DELETE_USERS:  `${BASE_URL}/user-service/user/deleteUsers`,
    UPDATE_ATTENDED_QUIZ: (userId, quizId) => `${BASE_URL}/user-service/user/${userId}/attended-quiz/${quizId}`,
  },
  
  QUIZ: {
    CREATE: `${BASE_URL}/quiz-service/quiz/create`,
    GET_ALL_COMPANY_NAMES: () =>`${BASE_URL}/quiz-service/quiz/companies`,
    GET_ALL_QUIZZES: `${BASE_URL}/quiz-service/quiz/getAllQuizzes`,
    GET_QUIZ_BY_ID: (id) => `${BASE_URL}/quiz-service/quiz/getQuiz/${id}`,
    GET_QUIZZES_BY_COMPANY: (companyName) => `${BASE_URL}/quiz-service/quiz/getAllQuizzesByCompanyName/${companyName}`,
    ACTIVATE_QUIZ: (id) =>  `${BASE_URL}/quiz-service/quiz/activate/${id}`,
    IS_QUIZ_IN_DRAFT_STATE: (id) => `${BASE_URL}/quiz-service/quiz/${id}/state/draft`,
    DELETE_QUIZ: (id) => `${BASE_URL}/quiz-service/quiz/${id}`,
  },

  QUESTION: {
    ADD_QUESTIONS: (id) => `${BASE_URL}/question-service/questions/create/${id}`,
    BULK_ADD: `${BASE_URL}/question-service/questions/bulk-add`,
    DELETE: (id) => `${BASE_URL}/question-service/questions/delete/${id}`,
  },

  QPFENTRY: {
    SAVE: (userId, quizId) => `${BASE_URL}/qpfentry-service/quizProfile/user/${userId}/quiz/${quizId}/save`,
    GET_ENTRY: (userId, quizId) => `${BASE_URL}/qpfentry-service/quizProfile/user/${userId}/quiz/${quizId}`,
    GET_DASHBOARD_DATA: (userId) => `${BASE_URL}/qpfentry-service/quizProfile/user/${userId}/getDashboardInfo`,
    GET_RESULTS_OVERVIEW: `${BASE_URL}/qpfentry-service/quizProfile/resultsOverview`,
    GET_QUIZ_RESULTS: (id) => `${BASE_URL}/qpfentry-service/quizProfile/${id}/results`,
    GET_STUDENTS_QUIZ_RESULTS: (id) => `${BASE_URL}/qpfentry-service/quizProfile/${id}/quizzes/results`,
  },
};

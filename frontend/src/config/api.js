const API_BASE = import.meta.env.VITE_API_BASE || '/api';

export const API = {
  user: import.meta.env.VITE_USER_API || `${API_BASE}/v1/user`,
  job: import.meta.env.VITE_JOB_API || `${API_BASE}/v1/job`,
  application: import.meta.env.VITE_APPLICATION_API || `${API_BASE}/v1/application`,
  company: import.meta.env.VITE_COMPANY_API || `${API_BASE}/v1/company`,
  contact: import.meta.env.VITE_CONTACT_API || `${API_BASE}/contact`,
  kanban: import.meta.env.VITE_KANBAN_API || `${API_BASE}/tasks`,
  aiChat: import.meta.env.VITE_AI_CHAT_API || `${API_BASE}/v1/ai-chat`,
  learning: import.meta.env.VITE_LEARNING_API || `${API_BASE}/v1/learning`,
  quiz: import.meta.env.VITE_QUIZ_API || `${API_BASE}/v1/quiz`,
  quizResult: import.meta.env.VITE_QUIZ_RESULT_API || `${API_BASE}/v1/quiz-result`,
  ats: import.meta.env.VITE_ATS_API || `${API_BASE}/v1/ats`,
  resume: import.meta.env.VITE_RESUME_API || `${API_BASE}/resumes`,
  internship: import.meta.env.VITE_INTERNSHIP_API || `${API_BASE}/v1/internship`,
  savedJob: import.meta.env.VITE_SAVED_JOB_API || `${API_BASE}/v1/saved-job`,
  category: import.meta.env.VITE_CATEGORY_API || `${API_BASE}/v1/category`,
};

export default API;

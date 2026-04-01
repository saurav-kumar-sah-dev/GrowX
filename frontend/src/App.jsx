import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { lazy, Suspense, useEffect, useState } from 'react';
import { verifyUser } from './redux/authSlice';
import ProtectedRoute from './components/shared/ProtectedRoute';
import MainLayout from './Layout/MainLayout';

// ── Auth Pages ────────────────────────────────────────────────────────────────
const Login = lazy(() => import('./components/auth/Login'));
const Signup = lazy(() => import('./components/auth/Signup'));
const VerifyEmail = lazy(() => import('./components/auth/VerifyEmail'));
const ForgotPassword = lazy(() => import('./components/auth/ForgotPassword'));  // handles email→OTP→reset flow
const AdminLogin = lazy(() => import('./components/auth/AdminLogin'));

// ── Public Pages ──────────────────────────────────────────────────────────────
const Jobs = lazy(() => import('./components/Jobs'));
const Profile = lazy(() => import('./components/Profile'));
const JobDescription = lazy(() => import('./components/JobDescription'));
const JobHome = lazy(() => import('./components/JobHome'));
const ResumeCheck = lazy(() => import('./components/ResumeCheck'));
const NotFound = lazy(() => import('./components/PageNot'));

// ── Admin Pages ───────────────────────────────────────────────────────────────
const Companies = lazy(() => import('./components/admin/Companies'));
const CompanyCreate = lazy(() => import('./components/admin/CompanyCreate'));
const CompanySetup = lazy(() => import('./components/admin/CompanySetup'));
const PostJob = lazy(() => import('./components/admin/PostJob'));
const Applicants = lazy(() => import('./components/admin/Applicants'));
const AdminQuizzes = lazy(() => import('./components/admin/AdminQuizzes'));
const CreateQuiz = lazy(() => import('./components/admin/CreateQuiz'));
const EditQuiz = lazy(() => import('./components/admin/EditQuiz'));
const AdminDashboard = lazy(() => import('./components/admin/AdminDashboard'));
const AdminSettings = lazy(() => import('./components/admin/AdminSettings'));
const AdminSaved = lazy(() => import('./components/admin/AdminSaved'));
const AdminUsers = lazy(() => import('./components/admin/AdminUsers'));
const AdminAllJobs = lazy(() => import('./components/admin/AdminAllJobs'));
const EditJob = lazy(() => import('./components/admin/EditJob'));
const AdminAllQuizzes = lazy(() => import('./components/admin/AdminAllQuizzes'));
const AdminAnalytics = lazy(() => import('./components/admin/AdminAnalytics'));
const PostInternship = lazy(() => import('./components/admin/PostInternship'));
const EditInternship = lazy(() => import('./components/admin/EditInternship'));
const AdminCategories = lazy(() => import('./components/admin/AdminCategories'));

// ── User Pages ───────────────────────────────────────────────────────────────
const SavedJobsPage = lazy(() => import('./pages/User/SavedJobs'));
const AdminATS = lazy(() => import('./components/admin/AdminATS'));
const AdminResumes = lazy(() => import('./components/admin/AdminResumes'));
const AdminQuizAccess = lazy(() => import('./components/admin/AdminQuizAccess'));
const AdminJobApplications = lazy(() => import('./components/admin/AdminJobApplications'));
const AdminInternships = lazy(() => import('./components/admin/AdminAllInternships'));
const AdminAIChatHistory = lazy(() => import('./components/admin/AdminAIChatHistory'));

// // ── Shared (NOT lazy — used as route wrappers) ────────────────────────────────
// import ProtectedRoute from './components/shared/ProtectedRoute';
// import MainLayout from './Layout/MainLayout';

// ── Feature Pages ─────────────────────────────────────────────────────────────
const LearningHome = lazy(() => import('./pages/HomeLearning'));


const Internship = lazy(() => import('./pages/Internship'));
const ATSChecker = lazy(() => import('./pages/ATSChecker'));
const ResumeReview = lazy(() => import('./pages/ATSChecker/ResumeReview'));
const StudyRoadmap = lazy(() => import('./pages/Learning/VideoDashboard'));
const WatchDemo = lazy(() => import('./pages/Learning/WatchDemo'));
const Category = lazy(() => import('./pages/Internship/Category'));
const InternshipApply = lazy(() => import('./pages/Internship/InternshipApply'));
const QuizHome = lazy(() => import('./pages/QuizHome'));
const QuizDashboard = lazy(() => import('./pages/Quiz/QuizDashboard'));
const QuizTake = lazy(() => import('./pages/Quiz/QuizTake'));
const ResumeTemplates = lazy(() => import('./pages/Resume/ResumeTemplates'));
const ResumeBuilder = lazy(() => import('./pages/Resume/ResumeBuilder'));
const ResumeDetails = lazy(() => import('./pages/Resume/ResumeDetails'));
const AllResumes = lazy(() => import('./pages/Resume/AllResumes'));
const EditResume = lazy(() => import('./pages/Resume/EditResume'));

const ResumeHome = lazy(() => import('./pages/ResumeHome'));
const KanbanBoardHome = lazy(() => import('./pages/KanbanHero'));
const CreateTask = lazy(() => import('./pages/KanbanBoard/Tasks/CreateTask'));
const KanbanBoard = lazy(() => import('./pages/KanbanBoard/Tasks/KanbanBoard'));
const GetTask = lazy(() => import('./pages/KanbanBoard/Tasks/GetTask'));
const UpdateTask = lazy(() => import('./pages/KanbanBoard/Tasks/UpdateTask'));

// ── User Dashboard (with sidebar layout) ─────────────────────────────────────
const UserLayout = lazy(() => import('./components/user/UserLayout'));
const UserDashboard = lazy(() => import('./components/user/UserDashboard'));

const JobPage = lazy(() => import('./components/user/Jobpage'));
const QuizPage = lazy(() => import('./components/user/QuizPage'));
const ResumePage = lazy(() => import('./components/user/ResumePage'));
const InternshipPage = lazy(() => import('./components/user/InternshipPage'));
const ATSPage = lazy(() => import('./components/user/ATSPage'));
const JobLanding = lazy(() => import('./pages/Job'));
const AllJobs = lazy(() => import('./pages/Job/AllJobs'));


const UserProfilePage = lazy(() => import('./components/user/UserProfilePage'));
const KanbanPage = lazy(() => import('./components/user/KanbanPage'));
const LearningPage = lazy(() => import('./components/user/LearningPage'));
const CreateInterviewSchedule = lazy(() => import('./pages/KanbanBoard/Tasks/CreateInterviewSchedule'));
// keep old ones for backward compat
const QuizDashboardUser = lazy(() => import('./components/QuizDashboardUser'));
const JobDashboardUser = lazy(() => import('./components/JobDashboardUser'));
const SavedJobsDashboard = lazy(() => import('./components/SavedJobsDashboard'));

// ─────────────────────────────────────────────────────────────────────────────
// Page Loader  (shown while lazy chunks are loading)
// ─────────────────────────────────────────────────────────────────────────────
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-purple-50">
    <div className="text-center">
      <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500
                      flex items-center justify-center shadow-xl animate-pulse">
        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10"
            stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      </div>
      <div className="flex gap-1.5 justify-center">
        {[0, 1, 2].map(i => (
          <div key={i}
            className="w-2 h-2 rounded-full bg-purple-500 animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }} />
        ))}
      </div>
    </div>
  </div>
);

// ── Auth Init ────────────────────────────────────────────────────────────────────
const AuthInit = ({ children }) => {
  const dispatch = useDispatch();
  const { user, loading, verified } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!verified) {
      dispatch(verifyUser());
    }
  }, [dispatch, verified]);

  return children;
};

// ── Root redirect — admin goes to /admin/dashboard, others see LearningHome
// ─────────────────────────────────────────────────────────────────────────────
const RedirectRoot = () => {
  const { user } = useSelector((state) => state.auth);
  if (user?.role === 'recruiter' || user?.role === 'admin') {
    return <Navigate to="/admin/dashboard" replace />;
  }
  return (
    <Suspense fallback={<PageLoader />}>
      <LearningHome />
    </Suspense>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// Wrap helper — keeps route definitions concise
// ─────────────────────────────────────────────────────────────────────────────
const W = ({ children }) => <Suspense fallback={<PageLoader />}>{children}</Suspense>;

// ─────────────────────────────────────────────────────────────────────────────
// Router
// ─────────────────────────────────────────────────────────────────────────────
const router = createBrowserRouter([

  // ── Auth / Public (no layout) ──────────────────────────────────────────────
  { path: '/login', element: <W><Login /></W> },
  { path: '/signup', element: <W><Signup /></W> },
  { path: '/verify-email', element: <W><VerifyEmail /></W> },      // ?token=...&email=...
  { path: '/forgot-password', element: <W><ForgotPassword /></W> },   // handles all 3 steps
  { path: '/admin/login', element: <W><AdminLogin /></W> },
  { path: '*', element: <W><NotFound /></W> },

  // ── Main Layout (Navbar + footer) ─────────────────────────────────────────
  {
    path: '/',
    element: <W><MainLayout /></W>,
    children: [
      { index: true, element: <RedirectRoot /> },
      { path: 'job', element: <W><JobLanding /></W> },
      { path: 'jobs', element: <W><AllJobs /></W> },
      { path: 'joball', element: <W><Jobs /></W> },
      { path: 'description/:id', element: <W><JobDescription /></W> },
      { path: 'resumeCheck', element: <W><ResumeCheck /></W> },
      { path: 'learning', element: <W><LearningHome /></W> },
      { path: 'internship', element: <W><Internship /></W> },
      { path: 'watchDemo', element: <W><WatchDemo /></W> },
      { path: 'quiz', element: <W><QuizHome /></W> },
      { path: 'atschecker', element: <W><ATSChecker /></W> },
      { path: 'resume', element: <W><ResumeHome /></W> },
      { path: 'resume-templates', element: <W><ResumeTemplates /></W> },
      { path: 'KanbanBoard', element: <W><KanbanBoardHome /></W> },

      // Protected
      { path: 'profile', element: <W><ProtectedRoute><Profile /></ProtectedRoute></W> },
      { path: 'profile/edit', element: <W><ProtectedRoute><Profile editMode /></ProtectedRoute></W> },
      { path: 'dashboard', element: <W><ProtectedRoute><Navigate to="/user/dashboard" replace /></ProtectedRoute></W> },
      { path: 'dashboard/quiz', element: <W><ProtectedRoute><QuizDashboardUser /></ProtectedRoute></W> },
      { path: 'dashboard/jobs', element: <W><ProtectedRoute><JobDashboardUser /></ProtectedRoute></W> },
      { path: 'dashboard/saved-jobs', element: <W><ProtectedRoute><SavedJobsPage /></ProtectedRoute></W> },
      { path: 'saved-jobs', element: <W><ProtectedRoute><SavedJobsPage /></ProtectedRoute></W> },
      { path: 'learningVideo', element: <W><ProtectedRoute><StudyRoadmap /></ProtectedRoute></W> },
      { path: 'category', element: <W><ProtectedRoute><Category /></ProtectedRoute></W> },
      { path: 'internships/apply', element: <W><ProtectedRoute><InternshipApply /></ProtectedRoute></W> },
      { path: 'quizCategory', element: <W><ProtectedRoute><QuizDashboard /></ProtectedRoute></W> },
      { path: 'quiz-dashboard', element: <W><ProtectedRoute><QuizDashboard /></ProtectedRoute></W> },
      { path: 'quiz/:id', element: <W><ProtectedRoute><QuizTake /></ProtectedRoute></W> },
      { path: 'atschecker/review', element: <W><ProtectedRoute><ResumeReview /></ProtectedRoute></W> },
      { path: 'resume-builder', element: <W><ProtectedRoute><ResumeBuilder /></ProtectedRoute></W> },
      { path: 'resume/:id', element: <W><ProtectedRoute><ResumeDetails /></ProtectedRoute></W> },
      { path: 'all-resumes', element: <W><ProtectedRoute><AllResumes /></ProtectedRoute></W> },
      { path: 'edit-resume/:id', element: <W><ProtectedRoute><EditResume /></ProtectedRoute></W> },
      { path: 'taskForm', element: <W><ProtectedRoute><CreateTask /></ProtectedRoute></W> },
      { path: 'Taskkanbanboard', element: <W><ProtectedRoute><KanbanBoard /></ProtectedRoute></W> },
      { path: 'getTask/:id?', element: <W><ProtectedRoute><GetTask /></ProtectedRoute></W> },
      { path: 'updateTask/:id?', element: <W><ProtectedRoute><UpdateTask /></ProtectedRoute></W> },
    ],
  },

  // ── User Dashboard Routes (sidebar layout) ───────────────────────────────────
  {
    path: '/user',
    element: <W><ProtectedRoute adminOnly={false}><UserLayout /></ProtectedRoute></W>,
    children: [
      { path: 'dashboard', element: <W><UserDashboard /></W> },
      { path: 'quiz', element: <W><QuizPage /></W> },
      { path: 'jobs', element: <W><JobPage /></W> },
      { path: 'saved-jobs', element: <W><SavedJobsPage /></W> },
      { path: 'resume', element: <W><ResumePage /></W> },
      { path: 'internship', element: <W><InternshipPage /></W> },
      { path: 'ats', element: <W><ATSPage /></W> },
      { path: 'profile', element: <W><UserProfilePage /></W> },
      { path: 'profile/edit', element: <W><Profile editMode /></W> },
      { path: 'kanban', element: <W><KanbanPage /></W> },
      { path: 'learning', element: <W><LearningPage /></W> },
    ],
  },

  // ── Admin Routes (NO MainLayout — no navbar, no padding) ──────────────────
  { path: '/admin/dashboard', element: <W><ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute></W> },
  { path: '/admin/companies', element: <W><ProtectedRoute adminOnly><Companies /></ProtectedRoute></W> },
  { path: '/admin/companies/create', element: <W><ProtectedRoute adminOnly><CompanyCreate /></ProtectedRoute></W> },
  { path: '/admin/companies/:id', element: <W><ProtectedRoute adminOnly><CompanySetup /></ProtectedRoute></W> },
  { path: '/admin/jobs/create', element: <W><ProtectedRoute adminOnly><PostJob /></ProtectedRoute></W> },
  { path: '/admin/all-jobs', element: <W><ProtectedRoute adminOnly><AdminAllJobs /></ProtectedRoute></W> },
  { path: '/admin/jobs', element: <W><ProtectedRoute adminOnly><AdminAllJobs /></ProtectedRoute></W> },
  { path: '/admin/jobs/edit/:id', element: <W><ProtectedRoute adminOnly><EditJob /></ProtectedRoute></W> },
  { path: '/admin/internships/edit/:id', element: <W><ProtectedRoute adminOnly><EditInternship /></ProtectedRoute></W> },
  { path: '/admin/jobs/:id/applicants', element: <W><ProtectedRoute adminOnly><Applicants /></ProtectedRoute></W> },
  { path: '/admin/quizzes', element: <W><ProtectedRoute adminOnly><AdminQuizzes /></ProtectedRoute></W> },
  { path: '/admin/quizzes/create', element: <W><ProtectedRoute adminOnly><CreateQuiz /></ProtectedRoute></W> },
  { path: '/admin/quizzes/edit/:id', element: <W><ProtectedRoute adminOnly><EditQuiz /></ProtectedRoute></W> },
  { path: '/admin/settings', element: <W><ProtectedRoute adminOnly><AdminSettings /></ProtectedRoute></W> },
  { path: '/admin/saved', element: <W><ProtectedRoute adminOnly><AdminSaved /></ProtectedRoute></W> },
  { path: '/admin/users', element: <W><ProtectedRoute adminOnly><AdminUsers /></ProtectedRoute></W> },
  { path: '/admin/all-quizzes', element: <W><ProtectedRoute adminOnly><AdminAllQuizzes /></ProtectedRoute></W> },
  { path: '/admin/analytics', element: <W><ProtectedRoute adminOnly><AdminAnalytics /></ProtectedRoute></W> },
  { path: '/admin/ats', element: <W><ProtectedRoute adminOnly><AdminATS /></ProtectedRoute></W> },
  { path: '/admin/resumes', element: <W><ProtectedRoute adminOnly><AdminResumes /></ProtectedRoute></W> },
  { path: '/admin/quiz-access', element: <W><ProtectedRoute adminOnly><AdminQuizAccess /></ProtectedRoute></W> },
  { path: '/admin/job-applications', element: <W><ProtectedRoute adminOnly><AdminJobApplications /></ProtectedRoute></W> },
  { path: '/admin/internships', element: <W><ProtectedRoute adminOnly><AdminInternships /></ProtectedRoute></W> },
  { path: '/admin/categories', element: <W><ProtectedRoute adminOnly><AdminCategories /></ProtectedRoute></W> },
  { path: '/admin/ai-chat', element: <W><ProtectedRoute adminOnly><AdminAIChatHistory /></ProtectedRoute></W> },
]);

// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <AuthInit>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center" style={{ background: '#0A0A0F' }}>
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full border-4 border-transparent animate-spin"
              style={{ borderBottomColor: '#D4A853', borderTopColor: 'transparent' }} />
            <p style={{ color: '#F5F0E6' }}>Loading...</p>
          </div>
        </div>
      }>
        <RouterProvider router={router} />
      </Suspense>
    </AuthInit>
  );
}
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { IoMdArrowRoundBack } from 'react-icons/io';
import { Clock, CheckCircle, ChevronLeft, ChevronRight, Trophy, Target, Zap, Timer, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import axios from 'axios';
import { toast } from 'sonner';
import Confetti from 'react-confetti';
import { API } from '@/config/api';

const QuizTake = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    fetchQuiz();
  }, [id]);

  useEffect(() => {
    if (timeLeft > 0 && !showResult) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && quiz) {
      handleSubmit();
    }
  }, [timeLeft, showResult]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (showResult || !quiz) return;
      if (e.key >= '1' && e.key <= '4') {
        handleAnswer(currentQuestion, parseInt(e.key) - 1);
      }
      if (e.key === 'ArrowRight' || e.key === 'n') {
        setCurrentQuestion(prev => Math.min(prev + 1, quiz.questions.length - 1));
      }
      if (e.key === 'ArrowLeft' || e.key === 'p') {
        setCurrentQuestion(prev => Math.max(prev - 1, 0));
      }
      if (e.key === 'Enter' && currentQuestion === quiz.questions.length - 1) {
        handleSubmit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentQuestion, quiz, showResult]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (!showResult && quiz && timeLeft > 0) {
        e.preventDefault();
        e.returnValue = 'Your quiz progress will be lost. Are you sure you want to leave?';
        return e.returnValue;
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [showResult, quiz, timeLeft]);

  const fetchQuiz = async () => {
    try {
      const res = await axios.get(`${API.quiz}/${id}`);
      setQuiz(res.data.quiz);
      setTimeLeft(res.data.quiz.timeLimit * 60);
      setStartTime(Date.now());
    } catch (error) {
      toast.error('Failed to load quiz');
      navigate('/quiz-dashboard');
    }
  };

  const handleAnswer = (questionIndex, optionIndex) => {
    setAnswers(prev => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const handleSubmit = async () => {
    let totalScore = 0;
    const resultAnswers = [];
    
    quiz.questions.forEach((q, idx) => {
      const isCorrect = answers[idx] === q.correctAnswer;
      if (isCorrect) {
        totalScore += q.marks;
      }
      resultAnswers.push({
        questionIndex: idx,
        selectedAnswer: answers[idx] ?? -1,
        isCorrect,
      });
    });
    
    setScore(totalScore);
    setShowResult(true);

    const timeTaken = Math.floor((Date.now() - startTime) / 1000);

    try {
      await axios.post(
        `${API.quizResult}/save`,
        {
          quizId: id,
          score: totalScore,
          totalMarks: quiz.totalMarks,
          answers: resultAnswers,
          timeTaken,
        },
        { withCredentials: true }
      );
      toast.success('Quiz result saved!');
    } catch (error) {
      console.error('Failed to save result:', error);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'hard': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const answeredCount = Object.keys(answers).length;
  const percentage = ((score / (quiz?.totalMarks || 1)) * 100).toFixed(1);

  if (!quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#0A0A0F 0%,#121218 50%,#0A0A0F 100%)' }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="relative"
        >
          <div className="w-20 h-20 border-4 border-amber-500/30 border-t-amber-500 rounded-full" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full animate-pulse" />
          </div>
        </motion.div>
      </div>
    );
  }

  if (showResult) {
    let feedback = { icon: Trophy, message: '', color: '', bg: '', gradient: '' };
    
    if (percentage >= 90) {
      feedback = { 
        icon: Trophy, message: 'Outstanding Performance!', 
        color: 'text-amber-400', bg: 'bg-amber-500/20', gradient: 'from-amber-400 to-orange-500' 
      };
    } else if (percentage >= 80) {
      feedback = { 
        icon: Zap, message: 'Excellent Work!', 
        color: 'text-amber-400', bg: 'bg-amber-500/20', gradient: 'from-amber-400 to-yellow-500' 
      };
    } else if (percentage >= 70) {
      feedback = { 
        icon: Target, message: 'Good Job!', 
        color: 'text-amber-400', bg: 'bg-amber-500/20', gradient: 'from-amber-400 to-amber-500' 
      };
    } else if (percentage >= 60) {
      feedback = { 
        icon: BarChart3, message: 'Nice Try!', 
        color: 'text-amber-300', bg: 'bg-amber-500/10', gradient: 'from-amber-400 to-amber-600' 
      };
    } else if (percentage >= 50) {
      feedback = { 
        icon: Timer, message: 'Keep Practicing!', 
        color: 'text-yellow-400', bg: 'bg-yellow-500/10', gradient: 'from-yellow-400 to-orange-500' 
      };
    } else {
      feedback = { 
        icon: Target, message: "Don't Give Up!", 
        color: 'text-red-400', bg: 'bg-red-500/20', gradient: 'from-red-400 to-pink-500' 
      };
    }

    const correctCount = Object.values(answers).filter((ans, idx) => ans === quiz.questions[idx].correctAnswer).length;
    const wrongCount = quiz.questions.length - correctCount;
    const FeedbackIcon = feedback.icon;

    return (
      <div className="min-h-screen py-8 px-4 -mt-16" style={{ background: 'linear-gradient(135deg,#0A0A0F 0%,#121218 50%,#0A0A0F 100%)' }}>
        {percentage >= 70 && <Confetti width={windowSize.width} height={windowSize.height} />}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="border border-amber-500/20" style={{ background: 'rgba(26,26,36,0.95)', backdropFilter: 'blur(20px)' }}>
            <div className={`h-2 bg-gradient-to-r ${feedback.gradient}`} />
            
            <CardContent className="p-8 text-center">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', duration: 0.6 }}
                className={`inline-flex p-6 rounded-full ${feedback.bg} mb-6`}
              >
                <FeedbackIcon className={`w-16 h-16 ${feedback.color}`} />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-3xl font-bold mb-2" style={{ color: '#F5F0E6' }}>Quiz Completed!</h2>
                <p className={`text-xl font-semibold mb-6 ${feedback.color}`}>{feedback.message}</p>
                
                <div className={`bg-gradient-to-br ${feedback.bg} rounded-3xl p-8 mb-6 border border-amber-500/20`}>
                  <motion.p 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4, type: 'spring' }}
                    className={`text-7xl font-black bg-gradient-to-r ${feedback.gradient} bg-clip-text text-transparent mb-2`}
                  >
                    {percentage}%
                  </motion.p>
                  <p className="text-2xl font-bold mb-1" style={{ color: '#F5F0E6' }}>
                    {score} / {quiz.totalMarks} points
                  </p>
                  <p style={{ color: '#A8A099' }}>Overall Score</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <motion.div 
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="border border-amber-500/30 rounded-2xl p-4"
                    style={{ background: 'rgba(212,168,83,0.1)' }}
                  >
                    <CheckCircle className="w-8 h-8 mx-auto mb-2" style={{ color: '#D4A853' }} />
                    <p className="text-3xl font-bold" style={{ color: '#D4A853' }}>{correctCount}</p>
                    <p className="text-sm" style={{ color: '#A8A099' }}>Correct</p>
                  </motion.div>
                  <motion.div 
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="border border-red-500/30 rounded-2xl p-4"
                    style={{ background: 'rgba(248,113,113,0.1)' }}
                  >
                    <div className="w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center" style={{ background: 'rgba(248,113,113,0.2)' }}>
                      <div className="w-3 h-3 rounded-full" style={{ background: '#f87171' }} />
                    </div>
                    <p className="text-3xl font-bold" style={{ color: '#f87171' }}>{wrongCount}</p>
                    <p className="text-sm" style={{ color: '#A8A099' }}>Wrong</p>
                  </motion.div>
                </div>

                <div className="rounded-xl p-4 mb-8" style={{ background: 'rgba(212,168,83,0.05)', border: '1px solid rgba(212,168,83,0.15)' }}>
                  <div className="flex justify-between items-center text-sm" style={{ color: '#A8A099' }}>
                    <span>Progress</span>
                    <span>{answeredCount} / {quiz.questions.length} answered</span>
                  </div>
                  <div className="mt-2 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(answeredCount / quiz.questions.length) * 100}%` }}
                      transition={{ duration: 1, delay: 0.6 }}
                      className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
                    />
                  </div>
                </div>
              </motion.div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  onClick={() => navigate('/quiz-dashboard')} 
                  variant="outline" 
                  className="px-8 py-6 text-lg"
                  style={{ border: '1.5px solid rgba(212,168,83,0.3)', color: '#F5F0E6' }}
                >
                  <BarChart3 className="w-5 h-5 mr-2" />
                  Dashboard
                </Button>
                <Button 
                  onClick={() => window.location.reload()} 
                  className={`bg-gradient-to-r ${feedback.gradient} hover:opacity-90 px-8 py-6 text-lg`}
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Retake Quiz
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;
  const isLowTime = timeLeft < 60;

  return (
    <div className="min-h-screen py-6 px-4 -mt-16" style={{ background: 'linear-gradient(135deg,#0A0A0F 0%,#121218 50%,#0A0A0F 100%)' }}>
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all border"
            style={{ background: 'rgba(26,26,36,0.8)', backdropFilter: 'blur(10px)', color: '#F5F0E6', borderColor: 'rgba(212,168,83,0.2)' }}
          >
            <IoMdArrowRoundBack size={20} />
            <span className="hidden sm:inline">Exit Quiz</span>
          </motion.button>

          <div className="flex items-center gap-4">
            <Badge className={`${getDifficultyColor(question.difficulty)} border hidden sm:flex`}>
              {question.difficulty}
            </Badge>
            <motion.div 
              animate={isLowTime ? { scale: [1, 1.05, 1] } : {}}
              transition={{ duration: 0.5, repeat: isLowTime ? Infinity : 0 }}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl backdrop-blur border ${
                isLowTime 
                  ? 'bg-red-500/20 border-red-500/50' 
                  : 'border-amber-500/30'
              }`}
              style={isLowTime ? { color: '#f87171' } : { background: 'rgba(212,168,83,0.1)', color: '#D4A853' }}
            >
              <Clock className={`w-5 h-5 ${isLowTime ? 'animate-pulse' : ''}`} />
              <span className="font-bold text-lg font-mono">{formatTime(timeLeft)}</span>
            </motion.div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex justify-between items-center mb-2">
            <h1 className="text-xl sm:text-2xl font-bold truncate pr-4" style={{ color: '#F5F0E6' }}>{quiz.title}</h1>
            <span className="text-sm font-medium whitespace-nowrap" style={{ color: '#A8A099' }}>
              {currentQuestion + 1} / {quiz.questions.length}
            </span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
              className="h-full bg-gradient-to-r from-amber-500 to-orange-500"
            />
          </div>
          <div className="flex justify-between mt-1 text-xs" style={{ color: '#A8A099' }}>
            <span>{answeredCount} answered</span>
            <span>{quiz.questions.length - answeredCount} remaining</span>
          </div>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.2 }}
          >
            <Card className="mb-6 overflow-hidden" style={{ background: 'rgba(26,26,36,0.95)', backdropFilter: 'blur(20px)', border: '1px solid rgba(212,168,83,0.15)' }}>
              <CardHeader className="border-b py-4" style={{ background: 'rgba(212,168,83,0.05)', borderColor: 'rgba(212,168,83,0.1)' }}>
                <div className="flex justify-between items-center">
                  <Badge className={`${getDifficultyColor(question.difficulty)} border sm:hidden`}>
                    {question.difficulty}
                  </Badge>
                  <CardTitle className="text-lg" style={{ color: '#F5F0E6' }}>
                    Question {currentQuestion + 1}
                  </CardTitle>
                  <span className="font-semibold" style={{ color: '#D4A853' }}>
                    +{question.marks} {question.marks === 1 ? 'mark' : 'marks'}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-6 leading-relaxed" style={{ color: '#F5F0E6' }}>
                  {question.questionText}
                </h3>

                <div className="space-y-3">
                  {question.options.map((option, idx) => {
                    const isSelected = answers[currentQuestion] === idx;
                    const optionLetters = ['A', 'B', 'C', 'D'];
                    return (
                      <motion.div
                        key={idx}
                        whileHover={{ scale: 1.01, x: 4 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => handleAnswer(currentQuestion, idx)}
                        className={`p-4 rounded-xl border-2 cursor-pointer transition-all group relative overflow-hidden ${
                          isSelected
                            ? 'border-amber-500'
                            : 'border-amber-500/20 hover:border-amber-500/50'
                        }`}
                      >
                        <div className={`absolute left-0 top-0 bottom-0 w-1 ${
                          isSelected ? 'bg-amber-500' : 'bg-transparent'
                        }`} style={isSelected ? { background: '#D4A853' } : {}} />
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg transition-all ${
                            isSelected
                              ? 'text-white'
                              : 'text-slate-400 group-hover:text-slate-300'
                          }`} style={isSelected ? { background: '#D4A853' } : { background: 'rgba(212,168,83,0.1)' }}>
                            {optionLetters[idx]}
                          </div>
                          <span className="text-lg" style={{ color: isSelected ? '#F5F0E6' : '#A8A099' }}>
                            {option.optionText}
                          </span>
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="ml-auto"
                            >
                              <CheckCircle className="w-6 h-6" style={{ color: '#D4A853' }} />
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between items-center gap-4">
          <Button
            onClick={() => setCurrentQuestion(prev => prev - 1)}
            disabled={currentQuestion === 0}
            variant="outline"
            className="px-6"
            style={{ border: '1.5px solid rgba(212,168,83,0.3)', color: '#F5F0E6' }}
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            <span className="hidden sm:inline">Previous</span>
          </Button>
          
          <div className="flex gap-2 flex-wrap justify-center">
            {quiz.questions.map((_, idx) => (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setCurrentQuestion(idx)}
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full font-bold text-sm transition-all flex items-center justify-center ${
                  currentQuestion === idx
                    ? 'text-white ring-4'
                    : answers[idx] !== undefined
                    ? 'text-white'
                    : 'text-slate-400 hover:text-slate-300'
                }`}
                style={
                  currentQuestion === idx
                    ? { background: '#D4A853', ringColor: 'rgba(212,168,83,0.3)' }
                    : answers[idx] !== undefined
                    ? { background: '#22c55e' }
                    : { background: 'rgba(212,168,83,0.1)', border: '1px solid rgba(212,168,83,0.2)' }
                }
              >
                {idx + 1}
              </motion.button>
            ))}
          </div>
          
          {currentQuestion === quiz.questions.length - 1 ? (
            <Button 
              onClick={handleSubmit} 
              className="px-6"
              style={{ background: 'linear-gradient(135deg,#22c55e,#16a34a)', color: 'white' }}
            >
              Submit
              <CheckCircle className="w-5 h-5 ml-1" />
            </Button>
          ) : (
            <Button
              onClick={() => setCurrentQuestion(prev => prev + 1)}
              className="px-6"
              style={{ background: 'linear-gradient(135deg,#D4A853,#C8884A)', color: '#0A0A0F' }}
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-5 h-5 ml-1" />
            </Button>
          )}
        </div>

        <div className="mt-6 text-center text-sm" style={{ color: '#A8A099' }}>
          <p>Tip: Use <kbd className="px-2 py-1 rounded" style={{ background: 'rgba(212,168,83,0.1)', color: '#D4A853' }}>1-4</kbd> to select answers, <kbd className="px-2 py-1 rounded" style={{ background: 'rgba(212,168,83,0.1)', color: '#D4A853' }}>←</kbd> <kbd className="px-2 py-1 rounded" style={{ background: 'rgba(212,168,83,0.1)', color: '#D4A853' }}>→</kbd> to navigate</p>
        </div>
      </div>
    </div>
  );
};

export default QuizTake;

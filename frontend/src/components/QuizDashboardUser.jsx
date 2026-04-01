import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, Award, Clock, Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import axios from 'axios';
import { API } from '@/config/api';

const C = {
  obsidian: "#0A0A0F",
  charcoal: "#0D1017",
  surface: "#151820",
  gold: "#D4A853",
  goldLight: "#E8C17A",
  goldBorder: "rgba(212,168,83,0.15)",
  white: "#F5F0E6",
  muted: "#7A7F8A",
};

const QuizDashboardUser = () => {
  const navigate = useNavigate();
  const [quizResults, setQuizResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuizResults();
  }, []);

  const fetchQuizResults = async () => {
    try {
      const res = await axios.get(`${API.quizResult}/user`, { withCredentials: true });
      setQuizResults(res.data.results || []);
    } catch (error) {
      console.error('Failed to fetch quiz results');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryStats = () => {
    const categoryMap = {};
    quizResults.forEach(result => {
      const cat = result?.quiz?.category || 'Other';
      if (!categoryMap[cat]) {
        categoryMap[cat] = { total: 0, count: 0, best: 0 };
      }
      categoryMap[cat].total += result.percentage;
      categoryMap[cat].count += 1;
      categoryMap[cat].best = Math.max(categoryMap[cat].best, result.percentage);
    });
    
    return Object.entries(categoryMap).map(([category, data]) => ({
      category,
      average: Math.round(data.total / data.count),
      attempts: data.count,
      best: data.best
    })).sort((a, b) => b.average - a.average);
  };

  const categoryStats = getCategoryStats();

  const getScoreColor = (percentage) => {
    if (percentage >= 70) return "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30";
    if (percentage >= 40) return "bg-amber-500/20 text-amber-400 border border-amber-500/30";
    return "bg-red-500/20 text-red-400 border border-red-500/30";
  };

  return (
    <div className="space-y-8">
      {categoryStats.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="shadow-lg" style={{ background: C.charcoal, border: `1px solid ${C.goldBorder}` }}>
            <CardHeader className="rounded-t-lg" style={{ background: `linear-gradient(135deg, ${C.obsidian} 0%, ${C.surface} 100%)`, borderBottom: `1px solid ${C.goldBorder}` }}>
              <CardTitle className="text-2xl font-bold flex items-center gap-2" style={{ color: C.white }}>
                <Award className="w-6 h-6" style={{ color: C.gold }} />
                Performance by Category
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 md:p-6" style={{ background: C.charcoal }}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryStats.map((stat, idx) => (
                  <motion.div
                    key={stat.category}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: idx * 0.05 }}
                    whileHover={{ scale: 1.02 }}
                    className="rounded-xl p-4 transition-all"
                    style={{ background: C.surface, border: `1px solid ${C.goldBorder}` }}
                  >
                    <h3 className="font-bold text-lg mb-3" style={{ color: C.white }}>{stat.category}</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm" style={{ color: C.muted }}>Average:</span>
                        <Badge className={getScoreColor(stat.average)}>
                          {stat.average}%
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm" style={{ color: C.muted }}>Best Score:</span>
                        <span className="font-bold" style={{ color: C.gold }}>{stat.best}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm" style={{ color: C.muted }}>Attempts:</span>
                        <span className="font-semibold" style={{ color: C.white }}>{stat.attempts}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card className="shadow-lg" style={{ background: C.charcoal, border: `1px solid ${C.goldBorder}` }}>
          <CardHeader className="rounded-t-lg" style={{ background: `linear-gradient(135deg, ${C.obsidian} 0%, ${C.surface} 100%)`, borderBottom: `1px solid ${C.goldBorder}` }}>
            <CardTitle className="text-2xl font-bold flex items-center gap-2" style={{ color: C.white }}>
              <Brain className="w-6 h-6" style={{ color: C.gold }} />
              Quiz Results ({quizResults?.length || 0})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6" style={{ background: C.charcoal }}>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto" style={{ borderColor: C.gold }}></div>
              </div>
            ) : !quizResults || quizResults.length === 0 ? (
              <div className="text-center py-12">
                <Brain className="w-16 h-16 mx-auto mb-4" style={{ color: C.muted }} />
                <p className="text-lg" style={{ color: C.muted }}>No quiz attempts yet</p>
                <Button onClick={() => navigate('/quiz-dashboard')} className="mt-4" style={{ background: C.gold, color: C.obsidian }}>
                  Take a Quiz
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {quizResults.map((result, idx) => (
                  <motion.div
                    key={result._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    className="rounded-xl p-4 transition-all"
                    style={{ background: C.surface, border: `1px solid ${C.goldBorder}` }}
                  >
                    <h3 className="font-bold text-lg mb-2" style={{ color: C.white }}>{result?.quiz?.title}</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm" style={{ color: C.muted }}>Score:</span>
                        <span className="font-bold text-xl" style={{ color: C.gold }}>{result.score}/{result.totalMarks}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm" style={{ color: C.muted }}>Percentage:</span>
                        <Badge className={getScoreColor(result.percentage)}>
                          {result.percentage}%
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm" style={{ color: C.muted }}>
                        <Clock className="w-4 h-4" />
                        {Math.floor(result.timeTaken / 60)}m {result.timeTaken % 60}s
                      </div>
                      <div className="flex items-center gap-2 text-sm" style={{ color: C.muted }}>
                        <Calendar className="w-4 h-4" />
                        {new Date(result.createdAt).toLocaleDateString()}
                      </div>
                      <Badge style={{ borderColor: C.gold, color: C.gold, background: 'transparent' }} variant="outline" className="mt-2">{result?.quiz?.category}</Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default QuizDashboardUser;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AdminLayout from './AdminLayout';
import axios from 'axios';
import { toast } from 'sonner';
import { API } from '@/config/api';

const C = {
  obsidian: "#0A0A0F",
  charcoal: "#0D1017",
  surface: "#151820",
  surfaceLight: "#1C1F28",
  card: "#1A1D26",
  cardHover: "#22252F",
  gold: "#D4A853",
  goldLight: "#E8C17A",
  goldDim: "rgba(212,168,83,0.08)",
  goldBorder: "rgba(212,168,83,0.15)",
  goldBorderHover: "rgba(212,168,83,0.3)",
  white: "#F5F0E6",
  muted: "#7A7F8A",
  dim: "#2A2E3A",
};

const AdminQuizzes = () => {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API.quiz}/all`, { withCredentials: true });
      setQuizzes(res.data?.quizzes || []);
    } catch (error) {
      toast.error('Failed to fetch quizzes');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async (quiz) => {
    navigate(`/admin/quizzes/edit/${quiz._id}`);
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this quiz?')) return;
    try {
      await axios.delete(`${API.quiz}/${id}`, { withCredentials: true });
      toast.success('Quiz deleted successfully');
      fetchQuizzes();
    } catch (error) {
      toast.error('Failed to delete quiz');
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black" style={{ color: C.white }}>Manage <span style={{ color: C.gold }}>Quizzes</span></h1>
            <p className="mt-2" style={{ color: C.muted }}>Create and manage quiz questions</p>
          </div>
          <Button onClick={() => navigate('/admin/quizzes/create')} className="font-semibold" style={{ background: C.gold, color: C.obsidian }}>
            <Plus className="w-4 h-4 mr-2" />
            Create Quiz
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-64 rounded-xl animate-pulse" style={{ background: C.card }} />
            ))}
          </div>
        ) : quizzes.length === 0 ? (
          <div className="text-center py-16 rounded-3xl" style={{ background: C.card, border: `1px solid ${C.goldBorder}` }}>
            <p className="text-lg" style={{ color: C.muted }}>No quizzes yet. Create your first one!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz, idx) => (
              <motion.div 
                key={quiz._id} 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ delay: idx * 0.1 }} 
                whileHover={{ y: -5, scale: 1.02 }}
                className="rounded-2xl overflow-hidden border transition-all"
                style={{ background: C.card, borderColor: C.goldBorder }}>
                <div className="px-6 py-4" style={{ background: `linear-gradient(135deg, ${C.gold}, ${C.goldLight})` }}>
                  <h3 className="text-lg font-bold truncate" style={{ color: C.obsidian }}>{quiz.title}</h3>
                </div>
                <CardContent className="p-5">
                  <p className="text-sm mb-3 line-clamp-2" style={{ color: C.muted }}>{quiz.description || 'No description'}</p>
                  <div className="space-y-2 mb-4">
                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ background: C.goldDim, color: C.gold }}>{quiz.level}</span>
                      <span className="text-xs px-2 py-1 rounded-full font-medium" style={{ background: C.surface, color: C.muted }}>{quiz.category}</span>
                    </div>
                    <p className="text-sm" style={{ color: C.muted }}>{quiz.questions?.length || 0} questions</p>
                    <p className="text-sm" style={{ color: C.muted }}>{quiz.timeLimit || 10} minutes</p>
                    <p className="text-sm" style={{ color: C.muted }}>{quiz.totalMarks || 0} marks</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="flex-1 font-semibold" onClick={() => handleEdit(quiz)} style={{ background: C.goldDim, color: C.gold }}>
                      <Edit className="w-4 h-4 mr-1" /> Edit
                    </Button>
                    <Button size="sm" onClick={() => handleDelete(quiz._id)} style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444' }}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminQuizzes;

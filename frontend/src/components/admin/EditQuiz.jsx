import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, X, Upload, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { IoMdArrowRoundBack } from 'react-icons/io';
import axios from 'axios';
import { toast } from 'sonner';
import AdminLayout from './AdminLayout';
import { API } from '@/config/api';

const C = {
  obsidian: "#0A0A0F",
  charcoal: "#0D1017",
  surface: "#151820",
  surfaceLight: "#1C1F28",
  card: "#1A1D26",
  cardAlt: "#1E2129",
  cardHover: "#22252F",
  gold: "#D4A853",
  goldLight: "#E8C17A",
  goldDim: "rgba(212,168,83,0.08)",
  goldBorder: "rgba(212,168,83,0.15)",
  white: "#F5F0E6",
  muted: "#7A7F8A",
  dim: "#2A2E3A",
};

const CATEGORIES = ['Aptitude', 'Logical', 'Technical', 'Programming', 'General'];
const OPTION_LABELS = ['A', 'B', 'C', 'D'];
const BLANK_QUESTION = () => ({ questionText: '', difficulty: 'Easy', marks: 1, options: [{ optionText: '' }, { optionText: '' }], correctAnswer: 0 });

const EditQuiz = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ title: '', description: '', category: '', level: 'Beginner', timeLimit: 30, questions: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const fileRef = useRef(null);

  useEffect(() => { fetchQuiz(); }, [id]);

  const fetchQuiz = async () => {
    try {
      const res = await axios.get(`${API.quiz}/${id}`);
      const q = res.data.quiz;
      setFormData({ title:q.title, description:q.description, category:q.category, level:q.level, timeLimit:q.timeLimit, questions:q.questions });
      setImagePreview(q.categoryImage || '');
    } catch {
      toast.error('Failed to load quiz');
      navigate('/admin/quizzes');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('title',       formData.title);
      fd.append('description', formData.description);
      fd.append('category',    formData.category);
      fd.append('level',       formData.level);
      fd.append('timeLimit',   formData.timeLimit);
      fd.append('questions',   JSON.stringify(formData.questions));
      if (imageFile) fd.append('file', imageFile);

      await axios.put(`${API.quiz}/${id}`, fd, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Quiz updated successfully ✅');
      navigate('/admin/quizzes');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update quiz');
    } finally {
      setSaving(false);
    }
  };

  // ── question helpers ──
  const set = (fn) => setFormData(prev => ({ ...prev, questions: fn(prev.questions) }));
  const addQuestion    = ()        => set(qs => [...qs, BLANK_QUESTION()]);
  const removeQuestion = (qi)      => set(qs => qs.filter((_,i) => i !== qi));
  const updateQ        = (qi,k,v)  => set(qs => { const n=[...qs]; n[qi]={...n[qi],[k]:v}; return n; });
  const addOption      = (qi)      => set(qs => { const n=[...qs]; n[qi].options.push({optionText:''}); return n; });
  const removeOption   = (qi,oi)   => set(qs => {
    const n=[...qs];
    n[qi].options = n[qi].options.filter((_,i)=>i!==oi);
    if (n[qi].correctAnswer >= n[qi].options.length) n[qi].correctAnswer = 0;
    return n;
  });
  const updateOption   = (qi,oi,v) => set(qs => { const n=[...qs]; n[qi].options[oi].optionText=v; return n; });

  if (loading) return (
    <AdminLayout>
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16" style={{ borderBottomColor: C.gold, borderColor: 'transparent' }} />
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      <div className="max-w-5xl mx-auto">
        <Card className="shadow-2xl" style={{ border: `2px solid ${C.goldBorder}`, backgroundColor: C.card }}>
          <CardHeader className="text-white" style={{ background: 'linear-gradient(to right, #C8884A, #D4A853)' }}>
            <CardTitle className="text-2xl">✏️ Edit Quiz</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* Basic Info */}
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: C.white }}>Quiz Title *</label>
                  <Input placeholder="Enter quiz title" value={formData.title} required
                    onChange={e => setFormData(p=>({...p,title:e.target.value}))}
                    className="border-2" style={{ borderColor: C.goldBorder, backgroundColor: C.dim, color: C.white }} />
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: C.white }}>Description</label>
                  <Textarea placeholder="Enter quiz description" rows={3} value={formData.description}
                    onChange={e => setFormData(p=>({...p,description:e.target.value}))}
                    className="border-2" style={{ borderColor: C.goldBorder, backgroundColor: C.dim, color: C.white }} />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: C.white }}>Category Image</label>
                  <label className="flex items-center gap-4 p-4 border-2 border-dashed rounded-2xl cursor-pointer transition-all group" style={{ borderColor: C.goldBorder, backgroundColor: C.dim }}>
                    {imagePreview ? (
                      <img src={imagePreview} alt="preview" className="w-16 h-16 object-cover rounded-xl" />
                    ) : (
                      <div className="w-16 h-16 rounded-xl flex items-center justify-center" style={{ backgroundColor: C.goldDim }}>
                        <Upload size={24} style={{ color: C.gold }} />
                      </div>
                    )}
                    <div>
                      <p className="font-bold transition-colors" style={{ color: C.white }}>
                        {imageFile ? imageFile.name : 'Click to change image'}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: C.muted }}>PNG · JPG · WEBP</p>
                    </div>
                    {imageFile && <CheckCircle2 size={20} className="text-emerald-500 ml-auto" />}
                    <input ref={fileRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>
                </div>
              </div>

              {/* Meta */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: C.white }}>Category *</label>
                  <select value={formData.category} required
                    onChange={e => setFormData(p=>({...p,category:e.target.value}))}
                    className="w-full px-3 py-2 border-2 rounded-lg outline-none" style={{ borderColor: C.goldBorder, backgroundColor: C.dim, color: C.white }}>
                    <option value="">Select Category</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: C.white }}>Level *</label>
                  <select value={formData.level}
                    onChange={e => setFormData(p=>({...p,level:e.target.value}))}
                    className="w-full px-3 py-2 border-2 rounded-lg outline-none" style={{ borderColor: C.goldBorder, backgroundColor: C.dim, color: C.white }}>
                    <option value="Beginner">🟢 Beginner</option>
                    <option value="Intermediate">🟡 Intermediate</option>
                    <option value="Advanced">🔴 Advanced</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: C.white }}>Time Limit (min) *</label>
                  <Input type="number" min="1" value={formData.timeLimit} required
                    onChange={e => setFormData(p=>({...p,timeLimit:parseInt(e.target.value)}))}
                    className="border-2" style={{ borderColor: C.goldBorder, backgroundColor: C.dim, color: C.white }} />
                </div>
              </div>

              {/* Questions */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold" style={{ color: C.white }}>📝 Questions</h3>
                  <Button type="button" onClick={addQuestion} variant="outline"
                    className="border-2" style={{ borderColor: C.gold, color: C.gold }}>
                    <Plus className="w-4 h-4 mr-2" /> Add Question
                  </Button>
                </div>

                {formData.questions.map((q, qi) => (
                  <Card key={qi} className="p-6 border-2" style={{ backgroundColor: C.cardAlt, borderColor: C.goldBorder }}>
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="text-lg font-bold" style={{ color: C.gold }}>Question {qi + 1}</h4>
                      {formData.questions.length > 1 && (
                        <Button type="button" onClick={() => removeQuestion(qi)} variant="ghost" size="sm" style={{ color: '#ef4444' }}>
                          <X className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <div className="space-y-4">
                      <Textarea placeholder="Enter your question here" value={q.questionText} required
                        onChange={e => updateQ(qi,'questionText',e.target.value)}
                        className="border-2" style={{ borderColor: C.goldBorder, backgroundColor: C.dim, color: C.white }} />

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-bold mb-2" style={{ color: C.white }}>Difficulty</label>
                          <select value={q.difficulty} onChange={e => updateQ(qi,'difficulty',e.target.value)}
                            className="w-full px-3 py-2 border-2 rounded-lg outline-none" style={{ borderColor: C.goldBorder, backgroundColor: C.dim, color: C.white }}>
                            <option value="Easy">😊 Easy</option>
                            <option value="Medium">😐 Medium</option>
                            <option value="Hard">😰 Hard</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-bold mb-2" style={{ color: C.white }}>Marks</label>
                          <Input type="number" min="1" value={q.marks}
                            onChange={e => updateQ(qi,'marks',parseInt(e.target.value))}
                            className="border-2" style={{ borderColor: C.goldBorder, backgroundColor: C.dim, color: C.white }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-3">
                          <label className="block text-sm font-bold" style={{ color: C.white }}>Options (select correct)</label>
                          <Button type="button" onClick={() => addOption(qi)} variant="outline" size="sm" className="text-xs" style={{ borderColor: C.goldBorder, color: C.gold }}>
                            <Plus className="w-3 h-3 mr-1" /> Add Option
                          </Button>
                        </div>
                        <div className="space-y-2">
                          {q.options.map((opt, oi) => (
                            <div key={oi} className="flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full text-white font-bold text-sm flex items-center justify-center flex-shrink-0" style={{ backgroundColor: C.gold }}>
                                {OPTION_LABELS[oi]}
                              </div>
                              <Input placeholder={`Option ${OPTION_LABELS[oi]}`} value={opt.optionText} required
                                onChange={e => updateOption(qi,oi,e.target.value)}
                                className="flex-1 border-2" style={{ borderColor: C.goldBorder, backgroundColor: C.dim, color: C.white }} />
                              <input type="radio" name={`correct-${qi}`} checked={q.correctAnswer===oi}
                                onChange={() => updateQ(qi,'correctAnswer',oi)}
                                className="w-5 h-5 cursor-pointer" style={{ accentColor: '#10b981' }} title="Mark as correct" />
                              {q.options.length > 2 && (
                                <Button type="button" onClick={() => removeOption(qi,oi)} variant="ghost" size="sm" style={{ color: '#ef4444' }}>
                                  <X className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          ))}
                        </div>
                        <p className="text-xs mt-2" style={{ color: C.muted }}>✅ Select the radio button to mark the correct answer</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <Button type="submit" disabled={saving}
                className="w-full text-lg py-6 text-white" style={{ background: 'linear-gradient(to right, #C8884A, #D4A853)' }}>
                {saving ? 'Saving...' : '💾 Update Quiz'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default EditQuiz;

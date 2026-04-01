import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plus, X, Upload, CheckCircle2, Brain, Clock, Tag, FileText, Sparkles, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
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
  cardHover: "#22252F",
  gold: "#D4A853",
  goldLight: "#E8C17A",
  goldDim: "rgba(212,168,83,0.08)",
  goldBorder: "rgba(212,168,83,0.15)",
  white: "#F5F0E6",
  muted: "#7A7F8A",
  dim: "#2A2E3A",
};

const CATEGORIES = [
  "Software Development", "Web Development", "Android Development", "Cybersecurity",
  "UI/UX Design", "Cloud Computing", "Data Science", "Machine Learning",
  "Java Full Stack Developer", "Python Full Stack Developer", "JS Full Stack Developer",
  "DevOps", "AI/ML with Python", "Blockchain Developer", "Game Development",
];

const DIFF_COLORS = {
  Easy: { bg: '#10b981', text: '#fff' },
  Medium: { bg: '#f59e0b', text: '#000' },
  Hard: { bg: '#ef4444', text: '#fff' },
};

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

const BLANK_Q = () => ({ question: '', options: [{ optionText: '' }, { optionText: '' }, { optionText: '' }, { optionText: '' }], correctAnswer: 0, marks: 1 });

const CreateQuiz = () => {
  const navigate = useNavigate();
  const fileRef = useRef();
  const [formData, setFormData] = useState({ title: '', description: '', category: '', level: 'Beginner', timeLimit: 10, questions: [BLANK_Q()] });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageChange = e => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!formData.category) return toast.error('Please select a category');
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append('title', formData.title);
      fd.append('description', formData.description);
      fd.append('category', formData.category);
      fd.append('level', formData.level);
      fd.append('timeLimit', formData.timeLimit);
      fd.append('questions', JSON.stringify(formData.questions));
      if (imageFile) fd.append('file', imageFile);
      await axios.post(`${API.quiz}/create`, fd, { withCredentials: true, headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Quiz created successfully!');
      navigate('/admin/all-quizzes');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create quiz');
    } finally { setLoading(false); }
  };

  const setQ = fn => setFormData(p => ({ ...p, questions: fn(p.questions) }));
  const addQ = () => setQ(qs => [...qs, BLANK_Q()]);
  const removeQ = qi => setQ(qs => qs.filter((_,i) => i !== qi));
  const updateQ = (qi,k,v) => setQ(qs => { const n=[...qs]; n[qi]={...n[qi],[k]:v}; return n; });
  const addOpt = qi => setQ(qs => { const n=[...qs]; n[qi].options.push({optionText:''}); return n; });
  const removeOpt = (qi,oi) => setQ(qs => { const n=[...qs]; n[qi].options=n[qi].options.filter((_,i)=>i!==oi); if(n[qi].correctAnswer>=n[qi].options.length) n[qi].correctAnswer=0; return n; });
  const updateOpt = (qi,oi,v) => setQ(qs => { const n=[...qs]; n[qi].options[oi].optionText=v; return n; });

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto">

        {/* Hero Banner */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#C8884A] via-[#D4A853] to-[#E8C17A] p-8 shadow-2xl" style={{ background: 'linear-gradient(to right, #C8884A, #D4A853, #E8C17A)' }}>
            <div className="absolute top-0 right-0 w-56 h-56 bg-white opacity-5 rounded-full -mr-16 -mt-16" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-white opacity-5 rounded-full -ml-12 -mb-12" />
            <div className="relative flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-xl flex-shrink-0">
                <Brain className="h-9 w-9 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full font-medium">Admin Panel</span>
                  <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full font-medium">{formData.questions.length} Question{formData.questions.length !== 1 ? 's' : ''}</span>
                </div>
                <h1 className="text-3xl font-black text-white mb-1">Create New Quiz</h1>
                <p className="text-[#E8C17A] text-sm flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" />Build engaging quizzes for your platform
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Basic Info Card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card className="border-0 shadow-xl rounded-3xl overflow-hidden" style={{ backgroundColor: C.card }}>
              <div className="px-8 py-5 border-b flex items-center gap-3" style={{ borderColor: C.goldBorder, background: 'linear-gradient(to right, #1A1D26, #252532)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md" style={{ background: 'linear-gradient(to bottom right, #D4A853, #C8884A)' }}>
                    <FileText className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-sm" style={{ color: C.white }}>Quiz Information</p>
                    <p className="text-xs" style={{ color: C.muted }}>Basic details about your quiz</p>
                  </div>
                </div>
              </div>
              <CardContent className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2 space-y-2">
                    <Label className="font-bold text-sm" style={{ color: C.white }}>Quiz Title *</Label>
                    <Input placeholder="e.g. Advanced JavaScript Concepts" value={formData.title} required
                      onChange={e => setFormData(p=>({...p,title:e.target.value}))}
                      className="h-12 border-2 rounded-xl transition-all" style={{ borderColor: C.goldBorder, backgroundColor: C.dim, color: C.white }} />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <Label className="font-bold text-sm" style={{ color: C.white }}>Description</Label>
                    <Textarea placeholder="Describe what this quiz covers..." rows={3} value={formData.description}
                      onChange={e => setFormData(p=>({...p,description:e.target.value}))}
                      className="border-2 rounded-xl transition-all resize-none" style={{ borderColor: C.goldBorder, backgroundColor: C.dim, color: C.white }} />
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <Label className="font-bold text-sm flex items-center gap-2" style={{ color: C.white }}>
                      <Tag className="w-3.5 h-3.5" style={{ color: C.gold }} />Category *
                    </Label>
                    <select value={formData.category} required onChange={e => setFormData(p=>({...p,category:e.target.value}))}
                      className="w-full h-12 px-4 border-2 rounded-xl outline-none transition-all text-sm font-medium" style={{ borderColor: C.goldBorder, backgroundColor: C.dim, color: C.white }}>
                      <option value="">Select Category</option>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  {/* Level */}
                  <div className="space-y-2">
                    <Label className="font-bold text-sm flex items-center gap-2" style={{ color: C.white }}>
                      <Sparkles className="w-3.5 h-3.5" style={{ color: C.gold }} />Difficulty Level *
                    </Label>
                    <select value={formData.level} onChange={e => setFormData(p=>({...p,level:e.target.value}))}
                      className="w-full h-12 px-4 border-2 rounded-xl outline-none transition-all text-sm font-medium" style={{ borderColor: C.goldBorder, backgroundColor: C.dim, color: C.white }}>
                      <option value="Beginner">🟢 Beginner</option>
                      <option value="Intermediate">🟡 Intermediate</option>
                      <option value="Advanced">🔴 Advanced</option>
                    </select>
                  </div>

                  {/* Time Limit */}
                  <div className="space-y-2">
                    <Label className="font-bold text-sm flex items-center gap-2" style={{ color: C.white }}>
                      <Clock className="w-3.5 h-3.5" style={{ color: C.gold }} />Time Limit (minutes) *
                    </Label>
                    <Input type="number" min="1" value={formData.timeLimit} required
                      onChange={e => setFormData(p=>({...p,timeLimit:parseInt(e.target.value)}))}
                      className="h-12 border-2 rounded-xl transition-all" style={{ borderColor: C.goldBorder, backgroundColor: C.dim, color: C.white }} />
                  </div>

                  {/* Image Upload */}
                  <div className="space-y-2">
                    <Label className="font-bold text-sm flex items-center gap-2" style={{ color: C.white }}>
                      <Upload className="w-3.5 h-3.5" style={{ color: C.gold }} />Category Image
                    </Label>
                    <label className="flex items-center gap-3 h-12 px-4 border-2 border-dashed rounded-xl cursor-pointer transition-all group" style={{ borderColor: C.goldBorder, backgroundColor: C.dim }}>
                      {imagePreview
                        ? <img src={imagePreview} className="w-8 h-8 object-cover rounded-lg" />
                        : <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: C.goldDim }}><Upload className="w-4 h-4" style={{ color: C.gold }} /></div>}
                      <span className="text-sm truncate" style={{ color: C.muted }}>
                        {imageFile ? imageFile.name : 'Click to upload image'}
                      </span>
                      {imageFile && <CheckCircle2 className="w-4 h-4 text-emerald-500 ml-auto flex-shrink-0" />}
                      <input ref={fileRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Questions */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-md" style={{ background: 'linear-gradient(to bottom right, #D4A853, #C8884A)' }}>
                  <Brain className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-bold" style={{ color: C.white }}>Questions</p>
                  <p className="text-xs" style={{ color: C.muted }}>{formData.questions.length} question{formData.questions.length !== 1 ? 's' : ''} added</p>
                </div>
              </div>
              <Button type="button" onClick={addQ}
                className="shadow-lg h-10 px-5 rounded-xl text-white" style={{ background: 'linear-gradient(to right, #C8884A, #D4A853)' }}>
                <Plus className="w-4 h-4 mr-2" />Add Question
              </Button>
            </div>

            <div className="space-y-4">
              {formData.questions.map((q, qi) => {
                const dc = DIFF_COLORS[q.difficulty] || DIFF_COLORS.Easy;
                return (
                  <Card key={qi} className="border-0 shadow-lg rounded-3xl overflow-hidden" style={{ backgroundColor: C.card }}>
                    <div className="h-1" style={{ background: 'linear-gradient(to right, #C8884A, #D4A853, #E8C17A)' }} />
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-md" style={{ background: 'linear-gradient(to bottom right, #D4A853, #C8884A)' }}>
                            {qi + 1}
                          </div>
                          <span className="text-xs font-bold px-2.5 py-1 rounded-full border"
                            style={{ background: dc.bg, color: dc.text, borderColor: dc.border }}>
                            {q.difficulty}
                          </span>
                          <span className="text-xs font-medium" style={{ color: C.muted }}>{q.marks} mark{q.marks !== 1 ? 's' : ''}</span>
                        </div>
                        {formData.questions.length > 1 && (
                          <Button type="button" onClick={() => removeQ(qi)} variant="ghost" size="sm"
                            className="hover:bg-red-900/30 rounded-xl" style={{ color: '#ef4444' }}>
                            <X className="w-4 h-4" />
                          </Button>
                        )}
                      </div>

                      <Textarea placeholder="Enter your question here..." value={q.questionText} required
                        onChange={e => updateQ(qi,'questionText',e.target.value)}
                        className="border-2 rounded-xl transition-all resize-none mb-4" rows={2} style={{ borderColor: C.goldBorder, backgroundColor: C.dim, color: C.white }} />

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="space-y-1.5">
                          <Label className="text-xs font-bold" style={{ color: C.muted }}>Difficulty</Label>
                          <select value={q.difficulty} onChange={e => updateQ(qi,'difficulty',e.target.value)}
                            className="w-full h-10 px-3 border-2 rounded-xl outline-none text-sm font-medium" style={{ borderColor: C.goldBorder, backgroundColor: C.dim, color: C.white }}>
                            <option value="Easy">😊 Easy</option>
                            <option value="Medium">😐 Medium</option>
                            <option value="Hard">😰 Hard</option>
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs font-bold" style={{ color: C.muted }}>Marks</Label>
                          <Input type="number" min="1" value={q.marks}
                            onChange={e => updateQ(qi,'marks',parseInt(e.target.value))}
                            className="h-10 border-2 rounded-xl transition-all" style={{ borderColor: C.goldBorder, backgroundColor: C.dim, color: C.white }} />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label className="text-xs font-bold" style={{ color: C.muted }}>Options — select correct answer</Label>
                          <Button type="button" onClick={() => addOpt(qi)} variant="outline" size="sm"
                            className="h-7 text-xs rounded-lg" style={{ borderColor: C.goldBorder, color: C.gold }}>
                            <Plus className="w-3 h-3 mr-1" />Add
                          </Button>
                        </div>
                        {q.options.map((opt, oi) => (
                          <div key={oi} className="flex items-center gap-2">
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0 transition-all ${q.correctAnswer === oi ? 'bg-emerald-500 text-white shadow-md' : ''}`} style={q.correctAnswer !== oi ? { backgroundColor: C.dim, color: C.muted } : {}}>
                              {OPTION_LABELS[oi]}
                            </div>
                            <Input placeholder={`Option ${OPTION_LABELS[oi]}`} value={opt.optionText} required
                              onChange={e => updateOpt(qi,oi,e.target.value)}
                              className={`flex-1 h-10 border-2 rounded-xl transition-all text-sm`} style={q.correctAnswer === oi ? { borderColor: '#10b981', backgroundColor: 'rgba(16,185,129,0.1)', color: C.white } : { borderColor: C.goldBorder, backgroundColor: C.dim, color: C.white }} />
                            <button type="button" onClick={() => updateQ(qi,'correctAnswer',oi)}
                              className={`w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${q.correctAnswer === oi ? 'border-emerald-500 bg-emerald-500' : ''}`}
                              style={q.correctAnswer !== oi ? { borderColor: C.goldBorder } : {}}>
                              {q.correctAnswer === oi && <CheckCircle2 className="w-4 h-4 text-white" />}
                            </button>
                            {q.options.length > 2 && (
                              <button type="button" onClick={() => removeOpt(qi,oi)}
                                className="w-7 h-7 rounded-lg flex items-center justify-center transition-all flex-shrink-0" style={{ color: '#ef4444' }}>
                                <X className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        ))}
                        <p className="text-xs mt-1" style={{ color: C.muted }}>Click the circle to mark the correct answer</p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </motion.div>

          {/* Submit */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Button type="submit" disabled={loading}
              className="w-full h-14 rounded-2xl text-lg font-bold shadow-xl hover:shadow-2xl transition-all text-white" style={{ background: 'linear-gradient(to right, #C8884A, #D4A853, #E8C17A)' }}>
              {loading
                ? <><Loader2 className="mr-2 h-5 w-5 animate-spin" />Creating Quiz...</>
                : <><Sparkles className="mr-2 h-5 w-5" />Create Quiz</>}
            </Button>
          </motion.div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default CreateQuiz;

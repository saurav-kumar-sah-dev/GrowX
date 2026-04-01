import React from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Briefcase, Calendar, MapPin } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useNavigate } from 'react-router-dom';

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

const JobDashboardUser = () => {
  const { allAppliedJobs } = useSelector((state) => state.job);
  const navigate = useNavigate();

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
      accepted: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30",
      rejected: "bg-red-500/20 text-red-400 border border-red-500/30",
    };
    return colors[status] || "bg-gray-500/20 text-gray-400 border border-gray-500/30";
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="shadow-lg" style={{ background: C.charcoal, border: `1px solid ${C.goldBorder}` }}>
        <CardHeader className="rounded-t-lg" style={{ background: `linear-gradient(135deg, ${C.obsidian} 0%, ${C.surface} 100%)`, borderBottom: `1px solid ${C.goldBorder}` }}>
          <CardTitle className="text-2xl font-bold" style={{ color: C.white }}>
            Applied Jobs ({allAppliedJobs?.length || 0})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6" style={{ background: C.charcoal }}>
          {!allAppliedJobs || allAppliedJobs.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="w-16 h-16 mx-auto mb-4" style={{ color: C.muted }} />
              <p style={{ color: C.muted }} className="text-lg">No jobs applied yet</p>
              <Button 
                onClick={() => navigate('/joball')} 
                className="mt-4"
                style={{ background: C.gold, color: C.obsidian }}
              >
                Browse Jobs
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {allAppliedJobs.map((item, index) => (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.01 }}
                  className="rounded-xl p-4 transition-all"
                  style={{ background: C.surface, border: `1px solid ${C.goldBorder}` }}
                >
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={item?.job?.company?.logo} />
                          <AvatarFallback style={{ background: C.gold, color: C.obsidian }}>
                            {item?.job?.company?.name?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg" style={{ color: C.white }}>{item?.job?.title}</h3>
                          <p style={{ color: C.muted }}>{item?.job?.company?.name}</p>
                          <div className="flex flex-wrap gap-3 mt-2 text-sm" style={{ color: C.muted }}>
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {item?.job?.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <Briefcase className="w-4 h-4" />
                              {item?.job?.jobType}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              Applied: {new Date(item?.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={getStatusColor(item?.status)}>
                        {item?.status?.toUpperCase()}
                      </Badge>
                      <Button
                        onClick={() => navigate(`/description/${item?.job?._id}`)}
                        size="sm"
                        style={{ borderColor: C.gold, color: C.gold, background: 'transparent' }}
                      >
                        View Details
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default JobDashboardUser;

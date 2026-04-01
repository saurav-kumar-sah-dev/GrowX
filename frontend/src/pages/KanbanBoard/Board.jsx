import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { IoMdArrowRoundBack } from "react-icons/io";

const API_URL = import.meta.env.VITE_KANBAN_BOARD_API;

const statusConfig = {
  todo: { gradient: "from-blue-500 to-cyan-500", icon: "📋", label: "To Do" },
  thisweek: { gradient: "from-purple-500 to-pink-500", icon: "📅", label: "This Week" },
  inprocess: { gradient: "from-orange-500 to-yellow-500", icon: "⚡", label: "In Process" },
  done: { gradient: "from-green-500 to-emerald-500", icon: "✅", label: "Done" },
};

export default function Board() {
  const [tasks, setTasks] = useState({ todo: [], thisweek: [], inprocess: [], done: [] });
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${API_URL}/get`);
      const grouped = { todo: [], thisweek: [], inprocess: [], done: [] };
      response.data.forEach((task) => {
        if (grouped[task.status]) grouped[task.status].push(task);
      });
      setTasks(grouped);
    } catch (error) {
      toast.error("Failed to fetch tasks");
    }
  };

  const onDragEnd = async (result) => {
    const { destination, source, draggableId } = result;
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) return;

    const sourceCol = [...tasks[source.droppableId]];
    const destCol = source.droppableId === destination.droppableId ? sourceCol : [...tasks[destination.droppableId]];
    const [movedTask] = sourceCol.splice(source.index, 1);
    destCol.splice(destination.index, 0, movedTask);

    setTasks({
      ...tasks,
      [source.droppableId]: sourceCol,
      [destination.droppableId]: destCol,
    });

    try {
      await axios.put(`${API_URL}/update/${draggableId}`, { status: destination.droppableId });
      toast.success("Task moved successfully!");
    } catch (error) {
      toast.error("Failed to update task");
      fetchTasks();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 px-4 py-10">
      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        whileHover={{ scale: 1.05, x: -5 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 bg-white text-gray-800 px-4 py-2 rounded-xl font-bold hover:bg-gray-100 transition-all shadow-md"
      >
        <IoMdArrowRoundBack size={24} />
        Back
      </motion.button>

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
        <h2 className="text-4xl md:text-5xl font-black text-gray-800 mb-4">📊 Drag & Drop Board</h2>
        <p className="text-gray-600 mb-6">Drag tasks between columns to update status</p>
        <button onClick={() => navigate("/taskForm")} className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all">
          ➕ Add Task
        </button>
      </motion.div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {Object.keys(tasks).map((status, index) => (
            <motion.div key={status} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
              <div className={`bg-gradient-to-r ${statusConfig[status].gradient} text-white rounded-t-2xl p-4 shadow-lg`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{statusConfig[status].icon}</span>
                    <h3 className="font-bold text-lg">{statusConfig[status].label}</h3>
                  </div>
                  <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold">{tasks[status].length}</span>
                </div>
              </div>

              <Droppable droppableId={status}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`bg-white/60 backdrop-blur-sm rounded-b-2xl p-4 shadow-lg min-h-[400px] transition-all ${
                      snapshot.isDraggingOver ? "bg-white/80 ring-2 ring-indigo-400" : ""
                    }`}
                  >
                    {tasks[status].map((task, index) => (
                      <Draggable key={task._id} draggableId={task._id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`bg-white border-2 border-gray-200 p-4 rounded-xl mb-3 shadow-md hover:shadow-lg transition-all cursor-move ${
                              snapshot.isDragging ? "rotate-2 scale-105 shadow-2xl" : ""
                            }`}
                          >
                            <h4 className="font-bold text-gray-800 mb-2">{task.title}</h4>
                            <p className="text-sm text-gray-600 line-clamp-2">{task.description}</p>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </motion.div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
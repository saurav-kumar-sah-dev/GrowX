import React from "react";
import { Draggable } from "react-beautiful-dnd";

const statusConfig = {
  todo: { gradient: "from-blue-500 to-cyan-500", icon: "📋", bg: "bg-blue-50" },
  thisweek: { gradient: "from-purple-500 to-pink-500", icon: "📅", bg: "bg-purple-50" },
  inprocess: { gradient: "from-orange-500 to-yellow-500", icon: "⚡", bg: "bg-orange-50" },
  done: { gradient: "from-green-500 to-emerald-500", icon: "✅", bg: "bg-green-50" },
};

export default function Column({ status, tasks = [] }) {
  const config = statusConfig[status] || statusConfig.todo;

  return (
    <div className="flex flex-col h-full">
      <div className={`bg-gradient-to-r ${config.gradient} text-white rounded-t-2xl p-4 shadow-lg`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{config.icon}</span>
            <h3 className="font-bold text-lg capitalize">{status.replace(/([A-Z])/g, ' $1').trim()}</h3>
          </div>
          <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold">
            {tasks.length}
          </span>
        </div>
      </div>

      <div className={`${config.bg} rounded-b-2xl p-4 shadow-lg flex-1 min-h-[400px] space-y-3`}>
        {tasks.length > 0 ? (
          tasks.map((task, index) => (
            <Draggable key={task._id} draggableId={task._id} index={index}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  className={`bg-white border-2 border-gray-200 p-4 rounded-xl shadow-md hover:shadow-lg transition-all cursor-move ${
                    snapshot.isDragging ? "rotate-2 scale-105 shadow-2xl" : ""
                  }`}
                >
                  <h4 className="font-bold text-gray-800 mb-2">{task.title}</h4>
                  <p className="text-sm text-gray-600 line-clamp-2">{task.description}</p>
                </div>
              )}
            </Draggable>
          ))
        ) : (
          <div className="text-center py-12 text-gray-400">
            <p className="text-4xl mb-2">📭</p>
            <p className="text-sm">No tasks</p>
          </div>
        )}
      </div>
    </div>
  );
}
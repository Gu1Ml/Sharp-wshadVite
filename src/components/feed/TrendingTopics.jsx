import React from "react";
import { TrendingUp, Hash } from "lucide-react";

export default function TrendingTopics() {
  const topics = [
    { tag: "react", posts: 1234 },
    { tag: "javascript", posts: 987 },
    { tag: "typescript", posts: 756 },
    { tag: "nextjs", posts: 543 },
    { tag: "tailwind", posts: 432 }
  ];

  return (
    <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-6">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-purple-400" />
        <h3 className="font-semibold text-white">Tópicos em Alta</h3>
      </div>
      <div className="space-y-3">
        {topics.map((topic, index) => (
          <div key={topic.tag} className="flex items-center justify-between hover:bg-slate-800/50 rounded-lg p-2 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-500 w-4">#{index + 1}</span>
              <div>
                <div className="flex items-center gap-1">
                  <Hash className="w-3 h-3 text-slate-400" />
                  <span className="text-sm font-medium text-white">{topic.tag}</span>
                </div>
                <p className="text-xs text-slate-500">{topic.posts.toLocaleString('pt-BR')} posts</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
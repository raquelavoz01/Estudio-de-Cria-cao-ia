import React from 'react';
import { View, Plan } from '../types';
import { NAV_ITEMS } from '../constants';
import { LockIcon } from './Icons';

interface SidebarProps {
  activeView: View;
  setActiveView: (view: View) => void;
  userPlan: Plan;
}

const planLevels: { [key in Plan]: number } = {
  escritor: 1,
  arquiteto: 2,
  mestre: 3,
};

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, userPlan }) => {
  return (
    <nav className="w-64 bg-slate-950/70 border-r border-slate-800 p-4 flex flex-col overflow-y-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
          Ferramentas
        </h2>
      </div>
      <ul className="space-y-2">
        {NAV_ITEMS.map((item, index) => {
          if ('isSeparator' in item) {
            return (
              <li key={`separator-${index}`} className="pt-4 pb-2 px-2">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{item.label}</span>
              </li>
            );
          }
          
          const userLevel = planLevels[userPlan];
          const itemLevel = planLevels[item.plan];
          const isLocked = itemLevel > userLevel;

          return (
            <li key={item.id}>
              <button
                onClick={() => !isLocked && setActiveView(item.id)}
                disabled={isLocked}
                className={`w-full flex items-center justify-between gap-3 px-4 py-2 rounded-lg text-left transition-all duration-200 ${
                  activeView === item.id
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                } ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <div className="flex items-center gap-3">
                    {item.icon}
                    <span className="font-medium">{item.label}</span>
                </div>
                {isLocked && <LockIcon />}
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default Sidebar;
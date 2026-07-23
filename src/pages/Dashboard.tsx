import { useState } from 'react';

const Dashboard = () => {
  const [xp, setXp] = useState(0);
  const maxXp = 154;

  const skillTrees = [
    {
      name: 'Vitality',
      icon: '🌳',
      color: 'var(--vitality)',
      description: 'Physical & mental wellness',
      level: 5,
      points: 12
    },
    {
      name: 'Intellect',
      icon: '📚',
      color: 'var(--intellect)',
      description: 'Learning & creativity',
      level: 3,
      points: 8
    },
    {
      name: 'Charisma',
      icon: '💬',
      color: 'var(--charisma)',
      description: 'Social connections',
      level: 4,
      points: 10
    },
    {
      name: 'Willpower',
      icon: '⚔️',
      color: 'var(--willpower)',
      description: 'Discipline & focus',
      level: 6,
      points: 15
    }
  ];

  const achievements = [
    { id: 1, name: 'First Quest', icon: '🎯', description: 'Complete your first task', unlocked: true },
    { id: 2, name: 'Streak Master', icon: '🔥', description: '7-day streak', unlocked: true },
    { id: 3, name: 'Social Butterfly', icon: '🦋', description: 'Connect with 10 adventurers', unlocked: false },
    { id: 4, name: 'Knowledge Seeker', icon: '🏛️', description: 'Complete 25 learning quests', unlocked: false },
    { id: 5, name: 'Early Bird', icon: '🌅', description: 'Complete task before 6 AM', unlocked: true },
    { id: 6, name: 'Night Owl', icon: '🦉', description: 'Complete task after midnight', unlocked: false }
  ];

  const tavernEntries = [
    {
      id: 1,
      user: 'Alex',
      avatar: 'A',
      color: 'var(--vitality)',
      action: 'completed a quest',
      target: 'Morning Meditation',
      time: '2 minutes ago',
      xp: '+15 XP'
    },
    {
      id: 2,
      user: 'Jordan',
      avatar: 'J',
      color: 'var(--intellect)',
      action: 'started a new quest',
      target: 'Read 30 pages',
      time: '5 minutes ago',
      xp: '+10 XP'
    },
    {
      id: 3,
      user: 'Sam',
      avatar: 'S',
      color: 'var(--charisma)',
      action: 'achieved',
      target: 'Streak Master badge',
      time: '12 minutes ago',
      xp: '+25 XP'
    },
    {
      id: 4,
      user: 'Morgan',
      avatar: 'M',
      color: 'var(--willpower)',
      action: 'completed a quest',
      target: 'Evening Workout',
      time: '18 minutes ago',
      xp: '+20 XP'
    }
  ];

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] relative">
      {/* Subtle texture overlay */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-30"
        style={{
          backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(42, 89, 58, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(63, 120, 153, 0.05) 0%, transparent 50%)'
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="rpg-panel p-8 mb-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-5">
              {/* Logo */}
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--bg-tertiary)] to-[var(--bg-secondary)] border-3 border-[var(--border-color)] flex items-center justify-center warm-glow" style={{animation: 'float 4s ease-in-out infinite'}}>
                <span className="text-4xl font-cinzel font-bold text-[var(--text-primary)]">B</span>
              </div>
              
              <div>
                <h1 className="text-4xl font-cinzel font-bold text-[var(--text-primary)] mb-1">Boredom Buster</h1>
                <p className="text-base text-[var(--text-secondary)] font-body">Your journey continues...</p>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              {/* XP Progress */}
              <div className="text-right">
                <div className="text-sm text-[var(--text-muted)] mb-2">Experience Points</div>
                <div className="flex items-center space-x-4">
                  <div className="w-56 h-4 bg-[var(--bg-tertiary)] rounded-full overflow-hidden border-2 border-[var(--border-color)]">
                    <div 
                      className="h-full bg-gradient-to-r from-[var(--xp-success)] to-[var(--vitality)] transition-all duration-500 rounded-full"
                      style={{ width: `${(xp / maxXp) * 100}%` }}
                    />
                  </div>
                  <span className="text-base font-cinzel font-semibold text-[var(--text-secondary)]">
                    {xp}/{maxXp} XP
                  </span>
                </div>
              </div>

              {/* Emergency Shield Button */}
              <button className="px-6 py-3 bg-gradient-to-br from-[var(--willpower)] to-[#c9a87a] text-[var(--bg-primary)] rounded-2xl font-cinzel font-semibold text-base warm-glow hover:scale-105 transition-transform bounce-gentle">
                🛡️ Dopamine Shield
              </button>

              {/* Lock Icon */}
              <div className="w-12 h-12 rounded-xl bg-[var(--bg-tertiary)] border-2 border-[var(--border-color)] flex items-center justify-center hover:border-[var(--vitality)] transition-colors">
                <svg className="w-6 h-6 text-[var(--text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Skill Trees Section */}
          <section>
            <h2 className="text-2xl font-cinzel font-bold mb-6 text-[var(--text-primary)]">Skill Trees</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {skillTrees.map((skill) => (
                <div key={skill.name} className="rpg-panel p-6 hover:scale-105 transition-transform cursor-pointer">
                  <div className="flex flex-col items-center text-center space-y-4">
                    {/* Skill Sigil */}
                    <div 
                      className="skill-sigil warm-glow"
                      style={{ 
                        borderColor: skill.color,
                        boxShadow: `0 0 20px ${skill.color}33, 0 0 40px ${skill.color}1A`
                      }}
                    >
                      <span className="text-4xl">{skill.icon}</span>
                      <div 
                        className="absolute inset-0 rounded-full opacity-30"
                        style={{ 
                          background: `radial-gradient(circle, ${skill.color}40 0%, transparent 70%)`,
                          animation: 'pulse-glow 3s ease-in-out infinite'
                        }}
                      />
                    </div>

                    <div>
                      <h3 className="text-xl font-cinzel font-bold text-[var(--text-primary)] mb-1">
                        {skill.name}
                      </h3>
                      <p className="text-xs text-[var(--text-muted)] mb-3">{skill.description}</p>
                      <div className="flex items-center justify-center space-x-2">
                        <span className="text-xs text-[var(--text-secondary)]">Level {skill.level}</span>
                        <span className="text-xs text-[var(--text-muted)]">•</span>
                        <span className="text-xs font-semibold" style={{ color: skill.color }}>
                          {skill.points} pts
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Achievements Section */}
          <section>
            <h2 className="text-2xl font-cinzel font-bold mb-6 text-[var(--text-primary)]">Achievements</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {achievements.map((achievement) => (
                <div 
                  key={achievement.id} 
                  className={`rpg-panel p-4 text-center transition-all ${
                    achievement.unlocked 
                      ? 'hover:scale-105 cursor-pointer' 
                      : 'opacity-40 grayscale'
                  }`}
                >
                  <div className="achievement-medallion mx-auto mb-3">
                    <span className="text-2xl">{achievement.icon}</span>
                  </div>
                  <h4 className="text-sm font-cinzel font-semibold text-[var(--text-primary)] mb-1">
                    {achievement.name}
                  </h4>
                  <p className="text-xs text-[var(--text-muted)]">{achievement.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* The Tavern Section */}
          <section>
            <h2 className="text-2xl font-cinzel font-bold mb-6 text-[var(--text-primary)]">The Tavern</h2>
            <div className="rpg-panel p-6">
              <div className="space-y-3">
                {tavernEntries.map((entry) => (
                  <div key={entry.id} className="tavern-entry">
                    <div className="flex items-start space-x-4">
                      {/* Avatar */}
                      <div 
                        className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0"
                        style={{ 
                          backgroundColor: entry.color,
                          color: 'var(--bg-primary)'
                        }}
                      >
                        {entry.avatar}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline space-x-2 mb-1">
                          <span className="font-semibold text-[var(--text-primary)]">{entry.user}</span>
                          <span className="text-sm text-[var(--text-muted)]">{entry.action}</span>
                        </div>
                        <p className="text-sm text-[var(--text-secondary)] mb-1">{entry.target}</p>
                        <div className="flex items-center space-x-3 text-xs text-[var(--text-muted)]">
                          <span>{entry.time}</span>
                          <span className="text-[var(--xp-success)] font-semibold">{entry.xp}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
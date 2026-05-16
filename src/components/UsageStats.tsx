import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { useStore } from '../store';
import { Activity, TrendingUp, ShieldCheck, Globe } from 'lucide-react';
import { motion } from 'motion/react';

export const UsageStats: React.FC = () => {
  const usageHistory = useStore((state) => state.usageHistory);
  const accounts = useStore((state) => state.accounts);

  const serviceStats = usageHistory.reduce((acc, current) => {
    acc[current.service] = (acc[current.service] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const barData = Object.entries(serviceStats).map(([name, value]) => ({ 
    name: name.charAt(0).toUpperCase() + name.slice(1), 
    value,
  }));

  const last24h = Array.from({ length: 24 }).map((_, i) => {
    const hour = (new Date().getHours() - (23 - i) + 24) % 24;
    return { hour: `${hour}:00`, count: 0 };
  });

  usageHistory.forEach(event => {
    const eventTime = new Date(event.timestamp);
    const hourStr = `${eventTime.getHours()}:00`;
    const dataPoint = last24h.find(d => d.hour === hourStr);
    if (dataPoint) dataPoint.count += 1;
  });

  const activeAccounts = accounts.filter(a => a.resetAt === null).length;
  const exhaustedAccounts = accounts.filter(a => a.resetAt !== null).length;

  const stats = [
    { label: 'Active Nodes', value: activeAccounts, icon: ShieldCheck, color: 'text-brand-success' },
    { label: 'In Cooldown', value: exhaustedAccounts, icon: Activity, color: 'text-brand-accent' },
    { label: 'Total Events', value: usageHistory.length, icon: TrendingUp, color: 'text-brand-text' },
    { label: 'Geo-Clusters', value: Object.keys(serviceStats).length, icon: Globe, color: 'text-brand-text' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 25 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-0 pb-12"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="pb-12 border-b border-brand-border">
        <div className="flex items-center gap-3 mb-8">
          <motion.div 
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-2 h-2 rounded-full bg-brand-accent" 
          />
          <p className="text-[11px] font-bold text-brand-text-muted uppercase tracking-[0.3em]">Network Telemetry</p>
        </div>
        <h2 className="text-5xl font-black text-brand-text tracking-tighter leading-[0.9]">System<br />Analytics</h2>
        <p className="text-[14px] font-medium text-brand-text-soft mt-6 leading-relaxed max-w-md">Real-time performance metrics and node exhaustion patterns across the QuotaCheck cluster.</p>
      </motion.div>

      {/* Stats Strip */}
      <motion.div variants={containerVariants} className="grid grid-cols-2 lg:grid-cols-4 gap-4 py-8">
        {stats.map((stat, i) => (
          <motion.div 
            key={i} 
            variants={itemVariants}
            className="py-5 px-5 border border-brand-border rounded-xl bg-brand-surface hover:bg-brand-surface-elevated transition-colors cursor-default"
          >
            <stat.icon size={18} className={`${stat.color} mb-3`} strokeWidth={2.5} />
            <p className="text-[10px] font-bold text-brand-text-muted uppercase tracking-widest mb-1">{stat.label}</p>
            <p className={`text-3xl font-black tracking-tighter font-mono ${stat.color}`}>{stat.value}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <motion.div variants={itemVariants} className="border border-brand-border rounded-xl bg-brand-surface">
          <div className="p-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-black text-brand-text tracking-tight">Load Distribution</h3>
                <p className="text-[11px] text-brand-text-muted font-bold uppercase tracking-widest mt-2">Exhaustion events over 24h</p>
              </div>
              <div className="px-3 py-1.5 border border-brand-accent text-[10px] font-black text-brand-accent uppercase tracking-widest flex items-center gap-2 rounded-md">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-accent animate-pulse" />
                Live
              </div>
            </div>
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={last24h}>
                  <defs>
                    <linearGradient id="usageGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-brand-accent)" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="var(--color-brand-accent)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-brand-border)" vertical={false} />
                  <XAxis dataKey="hour" stroke="var(--color-brand-text-muted)" fontSize={10} fontWeight="700" tickLine={false} axisLine={false} dy={15} />
                  <YAxis stroke="var(--color-brand-text-muted)" fontSize={10} fontWeight="700" tickLine={false} axisLine={false} dx={-15} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--color-brand-surface)', border: '1px solid var(--color-brand-border)', borderRadius: '8px', color: 'var(--color-brand-text)', padding: '12px' }}
                    itemStyle={{ color: 'var(--color-brand-accent)', fontSize: '16px', fontWeight: '900' }}
                    labelStyle={{ color: 'var(--color-brand-text-muted)', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="count" 
                    stroke="var(--color-brand-accent)" 
                    fillOpacity={1} 
                    fill="url(#usageGradient)" 
                    strokeWidth={2} 
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="border border-brand-border rounded-xl bg-brand-surface">
          <div className="p-6">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-black text-brand-text tracking-tight">Service Utilization</h3>
                <p className="text-[11px] text-brand-text-muted font-bold uppercase tracking-widest mt-2">Cluster activity by provider</p>
              </div>
              <TrendingUp size={20} className="text-brand-text-muted" strokeWidth={2.5} />
            </div>
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-brand-border)" vertical={false} />
                  <XAxis dataKey="name" stroke="var(--color-brand-text-muted)" fontSize={10} fontWeight="700" tickLine={false} axisLine={false} dy={15} />
                  <YAxis stroke="var(--color-brand-text-muted)" fontSize={10} fontWeight="700" tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{ fill: 'var(--color-brand-surface-elevated)' }}
                    contentStyle={{ backgroundColor: 'var(--color-brand-surface)', border: '1px solid var(--color-brand-border)', borderRadius: '8px', color: 'var(--color-brand-text)', padding: '12px' }}
                    itemStyle={{ color: 'var(--color-brand-text)', fontSize: '16px', fontWeight: '900' }}
                    labelStyle={{ color: 'var(--color-brand-text-muted)', fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}
                  />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
                    {barData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={['var(--color-brand-text)', 'var(--color-brand-accent)', 'var(--color-brand-success)', '#F59E0B', 'var(--color-brand-text-muted)'][index % 5]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Performance Table */}
      <motion.div variants={itemVariants} className="bg-brand-surface border border-brand-border rounded-xl mt-5 overflow-hidden">
        <div className="px-6 py-5 border-b border-brand-border flex items-center justify-between">
          <h3 className="text-lg font-black text-brand-text tracking-tight uppercase">Node Performance Ranking</h3>
          <span className="px-3 py-1.5 border border-brand-border text-[10px] font-black text-brand-text-muted uppercase tracking-widest rounded-md">
            Sort: Activity
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="px-6 py-4 text-[10px] font-bold text-brand-text-muted uppercase tracking-widest border-b border-brand-border">Node Identity</th>
                <th className="px-6 py-4 text-[10px] font-bold text-brand-text-muted uppercase tracking-widest text-center border-b border-brand-border">Network Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-brand-text-muted uppercase tracking-widest text-right border-b border-brand-border">Cycle Count</th>
              </tr>
            </thead>
            <tbody>
              {accounts.sort((a, b) => b.exhaustCount - a.exhaustCount).map((account, i) => (
                <motion.tr 
                  key={account.id} 
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05, type: "spring", stiffness: 300, damping: 25 }}
                  className="group hover:bg-brand-surface-elevated transition-colors border-b border-brand-border last:border-b-0"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-9 h-9 flex items-center justify-center text-brand-accent-fg text-[13px] font-black rounded-lg"
                        style={{ backgroundColor: account.color }}
                      >
                        {account.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-[15px] font-black text-brand-text tracking-tight">{account.name}</p>
                        <p className="text-[10px] text-brand-text-muted font-bold uppercase tracking-widest mt-1">{account.service}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center gap-2 px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-md border ${
                      account.resetAt 
                        ? 'text-brand-accent border-brand-accent/30 bg-brand-accent/5' 
                        : 'text-brand-success border-brand-success/30 bg-brand-success/5'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${account.resetAt ? 'bg-brand-accent animate-pulse' : 'bg-brand-success'}`} />
                      {account.resetAt ? 'COOLDOWN' : 'OPERATIONAL'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-2xl font-black text-brand-text font-mono group-hover:text-brand-accent transition-colors">{account.exhaustCount}</span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
};

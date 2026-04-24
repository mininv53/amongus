import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n';
import { BarChart3, TrendingUp, AlertTriangle, Eye, Image, Music, Link2, Loader2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';

const API_URL = process.env.REACT_APP_BACKEND_URL || '';

export default function Dashboard() {
  const { t, lang } = useLanguage();
  const [stats, setStats] = useState(null);
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      try {
        const [statsRes, analysesRes] = await Promise.all([
          fetch(`${API_URL}/api/stats`),
          fetch(`${API_URL}/api/analyses/recent?limit=50${filter !== 'all' ? `&analysis_type=${filter}` : ''}`)
        ]);
        if (cancelled) return;
        const statsData = await statsRes.json();
        const analysesData = await analysesRes.json();
        if (cancelled) return;
        setStats(statsData);
        setAnalyses(analysesData.analyses || []);
      } catch (error) {
        if (!cancelled) console.error('Failed to fetch dashboard data:', error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    setLoading(true);
    fetchData();
    return () => { cancelled = true; };
  }, [filter]);

  const getTypeIcon = (type) => {
    switch (type) {
      case 'image': return <Image className="w-4 h-4 text-teal-400" />;
      case 'audio': return <Music className="w-4 h-4 text-lime-400" />;
      case 'url': return <Link2 className="w-4 h-4 text-sky-400" />;
      default: return null;
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-teal-400';
    if (score >= 40) return 'text-amber-400';
    return 'text-red-400';
  };

  const getVerdictColor = (verdict) => {
    if (!verdict) return 'text-muted-foreground';
    if (verdict.includes('AUTHENTIC') || verdict.includes('TRUSTWORTHY')) return 'text-green-400';
    if (verdict.includes('UNCERTAIN')) return 'text-amber-400';
    return 'text-red-400';
  };

  const chartData = stats?.recent_scores?.map((s, i) => ({
    name: i + 1,
    score: s.score,
    type: s.type
  })) || [];

  const verdictData = stats?.verdict_distribution
    ? Object.entries(stats.verdict_distribution).map(([key, value]) => ({
        name: key.replace(/_/g, ' '),
        count: value,
        fill: key.includes('AUTHENTIC') || key.includes('TRUSTWORTHY') ? 'hsl(150, 70%, 45%)'
            : key.includes('UNCERTAIN') ? 'hsl(38, 92%, 55%)'
            : 'hsl(0, 78%, 55%)'
      }))
    : [];

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-16">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-10 sm:py-16">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">{t('dashboard_title')}</h1>
        <p className="mt-2 text-muted-foreground">{t('dashboard_subtitle')}</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="p-5 rounded-xl border border-border bg-card" data-testid="dashboard-kpi-total">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-primary" />
            </div>
            <span className="text-sm text-muted-foreground">{t('dashboard_total')}</span>
          </div>
          <p className="text-2xl font-bold font-['Space_Grotesk']">{stats?.total || 0}</p>
        </div>
        <div className="p-5 rounded-xl border border-border bg-card" data-testid="dashboard-kpi-avg">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-lg bg-teal-500/10 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-teal-400" />
            </div>
            <span className="text-sm text-muted-foreground">{t('dashboard_avg_score')}</span>
          </div>
          <p className="text-2xl font-bold font-['Space_Grotesk']">{stats?.avg_score || 0}</p>
        </div>
        <div className="p-5 rounded-xl border border-border bg-card" data-testid="dashboard-kpi-flagged">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-lg bg-red-500/10 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 text-red-400" />
            </div>
            <span className="text-sm text-muted-foreground">{t('dashboard_flagged')}</span>
          </div>
          <p className="text-2xl font-bold font-['Space_Grotesk']">{stats?.flagged || 0}</p>
        </div>
      </div>

      {/* Charts */}
      {chartData.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
          <div className="p-5 rounded-xl border border-border bg-card">
            <h3 className="text-sm font-semibold mb-4">Trust Score Trend</h3>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(168, 78%, 45%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(168, 78%, 45%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="hsl(160, 10%, 40%)" fontSize={11} />
                <YAxis domain={[0, 100]} stroke="hsl(160, 10%, 40%)" fontSize={11} />
                <Tooltip
                  contentStyle={{ background: 'hsl(165, 22%, 8%)', border: '1px solid hsl(165, 18%, 18%)', borderRadius: '8px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="score" stroke="hsl(168, 78%, 45%)" fill="url(#scoreGradient)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          {verdictData.length > 0 && (
            <div className="p-5 rounded-xl border border-border bg-card">
              <h3 className="text-sm font-semibold mb-4">Verdict Distribution</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={verdictData}>
                  <XAxis dataKey="name" stroke="hsl(160, 10%, 40%)" fontSize={9} angle={-20} textAnchor="end" height={50} />
                  <YAxis stroke="hsl(160, 10%, 40%)" fontSize={11} />
                  <Tooltip
                    contentStyle={{ background: 'hsl(165, 22%, 8%)', border: '1px solid hsl(165, 18%, 18%)', borderRadius: '8px', fontSize: '12px' }}
                  />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {verdictData.map((entry, i) => (
                      <Cell key={i} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      )}

      {/* Filter */}
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm text-muted-foreground">{t('dashboard_type')}:</span>
        {['all', 'image', 'audio', 'url'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            data-testid={`filter-${f}`}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
              filter === f
                ? 'bg-primary/10 text-primary border border-primary/20'
                : 'text-muted-foreground hover:text-foreground border border-transparent hover:border-border'
            }`}
          >
            {f === 'all' ? t('dashboard_filter_all') : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* History table */}
      <div className="rounded-xl border border-border bg-card overflow-hidden" data-testid="dashboard-history-table">
        {analyses.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-muted-foreground mb-4">{t('dashboard_no_data')}</p>
            <Link to="/analyze" className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 btn-press transition-colors">
              {t('hero_cta')}
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">{t('dashboard_type')}</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">{t('dashboard_score')}</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">{t('dashboard_verdict_col')}</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground">{t('dashboard_date')}</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground">{t('dashboard_actions')}</th>
                </tr>
              </thead>
              <tbody>
                {analyses.map((a, i) => (
                  <tr key={a.public_id || i} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(a.analysis_type)}
                        <span className="text-sm capitalize">{a.analysis_type}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-sm font-semibold font-mono ${getScoreColor(a.trust_score)}`}>
                        {a.trust_score}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-medium ${getVerdictColor(a.verdict)}`}>
                        {t(`verdict_${a.verdict}`) || a.verdict}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-muted-foreground">
                        {a.created_at ? new Date(a.created_at).toLocaleDateString() : '-'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        to={`/r/${a.public_id}`}
                        className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        {t('dashboard_view')}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n';
import {
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Eye,
  Image as ImageIcon,
  Music,
  Link2,
  Loader2,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from 'recharts';

const API_URL = process.env.REACT_APP_BACKEND_URL || '';

const FILTERS = [
  { id: 'all', key: 'dash_filter_all' },
  { id: 'image', key: 'dash_filter_image' },
  { id: 'audio', key: 'dash_filter_audio' },
  { id: 'url', key: 'dash_filter_url' },
];

export default function Dashboard() {
  const { t } = useLanguage();
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
          fetch(
            `${API_URL}/api/analyses/recent?limit=50${filter !== 'all' ? `&analysis_type=${filter}` : ''}`,
          ),
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
    return () => {
      cancelled = true;
    };
  }, [filter]);

  const getTypeIcon = (type) => {
    switch (type) {
      case 'image':
        return <ImageIcon className="w-4 h-4 text-primary" />;
      case 'audio':
        return <Music className="w-4 h-4 text-accent" />;
      case 'url':
        return <Link2 className="w-4 h-4 text-sky-300" />;
      default:
        return null;
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-300';
    if (score >= 60) return 'text-primary';
    if (score >= 40) return 'text-amber-300';
    return 'text-red-300';
  };

  const getVerdictColor = (verdict) => {
    if (!verdict) return 'text-muted-foreground';
    const v = verdict.toUpperCase();
    if (v.includes('AUTHENTIC') || v.includes('TRUSTWORTHY')) return 'text-emerald-300';
    if (v.includes('UNCERTAIN')) return 'text-amber-300';
    return 'text-red-300';
  };

  const chartData =
    stats?.recent_scores?.map((s, i) => ({
      name: i + 1,
      score: s.score,
      type: s.type,
    })) || [];

  const verdictData = stats?.verdict_distribution
    ? Object.entries(stats.verdict_distribution).map(([key, value]) => ({
        name: key.replace(/_/g, ' '),
        count: value,
        fill:
          key.includes('AUTHENTIC') || key.includes('TRUSTWORTHY')
            ? 'hsl(150, 70%, 55%)'
            : key.includes('UNCERTAIN')
              ? 'hsl(38, 92%, 60%)'
              : 'hsl(0, 78%, 62%)',
      }))
    : [];

  return (
    <div className="relative">
      {/* Hero header */}
      <section className="relative overflow-hidden">
        <div className="aurora-bg" />
        <div className="container-page relative pt-12 sm:pt-16 pb-6 text-center">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-card/60 backdrop-blur text-[11px] uppercase tracking-[0.16em] text-muted-foreground">
            <span className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_10px_2px_hsl(var(--primary))]" />
            {t('dashboard_eyebrow')}
          </span>
          <h1 className="mt-6 font-serif text-4xl sm:text-5xl tighter">
            {t('dashboard_title')}
          </h1>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">{t('dashboard_subtitle')}</p>
        </div>
      </section>

      <section className="container-page pb-20">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* KPI cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <KPICard
                icon={<BarChart3 className="w-4 h-4 text-primary" />}
                label={t('dash_total')}
                value={stats?.total || 0}
                testId="dashboard-kpi-total"
              />
              <KPICard
                icon={<TrendingUp className="w-4 h-4 text-accent" />}
                label={t('dash_avg')}
                value={stats?.avg_score || 0}
                testId="dashboard-kpi-avg"
              />
              <KPICard
                icon={<AlertTriangle className="w-4 h-4 text-red-300" />}
                label={t('dash_flagged')}
                value={stats?.flagged || 0}
                testId="dashboard-kpi-flagged"
              />
            </div>

            {/* Charts */}
            {chartData.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bento-card p-6">
                  <h3 className="text-sm font-semibold mb-4">Trust Score Trend</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(168, 78%, 52%)" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="hsl(168, 78%, 52%)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" stroke="hsl(195, 8%, 45%)" fontSize={11} />
                      <YAxis domain={[0, 100]} stroke="hsl(195, 8%, 45%)" fontSize={11} />
                      <Tooltip
                        contentStyle={{
                          background: 'hsl(195, 28%, 8%)',
                          border: '1px solid hsl(195, 18%, 18%)',
                          borderRadius: '12px',
                          fontSize: '12px',
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="score"
                        stroke="hsl(168, 78%, 52%)"
                        fill="url(#scoreGradient)"
                        strokeWidth={2}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                {verdictData.length > 0 && (
                  <div className="bento-card p-6">
                    <h3 className="text-sm font-semibold mb-4">Verdict Distribution</h3>
                    <ResponsiveContainer width="100%" height={200}>
                      <BarChart data={verdictData}>
                        <XAxis
                          dataKey="name"
                          stroke="hsl(195, 8%, 45%)"
                          fontSize={9}
                          angle={-20}
                          textAnchor="end"
                          height={50}
                        />
                        <YAxis stroke="hsl(195, 8%, 45%)" fontSize={11} />
                        <Tooltip
                          contentStyle={{
                            background: 'hsl(195, 28%, 8%)',
                            border: '1px solid hsl(195, 18%, 18%)',
                            borderRadius: '12px',
                            fontSize: '12px',
                          }}
                        />
                        <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                          {verdictData.map((entry) => (
                            <Cell key={entry.name} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            )}

            {/* Filter (segmented) */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                {t('dash_recent')}
              </span>
              <div className="segmented" role="tablist" aria-label="Filter">
                {FILTERS.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    role="tab"
                    aria-selected={filter === f.id}
                    data-active={filter === f.id}
                    onClick={() => setFilter(f.id)}
                    data-testid={`filter-${f.id}`}
                    className="segmented-item"
                  >
                    {t(f.key)}
                  </button>
                ))}
              </div>
            </div>

            {/* History table */}
            <div className="bento-card overflow-hidden" data-testid="dashboard-history-table">
              {analyses.length === 0 ? (
                <div className="p-12 text-center">
                  <p className="text-muted-foreground mb-5">{t('dash_no_data')}</p>
                  <Link to="/analyze" className="pill pill-primary">
                    {t('hero_cta_primary')}
                  </Link>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-card/40">
                        <th className="px-4 py-3 text-left text-[11px] uppercase tracking-[0.16em] font-medium text-muted-foreground">
                          {t('tab_image')} / {t('tab_audio')} / {t('tab_url')}
                        </th>
                        <th className="px-4 py-3 text-left text-[11px] uppercase tracking-[0.16em] font-medium text-muted-foreground">
                          Score
                        </th>
                        <th className="px-4 py-3 text-left text-[11px] uppercase tracking-[0.16em] font-medium text-muted-foreground">
                          {t('result_verdict')}
                        </th>
                        <th className="px-4 py-3 text-left text-[11px] uppercase tracking-[0.16em] font-medium text-muted-foreground">
                          Date
                        </th>
                        <th className="px-4 py-3 text-right text-[11px] uppercase tracking-[0.16em] font-medium text-muted-foreground">
                          —
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {analyses.map((a) => (
                        <tr
                          key={a.public_id || a.id}
                          className="border-b border-border/40 hover:bg-card/40 transition-colors"
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              {getTypeIcon(a.analysis_type)}
                              <span className="text-sm capitalize">{a.analysis_type}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`text-sm font-semibold font-mono ${getScoreColor(
                                a.trust_score,
                              )}`}
                            >
                              {a.trust_score}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`text-xs font-medium ${getVerdictColor(a.verdict)}`}
                            >
                              {a.verdict}
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
                              View
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
        )}
      </section>
    </div>
  );
}

function KPICard({ icon, label, value, testId }) {
  return (
    <div className="bento-card p-6" data-testid={testId}>
      <div className="flex items-center gap-3 mb-2">
        <div className="w-9 h-9 rounded-xl bg-card/60 border border-border flex items-center justify-center">
          {icon}
        </div>
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <p className="text-3xl font-semibold tighter">{value}</p>
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, AlertTriangle, Info, Bug, Trash2, Download, RefreshCw, Activity, Cpu, Database, HardDrive, MemoryStick, ShieldCheck } from 'lucide-react';
import type { SystemMetricsSnapshot, HealthCheckResult } from '@shared/config/statusConfig';

function formatUptime(milliseconds: number) {
  const totalSeconds = Math.max(0, Math.floor(milliseconds / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return `${days}d ${hours}h ${minutes}m`;
}

function formatHealthStatus(status?: HealthCheckResult["status"]) {
  if (status === "healthy") return "text-emerald-400";
  if (status === "degraded") return "text-amber-400";
  return "text-red-400";
}

export default function ServerConsole() {
  const [logs, setLogs] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, errors: 0, warnings: 0, info: 0, debug: 0 });
  const [filter, setFilter] = useState<'all' | 'error' | 'warn' | 'info' | 'debug'>('all');
  const [category, setCategory] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [metrics, setMetrics] = useState<SystemMetricsSnapshot | null>(null);
  const [health, setHealth] = useState<HealthCheckResult | null>(null);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/logs', { credentials: 'include' });
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs);
        setStats(data.stats);
      }
    } catch (err) {
      console.error('Failed to fetch logs:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatus = async () => {
    try {
      const [statusRes, healthRes] = await Promise.all([
        fetch('/api/status', { credentials: 'include' }),
        fetch('/api/status/health', { credentials: 'include' }),
      ]);
      const statusPayload = await statusRes.json().catch(() => null);
      const healthPayload = await healthRes.json().catch(() => null);

      if (statusRes.ok) {
        setMetrics(statusPayload?.data || null);
      }

      if (healthPayload && typeof healthPayload === 'object') {
        setHealth({
          timestamp: healthPayload.timestamp,
          status: healthPayload.status,
          checks: healthPayload.checks,
          overallScore: healthPayload.score,
        });
      }
    } catch (err) {
      console.error('Failed to fetch server status:', err);
    }
  };

  useEffect(() => {
    fetchLogs();
    fetchStatus();
    const logsInterval = setInterval(fetchLogs, 5000);
    const statusInterval = setInterval(fetchStatus, 10000);
    return () => {
      clearInterval(logsInterval);
      clearInterval(statusInterval);
    };
  }, []);

  const filteredLogs = logs.filter(log => {
    if (filter !== 'all' && log.level !== filter) return false;
    if (category && log.category !== category) return false;
    return true;
  });

  const categories = Array.from(new Set(logs.map((log) => log.category).filter(Boolean)));
  const categoryCounts = categories.reduce((acc: Record<string, number>, item: string) => {
    acc[item] = logs.filter((log) => log.category === item).length;
    return acc;
  }, {});

  const getLogIcon = (level: string) => {
    switch (level) {
      case 'error': return <AlertCircle className="w-4 h-4 text-red-600" />;
      case 'warn': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'info': return <Info className="w-4 h-4 text-blue-600" />;
      case 'debug': return <Bug className="w-4 h-4 text-gray-600" />;
      default: return null;
    }
  };

  const getLogColor = (level: string) => {
    switch (level) {
      case 'error': return 'bg-red-50 border-red-200';
      case 'warn': return 'bg-yellow-50 border-yellow-200';
      case 'info': return 'bg-blue-50 border-blue-200';
      case 'debug': return 'bg-gray-50 border-gray-200';
      default: return 'bg-white';
    }
  };

  const exportLogs = () => {
    const blob = new Blob([JSON.stringify(filteredLogs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'server-logs.json';
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const clearLocalView = () => {
    setLogs([]);
    setStats({ total: 0, errors: 0, warnings: 0, info: 0, debug: 0 });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Server Console</h1>
          <p className="text-slate-400">Real-time monitoring and logging dashboard</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-5 gap-4 mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{stats.total}</div>
                <div className="text-sm text-slate-400 mt-1">Total Logs</div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-red-900/30 border-red-800">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-red-400">{stats.errors}</div>
                <div className="text-sm text-slate-400 mt-1">Errors</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-yellow-900/30 border-yellow-800">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">{stats.warnings}</div>
                <div className="text-sm text-slate-400 mt-1">Warnings</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-blue-900/30 border-blue-800">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">{stats.info}</div>
                <div className="text-sm text-slate-400 mt-1">Info</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-700/30 border-gray-600">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-400">{stats.debug}</div>
                <div className="text-sm text-slate-400 mt-1">Debug</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-base flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Health
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold ${formatHealthStatus(health?.status)}`}>
                {health?.overallScore ?? '--'}
              </div>
              <div className="text-sm text-slate-400 mt-1">{health?.status || 'offline'}</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-base flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" /> Traffic
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{metrics?.requests.totalRequests ?? 0}</div>
              <div className="text-sm text-slate-400 mt-1">{(metrics?.requests.requestsPerSecond ?? 0).toFixed(2)} req/s</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-base flex items-center gap-2">
                <MemoryStick className="w-4 h-4 text-violet-400" /> Memory
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{Math.round(metrics?.memory.usage ?? 0)}%</div>
              <div className="text-sm text-slate-400 mt-1">{metrics?.memory.used ?? 0} / {metrics?.memory.total ?? 0} MB</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader className="pb-2">
              <CardTitle className="text-white text-base flex items-center gap-2">
                <Database className="w-4 h-4 text-amber-400" /> Database
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-white">{metrics?.database.connections ?? 0}</div>
              <div className="text-sm text-slate-400 mt-1">{metrics?.database.activeQueries ?? 0} active queries</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Live Server Metrics</CardTitle>
              <CardDescription>Real-time uptime, API performance, and infrastructure telemetry.</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="rounded border border-slate-700 bg-slate-900/70 p-3">
                <div className="text-xs uppercase text-slate-400">Uptime</div>
                <div className="mt-1 text-lg font-bold text-white">{formatUptime(metrics?.cpu.uptime ? metrics.cpu.uptime * 1000 : 0)}</div>
              </div>
              <div className="rounded border border-slate-700 bg-slate-900/70 p-3">
                <div className="text-xs uppercase text-slate-400">Average Response</div>
                <div className="mt-1 text-lg font-bold text-white">{Math.round(metrics?.requests.averageResponseTime ?? 0)} ms</div>
              </div>
              <div className="rounded border border-slate-700 bg-slate-900/70 p-3">
                <div className="text-xs uppercase text-slate-400">P95 / P99</div>
                <div className="mt-1 text-lg font-bold text-white">{Math.round(metrics?.requests.p95ResponseTime ?? 0)} / {Math.round(metrics?.requests.p99ResponseTime ?? 0)} ms</div>
              </div>
              <div className="rounded border border-slate-700 bg-slate-900/70 p-3">
                <div className="text-xs uppercase text-slate-400">Hourly Traffic</div>
                <div className="mt-1 text-lg font-bold text-white">{metrics?.requests.lastHourRequests ?? 0}</div>
              </div>
              <div className="rounded border border-slate-700 bg-slate-900/70 p-3">
                <div className="text-xs uppercase text-slate-400 flex items-center gap-2"><Cpu className="w-3 h-3 text-cyan-400" /> CPU Usage</div>
                <div className="mt-1 text-lg font-bold text-white">{Math.round(metrics?.cpu.usage ?? 0)}%</div>
              </div>
              <div className="rounded border border-slate-700 bg-slate-900/70 p-3">
                <div className="text-xs uppercase text-slate-400 flex items-center gap-2"><HardDrive className="w-3 h-3 text-slate-300" /> Disk Usage</div>
                <div className="mt-1 text-lg font-bold text-white">{Math.round(metrics?.disk.usage ?? 0)}%</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="text-white">Health Checks</CardTitle>
              <CardDescription>Database, memory, CPU, disk, API, cache, and websocket checks.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(health?.checks || {}).map(([key, check]) => (
                <div key={key} className="rounded border border-slate-700 bg-slate-900/70 p-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-semibold text-white capitalize">{key}</div>
                    <div className={`text-xs uppercase ${check.status === 'ok' ? 'text-emerald-400' : check.status === 'warning' ? 'text-amber-400' : 'text-red-400'}`}>
                      {check.status}
                    </div>
                  </div>
                  <div className="mt-1 text-xs text-slate-400">{check.message || 'No issues detected.'}</div>
                  <div className="mt-1 text-xs text-slate-500">Value: {Math.round(check.value)} • Threshold: {Math.round(check.threshold)}</div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="bg-slate-800 rounded-lg p-4 mb-6 border border-slate-700">
          <div className="flex gap-2 flex-wrap">
            {['all', 'error', 'warn', 'info', 'debug'].map(f => (
              <Button
                key={f}
                onClick={() => setFilter(f as any)}
                variant={filter === f ? 'default' : 'outline'}
                size="sm"
                className={filter === f ? 'bg-blue-600 hover:bg-blue-700' : 'text-slate-300'}
              >
                {f.toUpperCase()}
              </Button>
            ))}
            <Button onClick={fetchLogs} disabled={loading} size="sm" variant="outline" className="ml-auto">
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </Button>
            <Button onClick={exportLogs} size="sm" variant="outline" className="text-slate-200 border-slate-600">
              <Download className="w-4 h-4 mr-1" /> Export
            </Button>
            <Button onClick={clearLocalView} size="sm" variant="outline" className="text-red-300 border-red-600">
              <Trash2 className="w-4 h-4 mr-1" /> Clear View
            </Button>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <Button
              size="sm"
              variant={category === '' ? 'default' : 'outline'}
              onClick={() => setCategory('')}
              className={category === '' ? 'bg-blue-600 hover:bg-blue-700' : 'text-slate-300'}
            >
              All Categories
            </Button>
            {categories.map((item) => (
              <Button
                key={item}
                size="sm"
                variant={category === item ? 'default' : 'outline'}
                onClick={() => setCategory(item)}
                className={category === item ? 'bg-blue-600 hover:bg-blue-700' : 'text-slate-300'}
              >
                {item} ({categoryCounts[item] || 0})
              </Button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="text-xs text-slate-400 uppercase">Visible Logs</div>
              <div className="text-2xl font-bold text-white">{filteredLogs.length}</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="text-xs text-slate-400 uppercase">Selected Level</div>
              <div className="text-2xl font-bold text-white">{filter.toUpperCase()}</div>
            </CardContent>
          </Card>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="pt-6">
              <div className="text-xs text-slate-400 uppercase">Selected Category</div>
              <div className="text-2xl font-bold text-white">{category || 'ALL'}</div>
            </CardContent>
          </Card>
        </div>

        {/* Logs */}
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">System Logs</CardTitle>
            <CardDescription>Last {filteredLogs.length} logs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto font-mono text-sm">
              {filteredLogs.length === 0 ? (
                <div className="text-slate-400">No logs found</div>
              ) : (
                filteredLogs.slice().reverse().map((log, idx) => (
                  <div key={idx} className={`p-3 rounded border ${getLogColor(log.level)} flex gap-2 items-start`}>
                    <div className="flex-shrink-0 mt-0.5">{getLogIcon(log.level)}</div>
                    <div className="flex-grow min-w-0">
                      <div className="text-xs text-slate-500">{log.timestamp} • [{log.category}]</div>
                      <div className="text-slate-900 dark:text-white break-words">{log.message}</div>
                      {log.data && <div className="text-xs text-slate-600 mt-1">{JSON.stringify(log.data).substring(0, 100)}</div>}
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

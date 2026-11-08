"use client";

import { useState, useEffect, useCallback } from "react";
import { Card } from "@/app/components/ui/card";
import {
  Users,
  Eye,
  MousePointerClick,
  Clock,
  TrendingUp,
  Monitor,
  Smartphone,
  Chrome,
  Activity,
  LogIn,
  UserPlus,
} from "lucide-react";

interface AnalyticsStats {
  totalPageViews: number;
  uniqueVisitors: number;
  totalSessions: number;
  loginCount: number;
  signupCount: number;
  avgSessionDuration: number;
  topPages: Array<{ path: string; views: number }>;
  osByCount: Array<{ os: string; count: number }>;
  browserByCount: Array<{ browser: string; count: number }>;
  deviceByCount: Array<{ device: string; count: number }>;
}

interface PageViewData {
  date: string;
  count: number;
}

interface RecentActivity {
  id: string;
  action: string;
  category: string | null;
  label: string | null;
  os: string | null;
  browser: string | null;
  createdAt: string;
}

export default function AdvancedAnalyticsPage() {
  const [timeRange, setTimeRange] = useState<
    "today" | "week" | "month" | "all"
  >("week");
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [pageViews, setPageViews] = useState<PageViewData[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, pageViewsRes, activityRes] = await Promise.all([
        fetch(`/api/admin/analytics/stats?timeRange=${timeRange}`),
        fetch(`/api/admin/analytics/page-views?days=30`),
        fetch(`/api/admin/analytics/recent-activity?limit=10`),
      ]);

      const [statsData, pageViewsData, activityData] = await Promise.all([
        statsRes.json(),
        pageViewsRes.json(),
        activityRes.json(),
      ]);

      setStats(statsData);
      setPageViews(pageViewsData);
      setRecentActivity(activityData);
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}m ${secs}s`;
  };

  const getOsIcon = (os: string) => {
    if (os.includes("Windows")) return "🪟";
    if (os.includes("Mac")) return "🍎";
    if (os.includes("Linux")) return "🐧";
    if (os.includes("Android")) return "🤖";
    if (os.includes("iOS")) return "📱";
    return "💻";
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case "login":
        return <LogIn className="h-4 w-4" />;
      case "signup":
        return <UserPlus className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  if (loading || !stats) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  const maxPageViews = Math.max(...pageViews.map((pv) => pv.count), 1);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight">
            Advanced Analytics
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Comprehensive insights into user behavior and website performance
          </p>
        </div>

        {/* Time Range Selector */}
        <div className="flex gap-1.5 sm:gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
          {(["today", "week", "month", "all"] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`whitespace-nowrap rounded-lg px-3 sm:px-4 py-2 text-sm font-medium transition-colors flex-shrink-0 ${
                timeRange === range
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              {range.charAt(0).toUpperCase() + range.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4 sm:p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
              <Eye className="h-6 w-6 text-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Page Views</p>
              <p className="text-2xl font-bold">
                {stats.totalPageViews.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
              <Users className="h-6 w-6 text-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Unique Visitors</p>
              <p className="text-2xl font-bold">
                {stats.uniqueVisitors.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
              <MousePointerClick className="h-6 w-6 text-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Sessions</p>
              <p className="text-2xl font-bold">
                {stats.totalSessions.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
              <Clock className="h-6 w-6 text-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg Session</p>
              <p className="text-2xl font-bold">
                {formatDuration(stats.avgSessionDuration)}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Auth Metrics */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
        <Card className="p-4 sm:p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
              <LogIn className="h-6 w-6 text-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Logins</p>
              <p className="text-2xl font-bold">
                {stats.loginCount.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted">
              <UserPlus className="h-6 w-6 text-foreground" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">New Signups</p>
              <p className="text-2xl font-bold">
                {stats.signupCount.toLocaleString()}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Page Views Chart */}
      <Card className="p-4 sm:p-6">
        <div className="mb-4 sm:mb-6 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold">Page Views Over Time</h2>
        </div>
        <div className="space-y-2">
          {pageViews.map((pv) => (
            <div key={pv.date} className="flex items-center gap-4">
              <div className="w-24 text-sm text-muted-foreground">
                {new Date(pv.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </div>
              <div className="flex-1">
                <div className="h-8 w-full bg-muted rounded-lg overflow-hidden">
                  <div
                    className="h-full bg-foreground transition-all"
                    style={{ width: `${(pv.count / maxPageViews) * 100}%` }}
                  />
                </div>
              </div>
              <div className="w-16 text-right text-sm font-medium">
                {pv.count}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 lg:grid-cols-2">
        {/* Top Pages */}
        <Card className="p-4 sm:p-6">
          <h2 className="mb-3 sm:mb-4 text-base sm:text-lg font-semibold">
            Top Pages
          </h2>
          <div className="space-y-3">
            {stats.topPages.slice(0, 10).map((page, index) => (
              <div
                key={page.path}
                className="flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-sm font-medium">
                    {index + 1}
                  </div>
                  <code className="text-sm truncate">{page.path || "/"}</code>
                </div>
                <div className="text-sm font-medium text-muted-foreground whitespace-nowrap">
                  {page.views.toLocaleString()} views
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="p-6">
          <h2 className="mb-4 text-lg font-semibold">Recent User Activity</h2>
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start gap-3 rounded-lg border border-border p-3"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted">
                  {getActionIcon(activity.action)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium capitalize">
                    {activity.action}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {activity.os} • {activity.browser}
                  </p>
                </div>
                <div className="text-xs text-muted-foreground whitespace-nowrap">
                  {new Date(activity.createdAt).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Device & OS Stats */}
      <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {/* OS Distribution */}
        <Card className="p-4 sm:p-6">
          <div className="mb-4 flex items-center gap-2">
            <Monitor className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold">Operating Systems</h2>
          </div>
          <div className="space-y-3">
            {stats.osByCount.map((os) => (
              <div key={os.os} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getOsIcon(os.os)}</span>
                  <span className="text-sm">{os.os}</span>
                </div>
                <span className="text-sm font-medium">{os.count}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Browser Distribution */}
        <Card className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <Chrome className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold">Browsers</h2>
          </div>
          <div className="space-y-3">
            {stats.browserByCount.map((browser) => (
              <div
                key={browser.browser}
                className="flex items-center justify-between"
              >
                <span className="text-sm">{browser.browser}</span>
                <span className="text-sm font-medium">{browser.count}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Device Distribution */}
        <Card className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <Smartphone className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold">Devices</h2>
          </div>
          <div className="space-y-3">
            {stats.deviceByCount.map((device) => (
              <div
                key={device.device}
                className="flex items-center justify-between"
              >
                <span className="text-sm">{device.device}</span>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-24 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{
                        width: `${
                          (device.count / stats.totalPageViews) * 100
                        }%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium">{device.count}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

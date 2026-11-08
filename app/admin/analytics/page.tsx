import { redirect } from "next/navigation";
import { getAdminUser } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Briefcase,
  DollarSign,
  Mail,
  CalendarDays,
  Target,
  Activity,
  PieChart,
} from "lucide-react";

export default async function AnalyticsPage() {
  const admin = await getAdminUser();

  if (!admin) {
    redirect("/login");
  }

  // Get current date info
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
  const startOfYear = new Date(now.getFullYear(), 0, 1);

  // Fetch analytics data
  const [
    totalClients,
    clientsThisMonth,
    clientsLastMonth,
    totalProjects,
    projectsThisMonth,
    projectsLastMonth,
    totalContacts,
    contactsThisMonth,
    contactsLastMonth,
    totalInvoices,
    paidInvoices,
    pendingInvoices,
    overdueInvoices,
    projectsByStatus,
    contactsByStatus,
    revenueByMonth,
    projectsByCategory,
  ] = await Promise.all([
    // Client counts
    prisma.user.count({ where: { role: "user" } }),
    prisma.user.count({
      where: { role: "user", createdAt: { gte: startOfMonth } },
    }),
    prisma.user.count({
      where: {
        role: "user",
        createdAt: { gte: startOfLastMonth, lt: endOfLastMonth },
      },
    }),
    // Project counts
    prisma.project.count(),
    prisma.project.count({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.project.count({
      where: { createdAt: { gte: startOfLastMonth, lt: endOfLastMonth } },
    }),
    // Contact counts
    prisma.contact.count(),
    prisma.contact.count({ where: { createdAt: { gte: startOfMonth } } }),
    prisma.contact.count({
      where: { createdAt: { gte: startOfLastMonth, lt: endOfLastMonth } },
    }),
    // Invoice counts
    prisma.invoice.count(),
    prisma.invoice.aggregate({
      _sum: { amount: true },
      where: { status: "Paid" },
    }),
    prisma.invoice.aggregate({
      _sum: { amount: true },
      where: { status: "Pending" },
    }),
    prisma.invoice.aggregate({
      _sum: { amount: true },
      where: { status: "Overdue" },
    }),
    // Projects by status
    prisma.project.groupBy({ by: ["status"], _count: true }),
    // Contacts by status
    prisma.contact.groupBy({ by: ["status"], _count: true }),
    // Revenue this year by month
    prisma.invoice.findMany({
      where: { status: "Paid", paidDate: { gte: startOfYear } },
      select: { amount: true, paidDate: true },
    }),
    // Projects by category
    prisma.project.groupBy({
      by: ["category"],
      _count: true,
      where: { category: { not: null } },
    }),
  ]);

  // Calculate growth rates
  const clientGrowth =
    clientsLastMonth > 0
      ? ((clientsThisMonth - clientsLastMonth) / clientsLastMonth) * 100
      : 0;
  const projectGrowth =
    projectsLastMonth > 0
      ? ((projectsThisMonth - projectsLastMonth) / projectsLastMonth) * 100
      : 0;
  const contactGrowth =
    contactsLastMonth > 0
      ? ((contactsThisMonth - contactsLastMonth) / contactsLastMonth) * 100
      : 0;

  // Calculate revenue totals
  const totalRevenue = paidInvoices._sum.amount || 0;
  const pendingRevenue = pendingInvoices._sum.amount || 0;
  const overdueRevenue = overdueInvoices._sum.amount || 0;

  // Monthly revenue data
  const monthlyRevenue = Array(12).fill(0);
  revenueByMonth.forEach((inv) => {
    if (inv.paidDate) {
      const month = inv.paidDate.getMonth();
      monthlyRevenue[month] += inv.amount;
    }
  });

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const maxRevenue = Math.max(...monthlyRevenue, 1);

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold">Analytics</h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Track your business performance and metrics
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-border bg-background p-4 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="p-1.5 sm:p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
            </div>
            {clientGrowth !== 0 && (
              <span
                className={`text-xs font-medium flex items-center gap-1 ${
                  clientGrowth > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {clientGrowth > 0 ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {Math.abs(clientGrowth).toFixed(0)}%
              </span>
            )}
          </div>
          <div className="mt-4">
            <p className="text-2xl font-bold">{totalClients}</p>
            <p className="text-sm text-muted-foreground">Total Clients</p>
            <p className="text-xs text-muted-foreground mt-1">
              +{clientsThisMonth} this month
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-background p-6">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30">
              <Briefcase className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
            {projectGrowth !== 0 && (
              <span
                className={`text-xs font-medium flex items-center gap-1 ${
                  projectGrowth > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {projectGrowth > 0 ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {Math.abs(projectGrowth).toFixed(0)}%
              </span>
            )}
          </div>
          <div className="mt-4">
            <p className="text-2xl font-bold">{totalProjects}</p>
            <p className="text-sm text-muted-foreground">Total Projects</p>
            <p className="text-xs text-muted-foreground mt-1">
              +{projectsThisMonth} this month
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-background p-6">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-900/30">
              <Mail className="h-5 w-5 text-amber-600 dark:text-amber-400" />
            </div>
            {contactGrowth !== 0 && (
              <span
                className={`text-xs font-medium flex items-center gap-1 ${
                  contactGrowth > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {contactGrowth > 0 ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {Math.abs(contactGrowth).toFixed(0)}%
              </span>
            )}
          </div>
          <div className="mt-4">
            <p className="text-2xl font-bold">{totalContacts}</p>
            <p className="text-sm text-muted-foreground">Inquiries</p>
            <p className="text-xs text-muted-foreground mt-1">
              +{contactsThisMonth} this month
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-background p-6">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
              <DollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-bold">
              ${totalRevenue.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">Total Revenue</p>
            <p className="text-xs text-muted-foreground mt-1">
              {totalInvoices} invoices total
            </p>
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="rounded-xl border border-border bg-background p-4 sm:p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-semibold">Revenue Overview</h2>
            <p className="text-sm text-muted-foreground">
              Monthly revenue for {now.getFullYear()}
            </p>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-muted-foreground">Paid</span>
            </div>
          </div>
        </div>
        <div className="h-64 flex items-end justify-between gap-2">
          {monthlyRevenue.map((amount, index) => (
            <div
              key={index}
              className="flex-1 flex flex-col items-center gap-2"
            >
              <div
                className="w-full bg-green-500/80 rounded-t-sm transition-all hover:bg-green-500"
                style={{
                  height: `${(amount / maxRevenue) * 100}%`,
                  minHeight: amount > 0 ? "4px" : "0",
                }}
                title={`$${amount.toLocaleString()}`}
              />
              <span className="text-xs text-muted-foreground">
                {monthNames[index]}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2">
        {/* Revenue Breakdown */}
        <div className="rounded-xl border border-border bg-background p-6">
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="h-5 w-5 text-muted-foreground" />
            <h2 className="font-semibold">Revenue Breakdown</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span>Paid</span>
              </div>
              <span className="font-semibold">
                ${totalRevenue.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <span>Pending</span>
              </div>
              <span className="font-semibold">
                ${pendingRevenue.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span>Overdue</span>
              </div>
              <span className="font-semibold">
                ${overdueRevenue.toLocaleString()}
              </span>
            </div>
            <div className="border-t border-border pt-4 mt-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">Total Outstanding</span>
                <span className="font-bold">
                  ${(pendingRevenue + overdueRevenue).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Project Status */}
        <div className="rounded-xl border border-border bg-background p-6">
          <div className="flex items-center gap-2 mb-4">
            <Target className="h-5 w-5 text-muted-foreground" />
            <h2 className="font-semibold">Project Status</h2>
          </div>
          <div className="space-y-3">
            {projectsByStatus.map((item) => {
              const percentage =
                totalProjects > 0 ? (item._count / totalProjects) * 100 : 0;
              const colorClass =
                item.status === "Completed"
                  ? "bg-green-500"
                  : item.status === "In Progress"
                  ? "bg-blue-500"
                  : item.status === "On Hold"
                  ? "bg-amber-500"
                  : item.status === "Cancelled"
                  ? "bg-red-500"
                  : "bg-gray-500";

              return (
                <div key={item.status}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>{item.status}</span>
                    <span className="text-muted-foreground">
                      {item._count} ({percentage.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className={`h-full ${colorClass} rounded-full transition-all`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
            {projectsByStatus.length === 0 && (
              <p className="text-muted-foreground text-center py-4">
                No projects yet
              </p>
            )}
          </div>
        </div>

        {/* Contact Status */}
        <div className="rounded-xl border border-border bg-background p-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="h-5 w-5 text-muted-foreground" />
            <h2 className="font-semibold">Inquiry Status</h2>
          </div>
          <div className="space-y-3">
            {contactsByStatus.map((item) => {
              const percentage =
                totalContacts > 0 ? (item._count / totalContacts) * 100 : 0;
              const colorClass =
                item.status === "Resolved"
                  ? "bg-green-500"
                  : item.status === "In Progress"
                  ? "bg-blue-500"
                  : item.status === "Pending"
                  ? "bg-amber-500"
                  : "bg-gray-500";

              return (
                <div key={item.status}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>{item.status}</span>
                    <span className="text-muted-foreground">
                      {item._count} ({percentage.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="h-2 bg-secondary rounded-full overflow-hidden">
                    <div
                      className={`h-full ${colorClass} rounded-full transition-all`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
            {contactsByStatus.length === 0 && (
              <p className="text-muted-foreground text-center py-4">
                No inquiries yet
              </p>
            )}
          </div>
        </div>

        {/* Project Categories */}
        <div className="rounded-xl border border-border bg-background p-6">
          <div className="flex items-center gap-2 mb-4">
            <CalendarDays className="h-5 w-5 text-muted-foreground" />
            <h2 className="font-semibold">Project Categories</h2>
          </div>
          <div className="space-y-3">
            {projectsByCategory.map((item) => {
              const totalCategorized = projectsByCategory.reduce(
                (acc, curr) => acc + curr._count,
                0
              );
              const percentage =
                totalCategorized > 0
                  ? (item._count / totalCategorized) * 100
                  : 0;

              return (
                <div
                  key={item.category}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm">{item.category}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-2 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-8">
                      {item._count}
                    </span>
                  </div>
                </div>
              );
            })}
            {projectsByCategory.length === 0 && (
              <p className="text-muted-foreground text-center py-4">
                No categorized projects yet
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Conversion Metrics */}
      <div className="rounded-xl border border-border bg-background p-4 sm:p-6">
        <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">
          Key Metrics
        </h2>
        <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
          <div className="text-center p-4 rounded-lg bg-secondary/50">
            <p className="text-3xl font-bold text-primary">
              {totalProjects > 0 && totalContacts > 0
                ? ((totalProjects / totalContacts) * 100).toFixed(0)
                : 0}
              %
            </p>
            <p className="text-sm text-muted-foreground">
              Lead to Project Rate
            </p>
          </div>
          <div className="text-center p-4 rounded-lg bg-secondary/50">
            <p className="text-3xl font-bold text-primary">
              $
              {totalProjects > 0
                ? (totalRevenue / totalProjects).toFixed(0)
                : 0}
            </p>
            <p className="text-sm text-muted-foreground">Avg. Project Value</p>
          </div>
          <div className="text-center p-4 rounded-lg bg-secondary/50">
            <p className="text-3xl font-bold text-primary">
              ${totalClients > 0 ? (totalRevenue / totalClients).toFixed(0) : 0}
            </p>
            <p className="text-sm text-muted-foreground">
              Avg. Revenue per Client
            </p>
          </div>
          <div className="text-center p-4 rounded-lg bg-secondary/50">
            <p className="text-3xl font-bold text-primary">
              {totalInvoices > 0
                ? (
                    ((paidInvoices._sum.amount || 0) /
                      ((paidInvoices._sum.amount || 0) +
                        (pendingInvoices._sum.amount || 0) +
                        (overdueInvoices._sum.amount || 0))) *
                    100
                  ).toFixed(0)
                : 0}
              %
            </p>
            <p className="text-sm text-muted-foreground">Collection Rate</p>
          </div>
        </div>
      </div>
    </div>
  );
}

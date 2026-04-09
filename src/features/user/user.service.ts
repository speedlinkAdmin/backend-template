import { prisma } from '@lib/prisma';


export const getDashboardStats = async () => {
  const [totalUsers, totalClasses, totalAttendance, totalGrades] = await Promise.all([
    prisma.user.count(),
    prisma.class.count(),
    prisma.attendance.count(),
    prisma.grade.count(),
  ]);

  return {
      totalUsers,
      totalClasses,
      totalAttendance,
      totalGrades,
    }
}

export const getRecentActivities = async () => {
  const recentUsers = await prisma.user.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    select: { id: true, name: true, email: true, createdAt: true },
  });

  return recentUsers;
}

export type AccessStatus = 'Active' | 'Pending' | 'Review';

export interface DashboardStat {
  title: string;
  value: string;
  trend: string;
  tone: 'blue' | 'green' | 'amber' | 'violet';
}

export interface AccessRecord {
  id: string;
  department: string;
  access: string;
  owner: string;
  risk: 'Low' | 'Medium' | 'High';
  status: AccessStatus;
  updatedAt: string;
}

export interface ActivityEvent {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: 'sync' | 'access' | 'admin' | 'security';
}

export interface AccessLog {
  id: string;
  actor: string;
  action: string;
  location: string;
  time: string;
  result: 'Allowed' | 'Flagged';
}

export interface ChartPoint {
  label: string;
  value: number;
}

export interface UserAccessProfile {
  userId: string;
  displayName: string;
  roleLabel: string;
  department: string;
  accessLevel: string;
  accountStatus: string;
  lastLogin: string;
}

export interface DashboardData {
  profile: UserAccessProfile;
  stats: DashboardStat[];
  records: AccessRecord[];
  activity: ActivityEvent[];
  accessLogs: AccessLog[];
  chart: ChartPoint[];
  syncStatus: {
    state: 'Synced' | 'Syncing' | 'Delayed';
    lastSync: string;
    queueDepth: number;
  };
}

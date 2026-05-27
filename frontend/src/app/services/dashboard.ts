import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { MockApiService } from '../core/services/mock-api.service';
import { AuthSession } from '../models/user.model';
import {
  AccessRecord,
  DashboardData,
  UserAccessProfile
} from '../models/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private mockApi: MockApiService) {}

  getDashboardData(session: AuthSession, delayMs = 1200): Observable<DashboardData> {
    const profile = this.buildProfile(session);
    const records = this.buildRecords(profile, session.role === 'admin');
    const highRiskCount = records.filter((record) => record.risk === 'High').length;

    const dashboardData: DashboardData = {
      profile,
      stats: [
        {
          title: session.role === 'admin' ? 'Total Records' : 'My Records',
          value: session.role === 'admin' ? '148' : String(records.length),
          trend: session.role === 'admin' ? '+12.4%' : `${profile.department} scope`,
          tone: 'blue'
        },
        {
          title: session.role === 'admin' ? 'Active Users' : 'Access Level',
          value: session.role === 'admin' ? '86' : profile.accessLevel,
          trend: session.role === 'admin' ? '+8 this week' : profile.accountStatus,
          tone: 'green'
        },
        {
          title: 'Sync Jobs',
          value: session.role === 'admin' ? '12' : '3',
          trend: session.role === 'admin' ? '3 queued' : 'User scoped',
          tone: 'violet'
        },
        {
          title: 'Risk Reviews',
          value: String(highRiskCount),
          trend: highRiskCount > 0 ? 'Review required' : 'No critical risk',
          tone: 'amber'
        }
      ],

      records,

      activity: [
        {
          id: 'ACT-001',
          title: session.role === 'admin' ? 'Identity sync completed' : 'Your access scope refreshed',
          description: session.role === 'admin'
            ? 'Azure AD connector synced 86 active identities.'
            : `${profile.department} access records were refreshed from the mock API.`,
          timestamp: '09:45 AM',
          type: 'sync'
        },
        {
          id: 'ACT-002',
          title: 'Finance role review requested',
          description: session.role === 'admin'
            ? 'Restricted access policy requires admin approval.'
            : `${profile.accessLevel} policies were evaluated for your session.`,
          timestamp: '09:21 AM',
          type: 'security'
        },
        {
          id: 'ACT-003',
          title: session.role === 'admin' ? 'Admin user updated' : 'Profile loaded',
          description: session.role === 'admin'
            ? 'Nisha Rao promoted a user to admin role.'
            : `${profile.displayName} profile restored during app load.`,
          timestamp: '08:58 AM',
          type: 'admin'
        },
        {
          id: 'ACT-004',
          title: session.role === 'admin' ? 'Operations access flagged' : 'Access table prepared',
          description: session.role === 'admin'
            ? 'High privilege access detected outside policy window.'
            : 'Dummy records were filtered for the logged-in user context.',
          timestamp: '08:36 AM',
          type: 'access'
        }
      ],

      accessLogs: [
        {
          id: 'LOG-001',
          actor: session.userId,
          action: session.role === 'admin'
            ? 'Viewed enterprise verification report'
            : 'Viewed assigned verification report',
          location: 'Mumbai, IN',
          time: '09:52 AM',
          result: 'Allowed'
        },
        {
          id: 'LOG-002',
          actor: session.role === 'admin' ? 'dev.malhotra' : session.userId,
          action: session.role === 'admin'
            ? 'Attempted security settings update'
            : 'Requested elevated department access',
          location: 'Delhi, IN',
          time: '09:27 AM',
          result: 'Flagged'
        },
        {
          id: 'LOG-003',
          actor: session.role === 'admin' ? 'priya.nair' : session.userId,
          action: session.role === 'admin'
            ? 'Exported finance audit packet'
            : 'Checked personal access summary',
          location: 'Bengaluru, IN',
          time: '09:11 AM',
          result: 'Allowed'
        }
      ],

      chart: [
        { label: 'Mon', value: session.role === 'admin' ? 34 : 12 },
        { label: 'Tue', value: session.role === 'admin' ? 52 : 19 },
        { label: 'Wed', value: session.role === 'admin' ? 47 : 15 },
        { label: 'Thu', value: session.role === 'admin' ? 61 : 23 },
        { label: 'Fri', value: session.role === 'admin' ? 73 : 28 },
        { label: 'Sat', value: session.role === 'admin' ? 44 : 9 },
        { label: 'Sun', value: session.role === 'admin' ? 58 : 17 }
      ],

      syncStatus: {
        state: 'Synced',
        lastSync: '2 minutes ago',
        queueDepth: session.role === 'admin' ? 3 : 1
      }
    };

    return this.mockApi.getDashboardData(dashboardData, delayMs);

  }

  private buildProfile(session: AuthSession): UserAccessProfile {
    const departments = ['Engineering', 'Finance', 'Human Resources', 'Operations', 'Security'];
    const userIndex = Math.abs(
      session.userId.split('').reduce((total, char) => total + char.charCodeAt(0), 0)
    ) % departments.length;

    return {
      userId: session.userId,
      displayName: this.toDisplayName(session.userId),
      roleLabel: session.role === 'admin' ? 'Administrator' : 'General User',
      department: session.role === 'admin' ? 'Enterprise Operations' : departments[userIndex],
      accessLevel: session.role === 'admin' ? 'L4 - Global Admin' : 'L2 - Department Access',
      accountStatus: 'Active',
      lastLogin: new Date(session.loginAt).toLocaleString()
    };
  }

  private buildRecords(profile: UserAccessProfile, isAdmin: boolean): AccessRecord[] {
    const records: AccessRecord[] = [
      {
        id: 'REC-001',
        department: 'Engineering',
        access: 'Full Access',
        owner: 'Aarav Mehta',
        risk: 'Low',
        status: 'Active',
        updatedAt: '3 min ago'
      },
      {
        id: 'REC-002',
        department: 'Finance',
        access: 'Restricted',
        owner: 'Priya Nair',
        risk: 'Medium',
        status: 'Pending',
        updatedAt: '18 min ago'
      },
      {
        id: 'REC-003',
        department: 'Human Resources',
        access: 'Read Only',
        owner: 'Nisha Rao',
        risk: 'Low',
        status: 'Active',
        updatedAt: '41 min ago'
      },
      {
        id: 'REC-004',
        department: 'Operations',
        access: 'Full Access',
        owner: 'Kabir Sharma',
        risk: 'High',
        status: 'Review',
        updatedAt: '1 hr ago'
      },
      {
        id: 'REC-005',
        department: 'Security',
        access: 'Privileged Review',
        owner: profile.displayName,
        risk: isAdmin ? 'Medium' : 'High',
        status: isAdmin ? 'Active' : 'Review',
        updatedAt: '2 hr ago'
      }
    ];

    if (isAdmin) {
      return records;
    }

    const scopedRecords = records.filter((record) => record.department === profile.department);
    const personalRecord: AccessRecord = {
      id: 'REC-ME',
      department: profile.department,
      access: profile.accessLevel,
      owner: profile.displayName,
      risk: 'Low',
      status: 'Active',
      updatedAt: 'Just now'
    };

    return [personalRecord, ...scopedRecords];
  }

  private toDisplayName(userId: string): string {
    return userId
      .replace(/[._-]+/g, ' ')
      .split(' ')
      .filter(Boolean)
      .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
      .join(' ') || 'MPloyChek User';
  }

}

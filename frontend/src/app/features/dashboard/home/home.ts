import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SessionContextService } from '../../../core/services/session-context.service';
import {
  AccessLog,
  AccessRecord,
  ActivityEvent,
  ChartPoint,
  DashboardStat,
  UserAccessProfile
} from '../../../models/dashboard.model';
import { AuthSession } from '../../../models/user.model';
import { DashboardService } from '../../../services/dashboard';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrls: ['./home.scss']
})
export class Home implements OnInit {

  user: AuthSession | null = null;

  profile: UserAccessProfile | null = null;

  stats: DashboardStat[] = [];

  records: AccessRecord[] = [];

  activity: ActivityEvent[] = [];

  accessLogs: AccessLog[] = [];

  chart: ChartPoint[] = [];

  syncStatus = {
    state: 'Syncing',
    lastSync: 'Preparing sync',
    queueDepth: 0
  };

  isLoading: boolean = true;

  constructor(
    private dashboardService: DashboardService,
    private sessionContext: SessionContextService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {

    this.user = this.sessionContext.getSnapshot();

    if (!this.user) {
      this.isLoading = false;
      return;
    }

    this.dashboardService.getDashboardData(this.user, 1400).subscribe({
      next: (data) => {
        this.profile = data.profile;
        this.stats = data.stats;
        this.records = data.records;
        this.activity = data.activity;
        this.accessLogs = data.accessLogs;
        this.chart = data.chart;
        this.syncStatus = data.syncStatus;
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });

  }

  getChartHeight(value: number): string {
    const maxValue = Math.max(...this.chart.map((point) => point.value), 1);
    return `${Math.max((value / maxValue) * 100, 12)}%`;
  }

}

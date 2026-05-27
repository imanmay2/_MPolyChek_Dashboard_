import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Sidebar } from '../../shared/sidebar/sidebar';
import { Navbar } from '../../shared/navbar/navbar';
import { Toast } from '../../shared/toast/toast';

@Component({
  selector: 'app-dashboard-layout',
  imports: [
    RouterOutlet,
    Sidebar,
    Navbar,
    Toast
  ],
  templateUrl: './dashboard-layout.html',
  styleUrl: './dashboard-layout.scss'
})
export class DashboardLayout {

}

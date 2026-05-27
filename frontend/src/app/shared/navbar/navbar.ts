import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';
import { SessionContextService } from '../../core/services/session-context.service';
import { AuthSession } from '../../models/user.model';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  private readonly authService = inject(AuthService);
  private readonly sessionContext = inject(SessionContextService);

  readonly session: AuthSession | null = this.sessionContext.getSnapshot();

  logout(): void {
    this.authService.logout();
  }
}

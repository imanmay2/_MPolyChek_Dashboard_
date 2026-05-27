import { Component } from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { Router } from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AuthService } from '../../../core/services/auth.service';
import { SessionContextService } from '../../../core/services/session-context.service';
import { LoginPayload } from '../../../models/user.model';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {

  loginForm: FormGroup;

  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private sessionContext: SessionContextService
  ) {

    this.loginForm = this.fb.group({
      userId: ['', Validators.required],
      password: ['', Validators.required],
      role: ['', Validators.required]
    });

  }

  onLogin() {

    if (this.loginForm.invalid) {

      this.loginForm.markAllAsTouched();

      return;
    }

    this.isLoading = true;

    const formData = this.loginForm.getRawValue() as LoginPayload;

    this.authService.login(formData).subscribe({
      next: (session) => {
        this.isLoading = false;
        this.sessionContext.refresh();

        if (session.role === 'admin') {
          void this.router.navigate(['/admin']);
          return;
        }

        void this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.isLoading = false;
      }
    });

  }

}

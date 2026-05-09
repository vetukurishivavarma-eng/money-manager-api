import { Component, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TransactionService } from '../transaction.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="auth-box">
        <div class="auth-header">
          <a routerLink="/" class="back-link">
            <span class="back-icon">←</span>
          </a>
          <h1>Create Account</h1>
          <p>Start managing your finances today</p>
        </div>

        @if (error) {
          <div class="error-message">{{ error }}</div>
        }

        @if (success) {
          <div class="success-message">{{ success }}</div>
        }

        <form (ngSubmit)="onRegister()">
          <div class="form-group">
            <label>Full Name</label>
            <input type="text" [(ngModel)]="name" name="name" placeholder="Enter your name" required>
          </div>
          <div class="form-group">
            <label>Email</label>
            <input type="email" [(ngModel)]="email" name="email" placeholder="Enter your email" required>
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" [(ngModel)]="password" name="password" placeholder="Create a password" required minlength="6">
          </div>
          <div class="form-group">
            <label>Confirm Password</label>
            <input type="password" [(ngModel)]="confirmPassword" name="confirmPassword" placeholder="Confirm your password" required>
          </div>
          <button type="submit" class="btn-primary" [disabled]="loading">
            {{ loading ? 'Creating account...' : 'Create Account' }}
          </button>
        </form>

        <div class="divider">
          <span>or continue with</span>
        </div>

        <button class="btn-google" (click)="signInWithGoogle()" [disabled]="loading">
          <svg class="google-icon" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Sign up with Google
        </button>

        <p class="auth-footer">
          Already have an account? <a routerLink="/login">Sign in</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
      padding: 2rem;
    }

    .auth-box {
      background: rgba(30, 41, 59, 0.9);
      backdrop-filter: blur(20px);
      border-radius: 24px;
      padding: 3rem;
      width: 100%;
      max-width: 420px;
      box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .auth-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .back-link {
      display: inline-block;
      margin-bottom: 1.5rem;
      color: rgba(255, 255, 255, 0.6);
      text-decoration: none;
      font-size: 24px;
      transition: color 0.3s;
    }

    .back-link:hover {
      color: white;
    }

    .auth-header h1 {
      font-size: 28px;
      margin-bottom: 0.5rem;
      background: linear-gradient(135deg, #60a5fa, #a78bfa);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .auth-header p {
      color: rgba(255, 255, 255, 0.6);
    }

    .error-message {
      background: rgba(239, 68, 68, 0.2);
      border: 1px solid rgba(239, 68, 68, 0.4);
      color: #f87171;
      padding: 1rem;
      border-radius: 12px;
      margin-bottom: 1.5rem;
      text-align: center;
      font-size: 14px;
    }

    .success-message {
      background: rgba(34, 197, 94, 0.2);
      border: 1px solid rgba(34, 197, 94, 0.4);
      color: #4ade80;
      padding: 1rem;
      border-radius: 12px;
      margin-bottom: 1.5rem;
      text-align: center;
      font-size: 14px;
    }

    .form-group {
      margin-bottom: 1.25rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      color: rgba(255, 255, 255, 0.8);
      font-size: 14px;
      font-weight: 500;
    }

    .form-group input {
      width: 100%;
      padding: 1rem;
      background: rgba(0, 0, 0, 0.4);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      color: white;
      font-size: 16px;
      transition: all 0.3s;
    }

    .form-group input:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 15px rgba(59, 130, 246, 0.3);
    }

    .form-group input::placeholder {
      color: rgba(255, 255, 255, 0.4);
    }

    .btn-primary {
      width: 100%;
      background: linear-gradient(135deg, #3b82f6, #8b5cf6);
      color: white;
      border: none;
      padding: 1rem;
      border-radius: 12px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
      margin-top: 0.5rem;
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(59, 130, 246, 0.5);
    }

    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .divider {
      display: flex;
      align-items: center;
      margin: 2rem 0;
      color: rgba(255, 255, 255, 0.4);
      font-size: 14px;
    }

    .divider::before,
    .divider::after {
      content: '';
      flex: 1;
      height: 1px;
      background: rgba(255, 255, 255, 0.1);
    }

    .divider span {
      padding: 0 1rem;
    }

    .btn-google {
      width: 100%;
      background: white;
      color: #333;
      border: none;
      padding: 1rem;
      border-radius: 12px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      transition: all 0.3s;
    }

    .btn-google:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
    }

    .btn-google:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .google-icon {
      width: 24px;
      height: 24px;
    }

    .auth-footer {
      text-align: center;
      margin-top: 2rem;
      color: rgba(255, 255, 255, 0.6);
      font-size: 14px;
    }

    .auth-footer a {
      color: #60a5fa;
      text-decoration: none;
      font-weight: 600;
    }

    .auth-footer a:hover {
      text-decoration: underline;
    }
  `]
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  error = '';
  success = '';
  loading = false;

  constructor(
    private transactionService: TransactionService,
    private router: Router,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) {}

  onRegister() {
    if (!this.name || !this.email || !this.password || !this.confirmPassword) {
      this.error = 'Please fill in all fields';
      this.cdr.detectChanges();
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.error = 'Passwords do not match';
      this.cdr.detectChanges();
      return;
    }

    if (this.password.length < 6) {
      this.error = 'Password must be at least 6 characters';
      this.cdr.detectChanges();
      return;
    }

    this.loading = true;
    this.error = '';
    this.cdr.detectChanges();

    this.transactionService.register(this.email, this.password, this.name).subscribe({
      next: (data) => {
        this.transactionService.storeAuthData(data);
        this.ngZone.run(() => {
          this.success = 'Account created successfully!';
          this.loading = false;
          this.cdr.detectChanges();
          setTimeout(() => {
            this.router.navigate(['/dashboard']).then(() => {
              window.location.reload();
            });
          }, 1500);
        });
      },
      error: (err) => {
        this.ngZone.run(() => {
          this.loading = false;
          let errorMessage = 'Registration failed. Email may already be in use.';
          if (err.status === 400 && err.error) {
            if (typeof err.error === 'string') {
              errorMessage = err.error;
            } else if (err.error.error) {
              errorMessage = err.error.error;
            }
          } else if (err.status === 0) {
            errorMessage = 'Unable to connect to server. Please try again.';
          }
          this.error = errorMessage;
          this.cdr.detectChanges();
        });
      }
    });
  }

  signInWithGoogle() {
    this.loading = true;
    this.error = '';
    this.cdr.detectChanges();

    const email = prompt('Enter your Google email:');
    const name = prompt('Enter your name:');
    if (email && name) {
      this.transactionService.googleAuth('google-' + Date.now(), email, name).subscribe({
        next: (data) => {
          this.transactionService.storeAuthData(data);
          this.ngZone.run(() => {
            this.loading = false;
            this.cdr.detectChanges();
            this.router.navigate(['/dashboard']).then(() => {
              window.location.reload();
            });
          });
        },
        error: (err) => {
          this.ngZone.run(() => {
            this.loading = false;
            this.error = err.error?.error || 'Google authentication failed';
            this.cdr.detectChanges();
          });
        }
      });
    } else {
      this.loading = false;
      this.cdr.detectChanges();
    }
  }
}
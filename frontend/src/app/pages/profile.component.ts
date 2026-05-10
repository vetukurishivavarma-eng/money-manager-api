import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TransactionService, User } from '../transaction.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="profile-container">
      <header class="header">
        <a routerLink="/dashboard" class="back-link">
          <span class="back-icon">←</span> Back
        </a>
        <span class="logo">MoneyFlow</span>
        <div></div>
      </header>

      <div class="profile-content">
        <!-- Profile Card -->
        <div class="profile-card">
          <div class="avatar-section">
            <div class="avatar" (click)="triggerFileInput()">
              @if (hasProfileImage()) {
                <img [src]="profileImageUrl" alt="Profile" class="avatar-image">
              } @else {
                <span class="avatar-text">{{ getInitials() }}</span>
              }
              <div class="edit-badge">📷</div>
            </div>
            <input type="file" #fileInput accept="image/*" style="display: none" (change)="onFileSelected($event)">
          </div>
          <h2 class="user-name" (click)="openEditModal()">
            {{ currentUser?.name || 'User' }} <span class="edit-icon">✏️</span>
          </h2>
          <p class="user-email">{{ currentUser?.email }}</p>
          <div class="unique-id-badge">
            <span class="unique-id-text">{{ generateUserId() }}</span>
          </div>
        </div>

        <!-- Account Info Section -->
        <div class="section">
          <h3 class="section-title">Account Information</h3>

          <div class="info-row">
            <span class="info-label">Full Name</span>
            <span class="info-value-editable" (click)="openEditModal()">
              {{ currentUser?.name || 'Not set' }} ✏️
            </span>
          </div>
          <div class="divider"></div>

          <div class="info-row">
            <span class="info-label">Email</span>
            <span class="info-value">{{ currentUser?.email || 'Not set' }}</span>
          </div>
          <div class="divider"></div>

          <div class="info-row">
            <span class="info-label">Login Method</span>
            <div class="auth-provider-badge">
              <span>{{ getAuthProviderIcon() }}</span>
              <span class="auth-provider-text">{{ getAuthProviderName() }}</span>
            </div>
          </div>
          <div class="divider"></div>

          <div class="info-row">
            <span class="info-label">Unique User ID</span>
            <span class="info-value-unique">{{ generateUserId() }}</span>
          </div>
        </div>

        <!-- Profile Picture Section -->
        <div class="section">
          <h3 class="section-title">Profile Picture</h3>
          <button class="upload-button" (click)="triggerFileInput()">
            📷 Change Profile Picture
          </button>
          @if (hasProfileImage()) {
            <p class="image-status">✓ Profile picture saved</p>
          }
        </div>

        <!-- App Info Section -->
        <div class="section">
          <h3 class="section-title">App Info</h3>

          <div class="info-row">
            <span class="info-label">App Version</span>
            <span class="info-value-small">1.0.0</span>
          </div>
          <div class="divider"></div>

          <div class="info-row">
            <span class="info-label">Backend Server</span>
            <span class="info-value-small">localhost:8080</span>
          </div>
        </div>

        <!-- Logout Button -->
        <button class="logout-button" (click)="logout()">
          Logout
        </button>

        <p class="footer">MoneyFlow v1.0.0</p>
      </div>

      <!-- Edit Name Modal -->
      @if (showEditModal) {
        <div class="modal-overlay" (click)="closeEditModal()">
          <div class="modal-content" (click)="$event.stopPropagation()">
            <h3 class="modal-title">Edit Name</h3>
            <input
              type="text"
              class="modal-input"
              [(ngModel)]="editName"
              placeholder="Enter your name"
              autofocus
            >
            <div class="modal-buttons">
              <button class="modal-cancel-button" (click)="closeEditModal()">Cancel</button>
              <button class="modal-save-button" (click)="saveName()" [disabled]="saving">
                @if (saving) {
                  <span class="loading-spinner">...</span>
                } @else {
                  Save
                }
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .profile-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
      color: white;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 5%;
      background: rgba(15, 12, 41, 0.8);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      position: sticky;
      top: 0;
      z-index: 100;
    }

    .back-link {
      color: rgba(255, 255, 255, 0.7);
      text-decoration: none;
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: color 0.3s;
    }

    .back-link:hover {
      color: white;
    }

    .logo {
      font-size: 20px;
      font-weight: 700;
      background: linear-gradient(135deg, #60a5fa, #a78bfa);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .profile-content {
      padding: 2rem 5%;
      max-width: 600px;
      margin: 0 auto;
    }

    .profile-card {
      background: rgba(30, 41, 59, 0.8);
      backdrop-filter: blur(20px);
      border-radius: 20px;
      padding: 2rem;
      text-align: center;
      margin-bottom: 1.5rem;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .avatar-section {
      position: relative;
      display: inline-block;
      margin-bottom: 1rem;
    }

    .avatar {
      width: 120px;
      height: 120px;
      border-radius: 60px;
      background: linear-gradient(135deg, #3b82f6, #8b5cf6);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: transform 0.3s;
    }

    .avatar:hover {
      transform: scale(1.05);
    }

    .avatar-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .avatar-text {
      font-size: 48px;
      font-weight: bold;
      color: white;
    }

    .edit-badge {
      position: absolute;
      bottom: 0;
      right: 0;
      background: #3b82f6;
      width: 36px;
      height: 36px;
      border-radius: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
      border: 3px solid rgba(30, 41, 59, 0.8);
    }

    .user-name {
      font-size: 26px;
      font-weight: bold;
      margin-bottom: 0.5rem;
      cursor: pointer;
      display: inline-block;
    }

    .edit-icon {
      font-size: 16px;
      opacity: 0.7;
    }

    .user-email {
      color: rgba(255, 255, 255, 0.6);
      font-size: 14px;
      margin-bottom: 1rem;
    }

    .unique-id-badge {
      display: inline-block;
      background: rgba(96, 165, 250, 0.2);
      padding: 0.5rem 1rem;
      border-radius: 20px;
      border: 1px solid rgba(96, 165, 250, 0.4);
    }

    .unique-id-text {
      font-size: 14px;
      color: #60a5fa;
      font-weight: 600;
      letter-spacing: 1px;
    }

    .section {
      background: rgba(30, 41, 59, 0.8);
      backdrop-filter: blur(20px);
      border-radius: 16px;
      padding: 1.5rem;
      margin-bottom: 1rem;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .section-title {
      font-size: 14px;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.8);
      margin-bottom: 1.5rem;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 0;
    }

    .info-label {
      font-size: 14px;
      color: rgba(255, 255, 255, 0.6);
    }

    .info-value {
      font-size: 14px;
      color: white;
      font-weight: 500;
    }

    .info-value-editable {
      font-size: 14px;
      color: #60a5fa;
      font-weight: 500;
      cursor: pointer;
    }

    .info-value-unique {
      font-size: 12px;
      color: #60a5fa;
      font-weight: 600;
      letter-spacing: 1px;
    }

    .info-value-small {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.5);
    }

    .divider {
      height: 1px;
      background: rgba(255, 255, 255, 0.1);
    }

    .auth-provider-badge {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: rgba(255, 255, 255, 0.1);
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
    }

    .auth-provider-text {
      font-size: 14px;
      color: white;
      font-weight: 500;
    }

    .upload-button {
      width: 100%;
      background: rgba(96, 165, 250, 0.2);
      border: 1px solid rgba(96, 165, 250, 0.4);
      padding: 1rem;
      border-radius: 12px;
      color: #60a5fa;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.3s;
    }

    .upload-button:hover {
      background: rgba(96, 165, 250, 0.3);
      transform: translateY(-2px);
    }

    .image-status {
      color: #4ade80;
      font-size: 12px;
      margin-top: 0.75rem;
      text-align: center;
    }

    .logout-button {
      width: 100%;
      background: rgba(239, 68, 68, 0.2);
      border: 1px solid #f87171;
      padding: 1rem;
      border-radius: 12px;
      color: #f87171;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      margin-top: 0.5rem;
      transition: all 0.3s;
    }

    .logout-button:hover {
      background: rgba(239, 68, 68, 0.4);
    }

    .footer {
      text-align: center;
      color: rgba(255, 255, 255, 0.3);
      font-size: 12px;
      margin-top: 2rem;
    }

    /* Modal */
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      z-index: 1000;
    }

    .modal-content {
      background: rgba(30, 41, 59, 0.95);
      border-radius: 20px;
      padding: 1.5rem;
      width: 100%;
      max-width: 340px;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .modal-title {
      font-size: 20px;
      font-weight: bold;
      text-align: center;
      margin-bottom: 1.25rem;
    }

    .modal-input {
      width: 100%;
      background: rgba(0, 0, 0, 0.4);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 12px;
      padding: 1rem;
      color: white;
      font-size: 16px;
      margin-bottom: 1.25rem;
    }

    .modal-input:focus {
      outline: none;
      border-color: #3b82f6;
    }

    .modal-buttons {
      display: flex;
      gap: 0.75rem;
    }

    .modal-cancel-button {
      flex: 1;
      padding: 0.875rem;
      border-radius: 10px;
      background: rgba(255, 255, 255, 0.1);
      color: rgba(255, 255, 255, 0.7);
      font-size: 16px;
      font-weight: 500;
      border: none;
      cursor: pointer;
    }

    .modal-save-button {
      flex: 1;
      padding: 0.875rem;
      border-radius: 10px;
      background: #3b82f6;
      color: white;
      font-size: 16px;
      font-weight: 600;
      border: none;
      cursor: pointer;
    }

    .modal-save-button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .loading-spinner {
      display: inline-block;
    }
  `]
})
export class ProfileComponent {
  currentUser: User | null = null;
  profileImageUrl: string | null = null;
  showEditModal = false;
  editName = '';
  saving = false;

  constructor(
    private transactionService: TransactionService,
    private router: Router
  ) {
    this.loadUserData();
  }

  private loadUserData(): void {
    const storedUser = this.transactionService.getCurrentUser();
    if (storedUser) {
      this.currentUser = storedUser;
      this.profileImageUrl = storedUser.profileImageUrl || null;
      this.editName = storedUser.name || '';
    }
  }

  getInitials(): string {
    if (!this.currentUser?.name) return '?';
    const name = this.currentUser.name || '';
    return name.charAt(0).toUpperCase();
  }

  hasProfileImage(): boolean {
    return !!(this.profileImageUrl && this.profileImageUrl.trim().length > 0);
  }

  getSafeName(): string {
    return this.currentUser?.name || 'User';
  }

  getSafeEmail(): string {
    return this.currentUser?.email || '';
  }

  generateUserId(): string {
    if (!this.currentUser?.name) return 'MF-USR-000';
    const cleanName = this.currentUser.name.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    const hash = cleanName.split('').reduce((acc: number, char: string) => {
      return ((acc << 5) - acc + char.charCodeAt(0)) | 0;
    }, 0);
    const uniquePart = Math.abs(hash).toString(36).substring(0, 4).toUpperCase();
    return `MF-${cleanName.substring(0, 3)}-${uniquePart}`;
  }

  getAuthProviderIcon(): string {
    if (this.currentUser && this.currentUser.authProvider === 'google') return '🔵';
    if (this.currentUser && this.currentUser.authProvider === 'facebook') return '🟦';
    return '📧';
  }

  getAuthProviderName(): string {
    if (this.currentUser && this.currentUser.authProvider === 'google') return 'Google';
    if (this.currentUser && this.currentUser.authProvider === 'facebook') return 'Facebook';
    return 'Email';
  }

  triggerFileInput(): void {
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (input) input.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        this.profileImageUrl = imageUrl;
        this.saveProfileImage(imageUrl);
      };
      reader.readAsDataURL(input.files[0]);
    }
  }

  saveProfileImage(imageUrl: string): void {
    this.transactionService.updateProfileImage(imageUrl).subscribe({
      next: () => {
        const user = this.transactionService.getCurrentUser();
        if (user) {
          user.profileImageUrl = imageUrl;
          this.transactionService.storeAuthData({ ...user, token: localStorage.getItem('auth_token') || '' } as any);
        }
      },
      error: () => {
        const user = this.transactionService.getCurrentUser();
        if (user) {
          user.profileImageUrl = imageUrl;
          this.transactionService.storeAuthData({ ...user, token: localStorage.getItem('auth_token') || '' } as any);
        }
      }
    });
  }

  openEditModal(): void {
    this.editName = this.currentUser?.name || '';
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
    this.editName = this.currentUser?.name || '';
  }

  saveName(): void {
    if (!this.editName.trim()) return;

    this.saving = true;
    this.transactionService.updateName(this.editName.trim()).subscribe({
      next: () => {
        const user = this.transactionService.getCurrentUser();
        if (user) {
          user.name = this.editName.trim();
          this.transactionService.storeAuthData({ ...user, token: localStorage.getItem('auth_token') || '' } as any);
          this.currentUser = user;
        }
        this.showEditModal = false;
        this.saving = false;
      },
      error: () => {
        this.saving = false;
      }
    });
  }

  logout(): void {
    if (confirm('Are you sure you want to logout?')) {
      this.transactionService.logout();
      this.router.navigate(['/']);
    }
  }
}
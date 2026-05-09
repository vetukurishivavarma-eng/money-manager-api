import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TransactionService, Transaction, Summary } from '../transaction.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="dashboard-container">
      <header class="header">
        <div class="header-left">
          <a routerLink="/" class="logo">MoneyFlow</a>
        </div>
        <nav class="nav">
          <button [class.active]="activeTab === 'dashboard'" (click)="setTab('dashboard')">Dashboard</button>
          <button [class.active]="activeTab === 'transactions'" (click)="setTab('transactions')">Transactions</button>
        </nav>
        <div class="user-menu">
          <div class="user-info">
            <span class="user-name">{{ currentUser?.name }}</span>
            <span class="user-email">{{ currentUser?.email }}</span>
          </div>
          <button class="btn-logout" (click)="logout()">Logout</button>
        </div>
      </header>

      <main class="main-content">
        @if (activeTab === 'dashboard') {
          <div class="dashboard-content">
            <div class="welcome-section">
              <h1>Welcome back, {{ currentUser?.name }}</h1>
              <p>Here's your financial overview</p>
            </div>

            <div class="summary-cards">
              <div class="card balance-card">
                <div class="card-icon">💰</div>
                <div class="card-content">
                  <span class="card-label">Current Balance</span>
                  <span class="card-value">\${{ summary.balance | number:'1.2-2' }}</span>
                </div>
              </div>
              <div class="card income-card">
                <div class="card-icon">📈</div>
                <div class="card-content">
                  <span class="card-label">Total Income</span>
                  <span class="card-value income">\${{ summary.totalIncome | number:'1.2-2' }}</span>
                </div>
              </div>
              <div class="card expense-card">
                <div class="card-icon">📉</div>
                <div class="card-content">
                  <span class="card-label">Total Expenses</span>
                  <span class="card-value expense">\${{ summary.totalExpense | number:'1.2-2' }}</span>
                </div>
              </div>
            </div>

            <div class="content-grid">
              <div class="recent-transactions">
                <div class="section-header">
                  <h2>Recent Transactions</h2>
                  <button class="btn-link" (click)="setTab('transactions')">View All</button>
                </div>
                <div class="transaction-list">
                  @for (t of getRecentTransactions(); track t.id) {
                    <div class="transaction-item" [class.income]="t.type === 'INCOME'" [class.expense]="t.type === 'EXPENSE'">
                      <div class="transaction-icon">{{ t.type === 'INCOME' ? '↑' : '↓' }}</div>
                      <div class="transaction-details">
                        <span class="description">{{ t.description }}</span>
                        <span class="date">{{ t.date | date:'MMM d, y' }}</span>
                      </div>
                      <span class="amount" [class.income]="t.type === 'INCOME'" [class.expense]="t.type === 'EXPENSE'">
                        {{ t.type === 'INCOME' ? '+' : '-' }}\${{ t.amount | number:'1.2-2' }}
                      </span>
                    </div>
                  }
                  @if (getRecentTransactions().length === 0) {
                    <div class="empty-state">
                      <span class="empty-icon">📝</span>
                      <p>No transactions yet. Add your first transaction to get started!</p>
                    </div>
                  }
                </div>
              </div>

              <div class="add-transaction-form">
                <h2>Add Transaction</h2>
                <form (ngSubmit)="addTransaction()">
                  <div class="form-group">
                    <label>Amount</label>
                    <input type="number" [(ngModel)]="newAmount" name="amount" min="0" step="0.01" placeholder="0.00" required>
                  </div>
                  <div class="form-group">
                    <label>Description</label>
                    <input type="text" [(ngModel)]="newDescription" name="description" placeholder="What's this for?" required>
                  </div>
                  <div class="form-group">
                    <label>Type</label>
                    <select [(ngModel)]="newType" name="type">
                      <option value="EXPENSE">Expense</option>
                      <option value="INCOME">Income</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label>Date</label>
                    <input type="date" [(ngModel)]="newDate" name="date" required>
                  </div>
                  <button type="submit" class="btn-primary" [disabled]="loading">
                    {{ loading ? 'Adding...' : 'Add Transaction' }}
                  </button>
                </form>
              </div>
            </div>
          </div>
        }

        @if (activeTab === 'transactions') {
          <div class="transactions-content">
            <div class="transactions-header">
              <h1>Transactions</h1>
              <button class="btn-primary" (click)="setTab('dashboard')">
                <span>+</span> Add New
              </button>
            </div>

            <div class="transactions-filters">
              <div class="search-box">
                <input type="text" placeholder="Search transactions..." [(ngModel)]="searchTerm">
              </div>
              <select [(ngModel)]="filterType" class="filter-select">
                <option value="">All Types</option>
                <option value="INCOME">Income</option>
                <option value="EXPENSE">Expense</option>
              </select>
            </div>

            <table class="transactions-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                @for (t of filteredTransactions(); track t.id) {
                  <tr [class.income-row]="t.type === 'INCOME'" [class.expense-row]="t.type === 'EXPENSE'">
                    <td>{{ t.date | date:'MMM d, y' }}</td>
                    <td>{{ t.description }}</td>
                    <td><span class="badge" [class.income]="t.type === 'INCOME'" [class.expense]="t.type === 'EXPENSE'">{{ t.type }}</span></td>
                    <td>
                      <span class="amount" [class.income]="t.type === 'INCOME'" [class.expense]="t.type === 'EXPENSE'">
                        {{ t.type === 'INCOME' ? '+' : '-' }}\${{ t.amount | number:'1.2-2' }}
                      </span>
                    </td>
                    <td><button class="btn-delete" (click)="deleteTransaction(t.id!)">Delete</button></td>
                  </tr>
                }
                @if (filteredTransactions().length === 0) {
                  <tr><td colspan="5" class="empty-row">
                    <div class="empty-state">
                      <span class="empty-icon">📭</span>
                      <p>No transactions found</p>
                    </div>
                  </td></tr>
                }
              </tbody>
            </table>
          </div>
        }
      </main>
    </div>
  `,
  styles: [`
    .dashboard-container {
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

    .logo {
      font-size: 24px;
      font-weight: 700;
      background: linear-gradient(135deg, #60a5fa, #a78bfa);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      text-decoration: none;
    }

    .nav {
      display: flex;
      gap: 0.5rem;
    }

    .nav button {
      background: transparent;
      border: none;
      color: rgba(255, 255, 255, 0.7);
      padding: 0.75rem 1.5rem;
      cursor: pointer;
      border-radius: 10px;
      font-size: 14px;
      font-weight: 500;
      transition: all 0.3s;
    }

    .nav button.active {
      background: linear-gradient(135deg, rgba(59, 130, 246, 0.4), rgba(139, 92, 246, 0.4));
      color: white;
    }

    .nav button:hover:not(.active) {
      background: rgba(255, 255, 255, 0.1);
      color: white;
    }

    .user-menu {
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .user-info {
      text-align: right;
    }

    .user-name {
      display: block;
      color: white;
      font-weight: 600;
      font-size: 14px;
    }

    .user-email {
      display: block;
      color: rgba(255, 255, 255, 0.5);
      font-size: 12px;
    }

    .btn-logout {
      background: rgba(239, 68, 68, 0.2);
      border: 1px solid rgba(239, 68, 68, 0.3);
      color: #f87171;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      cursor: pointer;
      font-size: 12px;
      transition: all 0.3s;
    }

    .btn-logout:hover {
      background: rgba(239, 68, 68, 0.4);
    }

    .main-content {
      padding: 2rem 5%;
      max-width: 1400px;
      margin: 0 auto;
    }

    .welcome-section {
      margin-bottom: 2rem;
    }

    .welcome-section h1 {
      font-size: 32px;
      margin-bottom: 0.5rem;
    }

    .welcome-section p {
      color: rgba(255, 255, 255, 0.6);
    }

    .summary-cards {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .card {
      background: rgba(30, 41, 59, 0.8);
      backdrop-filter: blur(20px);
      border-radius: 20px;
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      border: 1px solid rgba(255, 255, 255, 0.1);
      transition: all 0.3s;
    }

    .card:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    }

    .card-icon {
      font-size: 36px;
      width: 60px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 16px;
      background: rgba(255, 255, 255, 0.1);
    }

    .card-content {
      display: flex;
      flex-direction: column;
    }

    .card-label {
      color: rgba(255, 255, 255, 0.6);
      font-size: 13px;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 0.25rem;
    }

    .card-value {
      font-size: 28px;
      font-weight: 700;
      color: #34d399;
    }

    .card-value.income { color: #4ade80; }
    .card-value.expense { color: #f87171; }

    .content-grid {
      display: grid;
      grid-template-columns: 1fr 400px;
      gap: 2rem;
    }

    .recent-transactions, .add-transaction-form {
      background: rgba(30, 41, 59, 0.8);
      backdrop-filter: blur(20px);
      border-radius: 20px;
      padding: 2rem;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }

    .section-header h2, .add-transaction-form h2 {
      font-size: 20px;
    }

    .btn-link {
      background: none;
      border: none;
      color: #60a5fa;
      cursor: pointer;
      font-size: 14px;
    }

    .btn-link:hover {
      text-decoration: underline;
    }

    .transaction-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .transaction-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      background: rgba(0, 0, 0, 0.3);
      border-radius: 12px;
      border-left: 4px solid #ef4444;
    }

    .transaction-item.income {
      border-left-color: #22c55e;
    }

    .transaction-icon {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 10px;
      font-size: 20px;
      background: rgba(255, 255, 255, 0.1);
    }

    .transaction-item.income .transaction-icon {
      background: rgba(34, 197, 94, 0.2);
      color: #4ade80;
    }

    .transaction-item.expense .transaction-icon {
      background: rgba(239, 68, 68, 0.2);
      color: #f87171;
    }

    .transaction-details {
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .transaction-details .description {
      font-weight: 600;
      margin-bottom: 0.25rem;
    }

    .transaction-details .date {
      color: rgba(255, 255, 255, 0.5);
      font-size: 13px;
    }

    .amount {
      font-weight: 700;
      font-size: 16px;
    }

    .amount.income { color: #4ade80; }
    .amount.expense { color: #f87171; }

    .add-transaction-form h2 {
      margin-bottom: 1.5rem;
    }

    .form-group {
      margin-bottom: 1.25rem;
    }

    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      color: rgba(255, 255, 255, 0.7);
      font-size: 14px;
      font-weight: 500;
    }

    .form-group input, .form-group select {
      width: 100%;
      padding: 0.875rem;
      background: rgba(0, 0, 0, 0.4);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      color: white;
      font-size: 15px;
    }

    .form-group input:focus, .form-group select:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 15px rgba(59, 130, 246, 0.3);
    }

    .form-group select option {
      background: #1e293b;
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
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(59, 130, 246, 0.5);
    }

    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .empty-state {
      text-align: center;
      padding: 3rem;
      color: rgba(255, 255, 255, 0.5);
    }

    .empty-icon {
      font-size: 48px;
      display: block;
      margin-bottom: 1rem;
    }

    /* Transactions Page */
    .transactions-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .transactions-header h1 {
      font-size: 32px;
    }

    .transactions-filters {
      display: flex;
      gap: 1rem;
      margin-bottom: 1.5rem;
    }

    .search-box input {
      padding: 0.75rem 1rem;
      background: rgba(30, 41, 59, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      color: white;
      width: 300px;
    }

    .filter-select {
      padding: 0.75rem 1rem;
      background: rgba(30, 41, 59, 0.8);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      color: white;
      cursor: pointer;
    }

    .transactions-table {
      width: 100%;
      background: rgba(30, 41, 59, 0.8);
      border-radius: 16px;
      overflow: hidden;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .transactions-table th {
      background: rgba(0, 0, 0, 0.3);
      color: rgba(255, 255, 255, 0.6);
      font-weight: 600;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 1px;
      padding: 1rem;
      text-align: left;
    }

    .transactions-table td {
      padding: 1rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }

    .transactions-table tr:last-child td {
      border-bottom: none;
    }

    .badge {
      padding: 0.25rem 0.75rem;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
    }

    .badge.income {
      background: rgba(34, 197, 94, 0.2);
      color: #4ade80;
    }

    .badge.expense {
      background: rgba(239, 68, 68, 0.2);
      color: #f87171;
    }

    .btn-delete {
      background: rgba(239, 68, 68, 0.2);
      color: #f87171;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      cursor: pointer;
      font-size: 12px;
      transition: all 0.3s;
    }

    .btn-delete:hover {
      background: rgba(239, 68, 68, 0.4);
    }

    .empty-row {
      text-align: center;
    }

    @media (max-width: 1024px) {
      .content-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 768px) {
      .header {
        flex-direction: column;
        gap: 1rem;
        padding: 1rem;
      }

      .summary-cards {
        grid-template-columns: 1fr;
      }

      .transactions-filters {
        flex-direction: column;
      }

      .search-box input {
        width: 100%;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  transactions: Transaction[] = [];
  summary: Summary = { totalIncome: 0, totalExpense: 0, balance: 0 };
  activeTab: 'dashboard' | 'transactions' = 'dashboard';
  currentUser: any = null;
  loading = false;

  newAmount = 0;
  newDescription = '';
  newType: 'INCOME' | 'EXPENSE' = 'EXPENSE';
  newDate = new Date().toISOString().split('T')[0];

  searchTerm = '';
  filterType = '';

  constructor(
    private transactionService: TransactionService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    if (!this.transactionService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return;
    }

    this.currentUser = this.transactionService.getCurrentUser();
    this.loadData();
  }

  loadData() {
    this.transactionService.getTransactions().subscribe({
      next: (data) => {
        this.transactions = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        if (err.status === 401) {
          this.logout();
        }
      }
    });

    this.transactionService.getSummary().subscribe({
      next: (data) => {
        this.summary = data;
        this.cdr.detectChanges();
      }
    });
  }

  setTab(tab: 'dashboard' | 'transactions') {
    this.activeTab = tab;
  }

  getRecentTransactions(): Transaction[] {
    return this.transactions.slice(-5).reverse();
  }

  filteredTransactions(): Transaction[] {
    return this.transactions.filter(t => {
      const matchesSearch = t.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesType = !this.filterType || t.type === this.filterType;
      return matchesSearch && matchesType;
    });
  }

  addTransaction() {
    if (this.newAmount <= 0 || !this.newDescription) return;

    this.loading = true;
    const transaction: Transaction = {
      amount: this.newAmount,
      description: this.newDescription,
      type: this.newType,
      date: this.newDate
    };

    this.transactionService.addTransaction(transaction).subscribe({
      next: () => {
        this.loadData();
        this.resetForm();
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loading = false;
        if (err.status === 401) {
          this.logout();
        }
      }
    });
  }

  deleteTransaction(id: number) {
    if (confirm('Are you sure you want to delete this transaction?')) {
      this.transactionService.deleteTransaction(id).subscribe({
        next: () => this.loadData(),
        error: (err) => {
          if (err.status === 401) {
            this.logout();
          }
        }
      });
    }
  }

  resetForm() {
    this.newAmount = 0;
    this.newDescription = '';
    this.newType = 'EXPENSE';
    this.newDate = new Date().toISOString().split('T')[0];
  }

  logout() {
    this.transactionService.logout();
    this.router.navigate(['/']);
  }
}
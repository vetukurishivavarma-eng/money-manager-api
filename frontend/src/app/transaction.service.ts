import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

export interface Transaction {
  id?: number;
  amount: number;
  description: string;
  type: 'INCOME' | 'EXPENSE';
  date: string;
}

export interface Summary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export interface User {
  email: string;
  name: string;
  authProvider: string;
  userId: number;
  profileImageUrl?: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  name: string;
  authProvider: string;
  userId: number;
  profileImageUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  // Using the same backend as the mobile app (Supabase PostgreSQL database)
  private apiUrl = 'https://money-manager-api-f454.onrender.com/api';
  private tokenKey = 'auth_token';
  private userKey = 'auth_user';

  private currentUserSubject = new BehaviorSubject<User | null>(this.getStoredUser());
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem(this.tokenKey);
    const headers: { [key: string]: string } = {
      'Content-Type': 'application/json'
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return new HttpHeaders(headers);
  }

  private getStoredUser(): User | null {
    const userStr = localStorage.getItem(this.userKey);
    return userStr ? JSON.parse(userStr) : null;
  }

  storeAuthData(data: AuthResponse): void {
    localStorage.setItem(this.tokenKey, data.token);
    const user: User = {
      email: data.email,
      name: data.name,
      authProvider: data.authProvider,
      userId: data.userId,
      profileImageUrl: data.profileImageUrl
    };
    localStorage.setItem(this.userKey, JSON.stringify(user));
    this.currentUserSubject.next(user);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  getCurrentUser(): User | null {
    const user = this.currentUserSubject.value;
    if (!user || !user.userId) {
      return this.getStoredUser();
    }
    return user;
  }

  refreshProfile(): Promise<User | null> {
    const token = localStorage.getItem(this.tokenKey);
    if (!token) {
      return Promise.resolve(null);
    }

    const storedUser = this.getStoredUser();

    // First set local user immediately
    if (storedUser) {
      this.currentUserSubject.next(storedUser);
    }

    return new Promise((resolve) => {
      this.http.get<any>(`${this.apiUrl}/auth/me`, { headers: this.getHeaders() }).subscribe({
        next: (data) => {
          if (data.userId) {
            const updatedUser: User = {
              email: data.email || storedUser?.email || '',
              name: data.name || storedUser?.name || '',
              authProvider: data.authProvider || storedUser?.authProvider || 'EMAIL',
              userId: data.userId,
              profileImageUrl: data.profileImageUrl
            };
            this.storeAuthData({
              token: token,
              email: updatedUser.email,
              name: updatedUser.name,
              authProvider: updatedUser.authProvider,
              userId: updatedUser.userId,
              profileImageUrl: updatedUser.profileImageUrl
            });
            resolve(updatedUser);
          } else {
            resolve(storedUser);
          }
        },
        error: () => {
          resolve(storedUser);
        }
      });
    });
  }

  updateProfileImage(imageUrl: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/profile/image`, { profileImageUrl: imageUrl }, { headers: this.getHeaders() });
  }

  updateName(name: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/profile/name`, { name }, { headers: this.getHeaders() });
  }

  register(email: string, password: string, name: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/register`, { email, password, name }, { headers: this.getHeaders() });
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, { email, password }, { headers: this.getHeaders() });
  }

  googleAuth(googleId: string, email: string, name: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/google`, { googleId, email, name }, { headers: this.getHeaders() });
  }

  getTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/transactions`, { headers: this.getHeaders() });
  }

  addTransaction(transaction: Transaction): Observable<Transaction> {
    return this.http.post<Transaction>(`${this.apiUrl}/transactions`, transaction, { headers: this.getHeaders() });
  }

  deleteTransaction(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/transactions/${id}`, { headers: this.getHeaders() });
  }

  getSummary(): Observable<Summary> {
    return this.http.get<Summary>(`${this.apiUrl}/summary`, { headers: this.getHeaders() });
  }
}
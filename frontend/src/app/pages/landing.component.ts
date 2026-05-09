import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="landing-container">
      <nav class="navbar">
        <div class="logo">MoneyFlow</div>
        <div class="nav-links">
          <a routerLink="/login" class="btn-outline">Sign In</a>
          <a routerLink="/register" class="btn-primary-small">Get Started</a>
        </div>
      </nav>

      <section class="hero">
        <div class="hero-content">
          <span class="badge">Financial Freedom Starts Here</span>
          <h1>Take Control of Your <span class="gradient-text">Finances</span></h1>
          <p>Track expenses, manage budgets, and achieve your financial goals with our powerful and intuitive money management platform.</p>
          <div class="hero-buttons">
            <a routerLink="/register" class="btn-primary">Start Free Trial</a>
            <a routerLink="/login" class="btn-secondary">Sign In</a>
          </div>
        </div>
        <div class="hero-graphic">
          <div class="card-float balance">
            <span class="label">Current Balance</span>
            <span class="value">\$12,450.00</span>
            <span class="trend up">+12.5% this month</span>
          </div>
          <div class="card-float income">
            <span class="label">Income</span>
            <span class="value">\$5,200.00</span>
          </div>
          <div class="card-float expense">
            <span class="label">Expenses</span>
            <span class="value">\$2,340.00</span>
          </div>
        </div>
      </section>

      <section class="features">
        <h2>Everything You Need to Manage Your Money</h2>
        <div class="feature-grid">
          <div class="feature-card">
            <div class="icon">📊</div>
            <h3>Smart Dashboard</h3>
            <p>Get a clear overview of your financial health with real-time insights and visualizations.</p>
          </div>
          <div class="feature-card">
            <div class="icon">💸</div>
            <h3>Expense Tracking</h3>
            <p>Track every expense effortlessly and categorize your spending automatically.</p>
          </div>
          <div class="feature-card">
            <div class="icon">📈</div>
            <h3>Budget Planning</h3>
            <p>Set budgets and get alerts when you're approaching your limits.</p>
          </div>
          <div class="feature-card">
            <div class="icon">🔒</div>
            <h3>Secure & Private</h3>
            <p>Your financial data is encrypted and protected with bank-level security.</p>
          </div>
        </div>
      </section>

      <section class="cta-section">
        <div class="cta-content">
          <h2>Ready to Transform Your Financial Life?</h2>
          <p>Join thousands of users who have taken control of their finances.</p>
          <a routerLink="/register" class="btn-cta">Create Free Account</a>
        </div>
      </section>

      <footer class="footer">
        <div class="footer-content">
          <div class="footer-brand">
            <span class="logo">MoneyFlow</span>
            <p>Smart money management for everyone.</p>
          </div>
          <div class="footer-links">
            <a href="#">About</a>
            <a href="#">Features</a>
            <a href="#">Pricing</a>
            <a href="#">Contact</a>
          </div>
        </div>
        <div class="footer-bottom">
          <p>2026 MoneyFlow. Built with Angular & Spring Boot.</p>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    .landing-container {
      min-height: 100vh;
      background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
      color: white;
      overflow-x: hidden;
    }

    .navbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem 5%;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 100;
      background: rgba(15, 12, 41, 0.8);
      backdrop-filter: blur(20px);
    }

    .logo {
      font-size: 24px;
      font-weight: 700;
      background: linear-gradient(135deg, #60a5fa, #a78bfa);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .nav-links {
      display: flex;
      gap: 1rem;
      align-items: center;
    }

    .btn-outline {
      color: white;
      text-decoration: none;
      padding: 0.75rem 1.5rem;
      border: 1px solid rgba(255, 255, 255, 0.3);
      border-radius: 10px;
      transition: all 0.3s;
    }

    .btn-outline:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    .btn-primary-small {
      background: linear-gradient(135deg, #3b82f6, #8b5cf6);
      color: white;
      text-decoration: none;
      padding: 0.75rem 1.5rem;
      border-radius: 10px;
      font-weight: 600;
      transition: all 0.3s;
    }

    .btn-primary-small:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(59, 130, 246, 0.4);
    }

    .hero {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8rem 5% 4rem;
      gap: 4rem;
      min-height: 90vh;
    }

    .hero-content {
      flex: 1;
      max-width: 600px;
    }

    .badge {
      display: inline-block;
      background: rgba(59, 130, 246, 0.2);
      color: #60a5fa;
      padding: 0.5rem 1rem;
      border-radius: 50px;
      font-size: 14px;
      font-weight: 500;
      margin-bottom: 1.5rem;
    }

    .hero h1 {
      font-size: 56px;
      font-weight: 800;
      line-height: 1.1;
      margin-bottom: 1.5rem;
    }

    .gradient-text {
      background: linear-gradient(135deg, #60a5fa, #a78bfa, #34d399);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .hero p {
      font-size: 18px;
      color: rgba(255, 255, 255, 0.7);
      line-height: 1.7;
      margin-bottom: 2rem;
    }

    .hero-buttons {
      display: flex;
      gap: 1rem;
    }

    .btn-primary {
      background: linear-gradient(135deg, #3b82f6, #8b5cf6);
      color: white;
      text-decoration: none;
      padding: 1rem 2rem;
      border-radius: 12px;
      font-weight: 600;
      font-size: 16px;
      transition: all 0.3s;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(59, 130, 246, 0.5);
    }

    .btn-secondary {
      background: rgba(255, 255, 255, 0.1);
      color: white;
      text-decoration: none;
      padding: 1rem 2rem;
      border-radius: 12px;
      font-weight: 600;
      font-size: 16px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      transition: all 0.3s;
    }

    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.2);
    }

    .hero-graphic {
      flex: 1;
      position: relative;
      height: 400px;
    }

    .card-float {
      position: absolute;
      background: rgba(30, 41, 59, 0.9);
      backdrop-filter: blur(20px);
      border-radius: 20px;
      padding: 1.5rem;
      border: 1px solid rgba(255, 255, 255, 0.1);
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
    }

    .card-float.balance {
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      min-width: 250px;
      text-align: center;
    }

    .card-float.income {
      bottom: 60px;
      left: 0;
    }

    .card-float.expense {
      bottom: 60px;
      right: 0;
    }

    .card-float .label {
      display: block;
      color: rgba(255, 255, 255, 0.6);
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 0.5rem;
    }

    .card-float .value {
      display: block;
      font-size: 28px;
      font-weight: 700;
    }

    .balance .value {
      color: #34d399;
    }

    .income .value {
      color: #4ade80;
    }

    .expense .value {
      color: #f87171;
    }

    .card-float .trend {
      display: block;
      font-size: 12px;
      margin-top: 0.5rem;
    }

    .trend.up {
      color: #34d399;
    }

    .features {
      padding: 5rem 5%;
      background: rgba(15, 12, 41, 0.5);
    }

    .features h2 {
      text-align: center;
      font-size: 36px;
      margin-bottom: 3rem;
    }

    .feature-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .feature-card {
      background: rgba(30, 41, 59, 0.5);
      border-radius: 20px;
      padding: 2rem;
      border: 1px solid rgba(255, 255, 255, 0.1);
      transition: all 0.3s;
    }

    .feature-card:hover {
      transform: translateY(-5px);
      border-color: rgba(59, 130, 246, 0.5);
    }

    .feature-card .icon {
      font-size: 48px;
      margin-bottom: 1rem;
    }

    .feature-card h3 {
      font-size: 20px;
      margin-bottom: 0.75rem;
    }

    .feature-card p {
      color: rgba(255, 255, 255, 0.6);
      line-height: 1.6;
    }

    .cta-section {
      padding: 5rem 5%;
      text-align: center;
      background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(139, 92, 246, 0.2));
    }

    .cta-section h2 {
      font-size: 36px;
      margin-bottom: 1rem;
    }

    .cta-section p {
      color: rgba(255, 255, 255, 0.7);
      font-size: 18px;
      margin-bottom: 2rem;
    }

    .btn-cta {
      display: inline-block;
      background: linear-gradient(135deg, #3b82f6, #8b5cf6);
      color: white;
      text-decoration: none;
      padding: 1rem 3rem;
      border-radius: 12px;
      font-weight: 600;
      font-size: 18px;
      transition: all 0.3s;
    }

    .btn-cta:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 30px rgba(59, 130, 246, 0.5);
    }

    .footer {
      padding: 3rem 5%;
      background: rgba(15, 12, 41, 0.9);
    }

    .footer-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: 1200px;
      margin: 0 auto;
    }

    .footer-brand .logo {
      font-size: 20px;
    }

    .footer-brand p {
      color: rgba(255, 255, 255, 0.5);
      font-size: 14px;
      margin-top: 0.5rem;
    }

    .footer-links {
      display: flex;
      gap: 2rem;
    }

    .footer-links a {
      color: rgba(255, 255, 255, 0.6);
      text-decoration: none;
      transition: color 0.3s;
    }

    .footer-links a:hover {
      color: white;
    }

    .footer-bottom {
      text-align: center;
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
    }

    .footer-bottom p {
      color: rgba(255, 255, 255, 0.4);
      font-size: 14px;
    }

    @media (max-width: 768px) {
      .hero {
        flex-direction: column;
        padding-top: 6rem;
        text-align: center;
      }

      .hero h1 {
        font-size: 36px;
      }

      .hero-buttons {
        justify-content: center;
        flex-wrap: wrap;
      }

      .hero-graphic {
        width: 100%;
        height: 300px;
      }

      .footer-content {
        flex-direction: column;
        gap: 1.5rem;
        text-align: center;
      }
    }
  `]
})
export class LandingComponent {}
import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot } from '@angular/router';
import { TransactionService } from './transaction.service';

export const authGuard: CanActivateFn = (route, state) => {
  const transactionService = inject(TransactionService);
  const router = inject(Router);

  console.log('[AuthGuard] Checking authentication, isAuth:', transactionService.isAuthenticated());

  if (transactionService.isAuthenticated()) {
    return true;
  }

  console.log('[AuthGuard] Not authenticated, redirecting to login');
  router.navigate(['/login']);
  return false;
};

export const guestGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state) => {
  const transactionService = inject(TransactionService);
  const router = inject(Router);

  // Allow access to login page if user wants to switch accounts
  // Check if there's a query param to force login page
  const forceLogin = route.queryParamMap.get('force') === 'true';

  if (!transactionService.isAuthenticated() || forceLogin) {
    // If authenticated and forcing login, log them out first
    if (transactionService.isAuthenticated() && forceLogin) {
      transactionService.logout();
    }
    return true;
  }

  router.navigate(['/dashboard']);
  return false;
};
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { TransactionService } from './transaction.service';

export const authGuard: CanActivateFn = (route, state) => {
  const transactionService = inject(TransactionService);
  const router = inject(Router);

  if (transactionService.isAuthenticated()) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};

export const guestGuard: CanActivateFn = (route, state) => {
  const transactionService = inject(TransactionService);
  const router = inject(Router);

  if (!transactionService.isAuthenticated()) {
    return true;
  }

  router.navigate(['/dashboard']);
  return false;
};
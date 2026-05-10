import { TestBed } from '@angular/core/testing';
import { TransactionService } from './transaction.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';

describe('TransactionService', () => {
  let service: TransactionService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TransactionService]
    });
    service = TestBed.inject(TransactionService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Authentication', () => {
    it('should return false when not authenticated', () => {
      expect(service.isAuthenticated()).toBe(false);
    });

    it('should store auth data correctly', () => {
      const mockData = {
        token: 'test-token-123',
        email: 'test@example.com',
        name: 'Test User',
        authProvider: 'EMAIL',
        userId: 1,
        profileImageUrl: 'https://example.com/photo.jpg'
      };

      service.storeAuthData(mockData);

      expect(service.isAuthenticated()).toBe(true);
      const user = service.getCurrentUser();
      expect(user).toBeTruthy();
      expect(user?.email).toBe('test@example.com');
      expect(user?.name).toBe('Test User');
      expect(user?.profileImageUrl).toBe('https://example.com/photo.jpg');
    });

    it('should clear data on logout', () => {
      service.storeAuthData({
        token: 'test-token',
        email: 'test@example.com',
        name: 'Test User',
        authProvider: 'EMAIL',
        userId: 1
      });

      service.logout();

      expect(service.isAuthenticated()).toBe(false);
      expect(service.getCurrentUser()).toBe(null);
    });

    it('should check authentication after storing token', () => {
      expect(service.isAuthenticated()).toBe(false);

      service.storeAuthData({
        token: 'valid-token',
        email: 'user@test.com',
        name: 'User',
        authProvider: 'EMAIL',
        userId: 2
      });

      expect(service.isAuthenticated()).toBe(true);
    });
  });
});

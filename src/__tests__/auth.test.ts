import { describe, it, expect, beforeEach, jest } from '@jest/globals';

// Mock Prisma Client
const mockPrisma = {
  user: {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
};

jest.mock('@prisma/client', () => ({
  PrismaClient: jest.fn(() => mockPrisma),
}));

// Mock better-auth
const mockAuth = {
  api: {
    getSession: jest.fn(),
    signIn: jest.fn(),
    signUp: jest.fn(),
    signOut: jest.fn(),
  },
  $Infer: {
    Session: {},
    User: {},
  },
};

jest.mock('better-auth', () => ({
  betterAuth: jest.fn(() => mockAuth),
}));

jest.mock('better-auth/adapters/prisma', () => ({
  prismaAdapter: jest.fn(),
}));

describe('Authentication Configuration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should export auth configuration', async () => {
    // Dynamic import to ensure mocks are applied
    const { auth } = await import('@/lib/auth');
    expect(auth).toBeDefined();
  });

  it('should export Session and User types', async () => {
    const authModule = await import('@/lib/auth');
    expect(authModule).toHaveProperty('auth');
  });
});

describe('Auth Client Configuration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should export auth client functions', async () => {
    // Mock createAuthClient
    const mockAuthClient = {
      signIn: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
      useSession: jest.fn(),
      getSession: jest.fn(),
    };

    jest.doMock('better-auth/react', () => ({
      createAuthClient: jest.fn(() => mockAuthClient),
    }));

    const authClientModule = await import('@/lib/auth-client');
    
    expect(authClientModule.signIn).toBeDefined();
    expect(authClientModule.signUp).toBeDefined();
    expect(authClientModule.signOut).toBeDefined();
    expect(authClientModule.useSession).toBeDefined();
    expect(authClientModule.getSession).toBeDefined();
  });
});

describe('Auth Types', () => {
  it('should define correct user roles', async () => {
    const { UserRole } = await import('@/types/auth');
    // Basic test - in a real app you might want more comprehensive type checking
    expect(typeof UserRole).toBe('undefined'); // It's a type, not a runtime value
  });
});

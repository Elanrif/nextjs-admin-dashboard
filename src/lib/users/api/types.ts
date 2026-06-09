/**
 * User types — API response models (no validation)
 * See: src/lib/users/schemas/user.schema.ts for form validation
 */

// ============================================================================
// ENUMS
// ============================================================================

export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
}

// ============================================================================
// CORE ENTITIES
// ============================================================================

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  avatarUrl?: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserSummary {
  id: number;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  email: string;
  role?: UserRole;
}

// ============================================================================
// REQUEST & RESPONSE TYPES
// ============================================================================

export type UserFilters = {
  page?: number;
  limit?: number;
  roles?: string;
  search?: string;
  sort?: string;
};

export type UsersResult = {
  data: User[];
  meta: {
    total: number;
    page: number;
    limit: number;
  };
};

export interface UserLogin {
  token: string;
  refreshToken: string;
  user: User;
}

// ============================================================================
// MUTATION PAYLOADS
// ============================================================================

export interface UserCreate {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: UserRole;
  password: string;
  confirmPassword: string;
  avatarUrl?: string;
}

export interface UserUpdate {
  email?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  role?: UserRole;
  password?: string;
  confirmPassword?: string;
  avatarUrl?: string;
}

export type UserMutationPayload = UserCreate;

// ============================================================================
// PASSWORD RESET
// ============================================================================

export interface ResetPassword {
  code: string;
  resetToken: string;
  email: string;
  newPassword: string;
}

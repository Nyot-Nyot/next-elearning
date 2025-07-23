import { UserRole } from "@/types/auth";

export const USER_ROLES = {
  STUDENT: "STUDENT",
  LECTURER: "LECTURER", 
  ADMIN: "ADMIN",
} as const;

// Role hierarchy for permission checking
export const ROLE_HIERARCHY = {
  [USER_ROLES.ADMIN]: 3,
  [USER_ROLES.LECTURER]: 2,
  [USER_ROLES.STUDENT]: 1,
} as const;

// Dashboard path mapping based on user role
export function getDashboardPath(role: UserRole): string {
  switch (role) {
    case USER_ROLES.ADMIN:
      return "/dashboard/admin";
    case USER_ROLES.LECTURER:
      return "/dashboard/lecturer";
    case USER_ROLES.STUDENT:
      return "/dashboard/student";
    default:
      return "/dashboard/student"; // Default fallback
  }
}

// Check if user has required role or higher
export function hasRequiredRole(userRole: UserRole, requiredRole: UserRole): boolean {
  // Handle invalid roles
  if (!userRole || !requiredRole || !ROLE_HIERARCHY[userRole] || !ROLE_HIERARCHY[requiredRole]) {
    return false;
  }
  
  const userLevel = ROLE_HIERARCHY[userRole];
  const requiredLevel = ROLE_HIERARCHY[requiredRole];
  return userLevel >= requiredLevel;
}

// Get allowed routes for a specific role
export function getAllowedRoutes(role: UserRole): string[] {
  switch (role) {
    case USER_ROLES.ADMIN:
      return ["/dashboard/admin", "/dashboard/lecturer", "/dashboard/student"];
    case USER_ROLES.LECTURER:
      return ["/dashboard/lecturer", "/dashboard/student"];
    case USER_ROLES.STUDENT:
      return ["/dashboard/student"];
    default:
      return ["/dashboard/student"];
  }
}

// Check if a route is allowed for a user role
export function isRouteAllowed(route: string, userRole: UserRole): boolean {
  const allowedRoutes = getAllowedRoutes(userRole);
  return allowedRoutes.some(allowedRoute => route.startsWith(allowedRoute));
}

// Validate user role
export function isValidRole(role: string): role is UserRole {
  return Object.values(USER_ROLES).includes(role as UserRole);
}

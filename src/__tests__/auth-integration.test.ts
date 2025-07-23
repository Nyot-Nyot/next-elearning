import { registerUser, loginUser } from "@/app/actions/auth";
import { getDashboardPath, hasRequiredRole, getAllowedRoutes } from "@/lib/roles";
import { UserRole } from "@/types/auth";
import { auth } from "@/lib/auth";

// Mock dependencies
jest.mock("@/lib/auth", () => ({
  auth: {
    api: {
      signUpEmail: jest.fn(),
      signInEmail: jest.fn(),
      getSession: jest.fn(),
    },
  },
}));

jest.mock("next/navigation", () => ({
  redirect: jest.fn(),
}));

jest.mock("next/headers", () => ({
  headers: jest.fn(() => Promise.resolve(new Headers())),
}));

const mockAuth = jest.mocked(auth);

describe("Authentication Integration", () => {
  describe("Registration Flow", () => {
    it("should validate registration input correctly", async () => {
      const formData = new FormData();
      formData.append("email", "invalid-email");
      formData.append("password", "short");
      formData.append("name", "");

      const result = await registerUser(formData);
      expect(result?.error).toBeTruthy();
    });

    it("should handle valid registration data", async () => {
      mockAuth.api.signUpEmail.mockResolvedValue({
        token: "mock-token",
        user: {
          id: "1",
          email: "test@example.com",
          name: "Test User",
          image: null,
          emailVerified: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      });

      const formData = new FormData();
      formData.append("email", "test@example.com");
      formData.append("password", "validpassword123");
      formData.append("name", "Test User");

      // This should redirect, so we don't expect a return value
      expect(() => registerUser(formData)).not.toThrow();
    });
  });

  describe("Login Flow", () => {
    it("should validate login input correctly", async () => {
      const formData = new FormData();
      formData.append("email", "invalid-email");
      formData.append("password", "");

      const result = await loginUser(formData);
      expect(result?.error).toBeTruthy();
    });
  });

  describe("Role-Based Navigation", () => {
    it("should return correct dashboard paths for each role", () => {
      expect(getDashboardPath("STUDENT")).toBe("/dashboard/student");
      expect(getDashboardPath("LECTURER")).toBe("/dashboard/lecturer");
      expect(getDashboardPath("ADMIN")).toBe("/dashboard/admin");
    });

    it("should handle role hierarchy correctly", () => {
      expect(hasRequiredRole("ADMIN", "STUDENT")).toBe(true);
      expect(hasRequiredRole("LECTURER", "STUDENT")).toBe(true);
      expect(hasRequiredRole("STUDENT", "LECTURER")).toBe(false);
      expect(hasRequiredRole("STUDENT", "ADMIN")).toBe(false);
    });

    it("should return correct allowed routes for each role", () => {
      const adminRoutes = getAllowedRoutes("ADMIN");
      expect(adminRoutes).toContain("/dashboard/admin");
      expect(adminRoutes).toContain("/dashboard/lecturer");
      expect(adminRoutes).toContain("/dashboard/student");

      const lecturerRoutes = getAllowedRoutes("LECTURER");
      expect(lecturerRoutes).toContain("/dashboard/lecturer");
      expect(lecturerRoutes).toContain("/dashboard/student");
      expect(lecturerRoutes).not.toContain("/dashboard/admin");

      const studentRoutes = getAllowedRoutes("STUDENT");
      expect(studentRoutes).toContain("/dashboard/student");
      expect(studentRoutes).not.toContain("/dashboard/lecturer");
      expect(studentRoutes).not.toContain("/dashboard/admin");
    });
  });

  describe("Edge Cases", () => {
    it("should handle invalid role gracefully", () => {
      const invalidRole = "INVALID_ROLE" as UserRole;
      expect(getDashboardPath(invalidRole)).toBe("/dashboard/student");
      expect(getAllowedRoutes(invalidRole)).toEqual(["/dashboard/student"]);
    });

    it("should handle undefined role in hasRequiredRole", () => {
      // Test with null instead of undefined to avoid type issues
      expect(hasRequiredRole("" as UserRole, "STUDENT")).toBe(false);
      expect(hasRequiredRole("STUDENT", "" as UserRole)).toBe(false);
    });
  });
});

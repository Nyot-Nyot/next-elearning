"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { getDashboardPath } from "@/lib/roles";
import { headers } from "next/headers";
import { UserRole } from "@/types/auth";

const registerSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
});

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

export async function registerUser(formData: FormData) {
  try {
    // Validate form data
    const data = registerSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
      name: formData.get("name"),
    });

    // Use BetterAuth to handle registration
    const result = await auth.api.signUpEmail({
      body: {
        email: data.email,
        password: data.password,
        name: data.name || "",
        role: "STUDENT", // Default role
      },
    });

    if (!result) {
      return {
        error: "Registration failed. Please try again.",
      };
    }

    // Redirect to login page
    redirect("/auth/login?message=Registration successful. Please log in.");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        error: error.issues[0].message,
      };
    }
    
    console.error("Registration error:", error);
    return {
      error: "Registration failed. Please try again.",
    };
  }
}

export async function loginUser(formData: FormData) {
  try {
    // Validate form data
    const data = loginSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    // Use BetterAuth to handle login
    const result = await auth.api.signInEmail({
      body: {
        email: data.email,
        password: data.password,
      },
      headers: await headers(),
    });

    if (!result) {
      return {
        error: "Invalid email or password",
      };
    }

    // Get user role for proper redirect
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (session?.user?.role) {
      const dashboardPath = getDashboardPath(session.user.role as UserRole);
      redirect(dashboardPath);
    } else {
      redirect("/dashboard/student"); // Fallback
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        error: error.issues[0].message,
      };
    }
    
    console.error("Login error:", error);
    return {
      error: "Login failed. Please try again.",
    };
  }
}

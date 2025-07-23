import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            E-Learning Platform
          </h1>
          <p className="text-lg text-gray-600">
            Welcome to your personalized learning experience
          </p>
        </div>

        <Card className="bg-white shadow-xl">
          <CardHeader>
            <CardTitle className="text-center">Get Started</CardTitle>
            <CardDescription className="text-center">
              Access your courses and assignments
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/auth/login" className="block">
              <Button className="w-full" size="lg">
                Sign In
              </Button>
            </Link>
            
            <Link href="/auth/register" className="block">
              <Button variant="outline" className="w-full" size="lg">
                Create Account
              </Button>
            </Link>

            <div className="text-center text-sm text-gray-500 mt-6">
              <p>For students, lecturers, and administrators</p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-xs text-gray-400">
          <p>Demo Environment - Testing Phase</p>
        </div>
      </div>
    </div>
  );
}

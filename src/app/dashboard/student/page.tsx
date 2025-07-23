import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function StudentDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
        <div className="text-sm text-gray-500">
          Welcome to your learning portal
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>My Courses</CardTitle>
            <CardDescription>View your enrolled courses</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Access your semester courses and learning materials.
            </p>
            <div className="mt-4 text-2xl font-bold text-blue-600">
              0 Courses
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Assignments</CardTitle>
            <CardDescription>Upcoming assignments and deadlines</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Keep track of your assignment deadlines.
            </p>
            <div className="mt-4 text-2xl font-bold text-orange-600">
              0 Pending
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Progress</CardTitle>
            <CardDescription>Your learning progress and XP</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Track your academic achievements and experience points.
            </p>
            <div className="mt-4 text-2xl font-bold text-green-600">
              0 XP
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="font-medium">View Courses</div>
              <div className="text-sm text-gray-500">Browse available courses</div>
            </button>
            <button className="p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="font-medium">Submit Assignment</div>
              <div className="text-sm text-gray-500">Upload your work</div>
            </button>
            <button className="p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="font-medium">Calendar</div>
              <div className="text-sm text-gray-500">View important dates</div>
            </button>
            <button className="p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="font-medium">Resources</div>
              <div className="text-sm text-gray-500">Access learning materials</div>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

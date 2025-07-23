import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="text-sm text-gray-500">
          System administration and management
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total Users</CardTitle>
            <CardDescription>All platform users</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Students, lecturers, and administrators.
            </p>
            <div className="mt-4 text-2xl font-bold text-blue-600">
              0 Users
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Courses</CardTitle>
            <CardDescription>Total courses in system</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              All courses across all semesters.
            </p>
            <div className="mt-4 text-2xl font-bold text-green-600">
              0 Courses
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Enrollments</CardTitle>
            <CardDescription>Active student enrollments</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Current semester enrollments.
            </p>
            <div className="mt-4 text-2xl font-bold text-purple-600">
              0 Active
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
            <CardDescription>Platform status overview</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Overall system performance.
            </p>
            <div className="mt-4 text-2xl font-bold text-green-600">
              Healthy
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Administrative Tools</CardTitle>
          <CardDescription>System management and configuration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="font-medium">User Management</div>
              <div className="text-sm text-gray-500">Manage user roles and access</div>
            </button>
            <button className="p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="font-medium">Course Provisioning</div>
              <div className="text-sm text-gray-500">Create semesters and courses</div>
            </button>
            <button className="p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="font-medium">Enrollment Management</div>
              <div className="text-sm text-gray-500">Handle student registrations</div>
            </button>
            <button className="p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="font-medium">System Settings</div>
              <div className="text-sm text-gray-500">Configure platform settings</div>
            </button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest system events and user actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-gray-500 text-center py-8">
              No recent activity to display
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

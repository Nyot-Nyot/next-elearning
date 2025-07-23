import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function LecturerDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Lecturer Dashboard</h1>
        <div className="text-sm text-gray-500">
          Manage your courses and students
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>My Courses</CardTitle>
            <CardDescription>Courses you are teaching</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Manage your course content and student progress.
            </p>
            <div className="mt-4 text-2xl font-bold text-blue-600">
              0 Courses
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Students</CardTitle>
            <CardDescription>Total enrolled students</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              View and manage your student enrollments.
            </p>
            <div className="mt-4 text-2xl font-bold text-purple-600">
              0 Students
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Assignments</CardTitle>
            <CardDescription>Assignments requiring review</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Review and grade student submissions.
            </p>
            <div className="mt-4 text-2xl font-bold text-orange-600">
              0 Pending
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Course Management</CardTitle>
          <CardDescription>Tools for managing your courses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button className="p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="font-medium">Create Course</div>
              <div className="text-sm text-gray-500">Add new course content</div>
            </button>
            <button className="p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="font-medium">Manage Materials</div>
              <div className="text-sm text-gray-500">Upload course resources</div>
            </button>
            <button className="p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="font-medium">Grade Assignments</div>
              <div className="text-sm text-gray-500">Review student work</div>
            </button>
            <button className="p-4 text-left border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="font-medium">Analytics</div>
              <div className="text-sm text-gray-500">Track student progress</div>
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

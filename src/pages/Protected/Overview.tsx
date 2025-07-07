import { Button } from "@/components/ui/button";

export default function Overview() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600">
          Welcome back to Ivy Grove Magdalene School
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Students</h3>
          <p className="text-3xl font-bold text-blue-600">245</p>
          <p className="text-sm text-gray-500 mt-1">Total enrolled students</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Teachers</h3>
          <p className="text-3xl font-bold text-green-600">18</p>
          <p className="text-sm text-gray-500 mt-1">Active teaching staff</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Classes</h3>
          <p className="text-3xl font-bold text-purple-600">12</p>
          <p className="text-sm text-gray-500 mt-1">Active classes</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-lg font-medium text-gray-900">Quick Actions</h2>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Button className="w-full">Add Student</Button>
          <Button className="w-full" variant="outline">
            View Reports
          </Button>
          <Button className="w-full" variant="outline">
            Manage Classes
          </Button>
          <Button className="w-full" variant="outline">
            School Calendar
          </Button>
        </div>
      </div>
    </div>
  );
}

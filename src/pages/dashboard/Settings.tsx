import { Button } from "@/components/ui/button";

export default function Settings() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Manage school settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">School Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                School Name
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                defaultValue="Ivy Grove Magdalene School"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded-md"
                defaultValue="123 Education Street"
              />
            </div>
            <Button>Update Information</Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Account Settings</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Admin Email
              </label>
              <input
                type="email"
                className="w-full p-2 border rounded-md"
                defaultValue="admin@ivygrove.edu"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                className="w-full p-2 border rounded-md"
                defaultValue="+1 (555) 123-4567"
              />
            </div>
            <Button>Update Settings</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
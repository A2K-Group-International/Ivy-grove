import { CreateTeacher } from "@/components/features/teachers/CreateTeacher";
import { Button } from "@/components/ui/button";

export default function Teachers() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Teachers</h1>
          <p className="text-gray-600">
            Manage teaching staff and their information
          </p>
        </div>
        <CreateTeacher />
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Teaching Staff
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">Ms. Sarah Wilson</h3>
                <p className="text-sm text-gray-600">
                  Mathematics • 5 years experience
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Edit
                </Button>
                <Button variant="outline" size="sm">
                  View
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">Mr. David Brown</h3>
                <p className="text-sm text-gray-600">
                  Science • 8 years experience
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Edit
                </Button>
                <Button variant="outline" size="sm">
                  View
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h3 className="font-medium">Mrs. Emily Davis</h3>
                <p className="text-sm text-gray-600">
                  English • 12 years experience
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Edit
                </Button>
                <Button variant="outline" size="sm">
                  View
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

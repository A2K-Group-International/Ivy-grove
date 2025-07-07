import { Button } from "@/components/ui/button";

export default function Schedule() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Schedule</h1>
          <p className="text-gray-600">View and manage class schedules</p>
        </div>
        <Button>Add Schedule</Button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Weekly Schedule</h2>
          <div className="grid grid-cols-6 gap-4">
            <div className="font-medium text-center">Time</div>
            <div className="font-medium text-center">Monday</div>
            <div className="font-medium text-center">Tuesday</div>
            <div className="font-medium text-center">Wednesday</div>
            <div className="font-medium text-center">Thursday</div>
            <div className="font-medium text-center">Friday</div>
            
            <div className="text-center py-2">8:00 AM</div>
            <div className="border rounded p-2 text-center">Math 10A</div>
            <div className="border rounded p-2 text-center">Science 9B</div>
            <div className="border rounded p-2 text-center">English 11A</div>
            <div className="border rounded p-2 text-center">Math 10A</div>
            <div className="border rounded p-2 text-center">Science 9B</div>
            
            <div className="text-center py-2">9:00 AM</div>
            <div className="border rounded p-2 text-center">Science 9B</div>
            <div className="border rounded p-2 text-center">English 11A</div>
            <div className="border rounded p-2 text-center">Math 10A</div>
            <div className="border rounded p-2 text-center">Science 9B</div>
            <div className="border rounded p-2 text-center">English 11A</div>
            
            <div className="text-center py-2">10:00 AM</div>
            <div className="border rounded p-2 text-center">English 11A</div>
            <div className="border rounded p-2 text-center">Math 10A</div>
            <div className="border rounded p-2 text-center">Science 9B</div>
            <div className="border rounded p-2 text-center">English 11A</div>
            <div className="border rounded p-2 text-center">Math 10A</div>
          </div>
        </div>
      </div>
    </div>
  );
}
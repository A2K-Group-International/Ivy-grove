import { Search, LogIn, LogOut, Timer, QrCode } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { formatDate, formatTime, getInitial } from "@/lib/utils";
import AddStudentForm from "./AddStudentForm";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const filteredStudents = [
  {
    id: "stu-1",
    name: "Anna dela Cruz",
    email: "anna@example.com",
    avatar: "",
    checkInTime: "2025-07-10T08:15:00",
    checkOutTime: "2025-07-10T10:45:00",
  },
  {
    id: "stu-2",
    name: "Bryan Reyes",
    email: "bryan@example.com",
    avatar: "",
    checkInTime: "2025-07-10T08:00:00",
    checkOutTime: null,
  },
  {
    id: "stu-3",
    name: "Catherine Lopez",
    email: "catherine@example.com",
    avatar: "",
    checkInTime: null,
    checkOutTime: null,
  },
  {
    id: "stu-4",
    name: "David Tan",
    email: "david@example.com",
    avatar: "",
    checkInTime: "2025-07-10T07:50:00",
    checkOutTime: "2025-07-10T09:30:00",
  },
  {
    id: "stu-5",
    name: "Erika Santos",
    email: "erika@example.com",
    avatar: "",
    checkInTime: null,
    checkOutTime: null,
  },
  {
    id: "stu-6",
    name: "Francis Mendoza",
    email: "francis@example.com",
    avatar: "",
    checkInTime: "2025-07-10T08:10:00",
    checkOutTime: null,
  },
];

const AttendanceDetails = () => {
  return (
    <div className="flex-1 ">
      <div>
        <div className="mb-6">
          <div className="flex justify-between">
            <div className="flex gap-2">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {formatDate(new Date().toLocaleDateString())}
              </h2>
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select a class" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Classes</SelectLabel>
                    <SelectItem value="math">Math</SelectItem>
                    <SelectItem value="science">Science</SelectItem>
                    <SelectItem value="english">English</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-center gap-2">
              <AddStudentForm />
              <Button>
                <QrCode />
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-around mb-2">
            <div className="text-sm">
              <span className="font-medium text-blue-600">2 Present</span>
            </div>
            <div className="text-sm">
              <span className="font-medium text-red-600">4 Absent</span>
            </div>
            <div className="text-sm">
              <span className="font-medium text-gray-900">5 Total</span>
            </div>
          </div>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search students by name, ID, or email..."
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          {filteredStudents?.map((student) => (
            <div key={student.id}>
              <div className="flex items-center justify-between p-4 rounded-lg border bg-white hover:shadow-sm transition-all duration-200">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={student.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="text-sm font-medium">
                      {getInitial(student.name)}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <div className="font-medium text-gray-900">
                      {student.name}
                    </div>

                    <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                      {student.checkInTime && (
                        <div className="flex items-center gap-1">
                          <LogIn className="h-3 w-3" />
                          <span>In: {formatTime(student.checkInTime)}</span>
                        </div>
                      )}
                      {student.checkOutTime && (
                        <div className="flex items-center gap-1">
                          <LogOut className="h-3 w-3" />
                          <span>Out: {formatTime(student.checkOutTime)}</span>
                        </div>
                      )}
                      {student.checkInTime && student.checkOutTime && (
                        <div className="flex items-center gap-1">
                          <Timer className="h-3 w-3" />
                          {/* <span>
                            Duration:{" "}
                            {calculateDuration(
                              student.checkInTime,
                              student.checkOutTime
                            )}
                          </span> */}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {student.checkInTime && !student.checkOutTime && (
                    <Badge className="bg-blue-500">Checked in</Badge>
                  )}
                  {student.checkInTime && student.checkOutTime && (
                    <Badge className="bg-blue-500">Checked out</Badge>
                  )}

                  <div className="flex gap-2">
                    {!student.checkInTime && (
                      <Button size="sm" className="flex items-center gap-1">
                        <LogIn className="h-4 w-4" />
                        Check In
                      </Button>
                    )}

                    {student.checkInTime && !student.checkOutTime && (
                      <Button size="sm" className="flex items-center gap-1">
                        <LogOut className="h-4 w-4" />
                        Check Out
                      </Button>
                    )}

                    {/* {student.status !== "not-arrived" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex items-center gap-1"
                      >
                        <UserX className="h-4 w-4" />
                        Reset
                      </Button>
                    )} */}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* {filteredStudents?.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No students found matching your search.</p>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default AttendanceDetails;

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader, User, Users } from "lucide-react";
import { useStudentsByParentId } from "@/hooks/useParents";
import { useAuth } from "@/context/AuthContext";
import { calculateAge } from "@/utils/date";

export default function Children() {
  const { userProfile } = useAuth();
  const { data: students, isLoading: studentsLoading } = useStudentsByParentId(
    userProfile?.id || ""
  );

  if (studentsLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader className="animate-spin w-8 h-8 text-school-600" />
          <p className="text-gray-600">Loading your children...</p>
        </div>
      </div>
    );
  }

  if (!userProfile || userProfile.role !== "parent") {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-center">
          <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Access Restricted
          </h2>
          <p className="text-gray-600">
            This page is only available for parent accounts.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Users className="w-8 h-8 text-school-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Children</h1>
          <p className="text-gray-600">
            View information about your children enrolled in the school
          </p>
        </div>
      </div>

      {!students || students.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">
              No Children Found
            </h2>
            <p className="text-gray-600">
              You don't have any children linked to your account yet. Please
              contact the school administration to link your children.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {students.map((student) => (
            <Card
              key={student.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader className="pb-4">
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback className="bg-school-100 text-school-600 text-lg">
                      {student.first_name[0]}
                      {student.last_name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">
                      {student.first_name} {student.last_name}
                    </CardTitle>
                    <p className="text-sm text-gray-600">
                      {student.date_of_birth
                        ? "Age " + calculateAge(student.date_of_birth)
                        : "Date of birth not set"}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      Address
                    </p>
                    <p className="text-sm text-gray-600">{student.address}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {students && students.length > 0 && (
        <div className="text-center text-sm text-gray-500 mt-8">
          Showing {students.length} student{students.length !== 1 ? "s" : ""}
        </div>
      )}
    </div>
  );
}

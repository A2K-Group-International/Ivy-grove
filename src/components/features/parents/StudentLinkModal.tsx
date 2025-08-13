import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Loader, UserPlus, X } from "lucide-react";
import {
  useUnlinkedStudents,
  useLinkStudentToParent,
  useUnlinkStudentFromParent,
} from "@/hooks/useParents";
import type { StudentWithParent } from "@/services/user.service";
import { calculateAge } from "@/utils/date";

interface StudentLinkModalProps {
  parentId: string;
  parentName: string;
  linkedStudents: StudentWithParent[];
  isOpen: boolean;
  onClose: () => void;
}

export function StudentLinkModal({
  parentId,
  parentName,
  linkedStudents,
  isOpen,
  onClose,
}: StudentLinkModalProps) {
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [unlinkingStudents, setUnlinkingStudents] = useState<Set<string>>(
    new Set()
  );

  const { data: unlinkedStudents, isLoading } = useUnlinkedStudents();
  const { mutate: linkStudent, isPending: isLinking } =
    useLinkStudentToParent();
  const { mutate: unlinkStudent } = useUnlinkStudentFromParent();

  const handleLinkStudents = () => {
    selectedStudents.forEach((studentId) => {
      linkStudent(
        { studentId, parentId },
        {
          onSuccess: () => {
            setSelectedStudents([]);
          },
        }
      );
    });
  };

  const handleUnlinkStudent = (studentId: string) => {
    setUnlinkingStudents((prev) => new Set(prev).add(studentId));

    unlinkStudent(studentId, {
      onSuccess: () => {
        setUnlinkingStudents((prev) => {
          const newSet = new Set(prev);
          newSet.delete(studentId);
          return newSet;
        });
      },
      onError: () => {
        setUnlinkingStudents((prev) => {
          const newSet = new Set(prev);
          newSet.delete(studentId);
          return newSet;
        });
      },
    });
  };

  const toggleStudentSelection = (studentId: string) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Students for {parentName}</DialogTitle>
          <DialogDescription>
            Link or unlink students from this parent.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Currently Linked Students */}
          <div>
            <Label className="text-lg font-semibold text-school-700 mb-3 block">
              Currently Linked Students ({linkedStudents.length})
            </Label>
            {linkedStudents.length === 0 ? (
              <p className="text-gray-500 text-sm">
                No students linked to this parent yet.
              </p>
            ) : (
              <div className="space-y-2">
                {linkedStudents.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback className="bg-green-100 text-green-600 text-sm">
                          {student.first_name[0]}
                          {student.last_name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">
                          {student.first_name} {student.last_name}
                        </p>
                        {student.date_of_birth && (
                          <p className="text-xs text-gray-600">
                            Age {calculateAge(student.date_of_birth)}
                          </p>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleUnlinkStudent(student.id)}
                      disabled={unlinkingStudents.has(student.id)}
                      className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                    >
                      {unlinkingStudents.has(student.id) ? (
                        <>
                          <Loader className="animate-spin w-4 h-4" />
                          Unlinking...
                        </>
                      ) : (
                        <>
                          <X className="w-4 h-4" />
                          Unlink
                        </>
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Available Students to Link */}
          <div>
            <Label className="text-lg font-semibold text-school-700 mb-3 block">
              Available Students to Link
            </Label>
            {isLoading ? (
              <div className="flex justify-center py-4">
                <Loader className="animate-spin" />
              </div>
            ) : !unlinkedStudents || unlinkedStudents.length === 0 ? (
              <p className="text-gray-500 text-sm">
                No unlinked students available. All students are already
                assigned to parents.
              </p>
            ) : (
              <div className="space-y-2">
                {unlinkedStudents.map((student) => (
                  <div
                    key={student.id}
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedStudents.includes(student.id)
                        ? "bg-blue-50 border-blue-200"
                        : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                    }`}
                    onClick={() => toggleStudentSelection(student.id)}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src="/placeholder.svg" />
                        <AvatarFallback className="bg-blue-100 text-blue-600 text-sm">
                          {student.first_name[0]}
                          {student.last_name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">
                          {student.first_name} {student.last_name}
                        </p>
                        {student.date_of_birth && (
                          <p className="text-xs text-gray-600">
                            Age {calculateAge(student.date_of_birth)}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={selectedStudents.includes(student.id)}
                        onChange={(e) => {
                          e.stopPropagation();
                          toggleStudentSelection(student.id);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
            {selectedStudents.length > 0 && (
              <Button
                onClick={handleLinkStudents}
                disabled={isLinking}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isLinking ? (
                  <div className="flex items-center gap-2">
                    <Loader className="animate-spin w-4 h-4" />
                    Linking...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <UserPlus className="w-4 h-4" />
                    Link {selectedStudents.length} Student
                    {selectedStudents.length > 1 ? "s" : ""}
                  </div>
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

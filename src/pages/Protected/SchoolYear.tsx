import { CreateSchoolYear } from "@/components/features/schoolyear/CreateSchoolYear";
import { Label } from "@/components/ui/label";

export default function SchoolYear() {
  return (
    <div className="space-y-2">
      <div>
        <Label className="text-2xl">School Year Management</Label>
      </div>
      <CreateSchoolYear />
    </div>
  );
}

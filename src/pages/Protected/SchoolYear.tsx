import { CreateSchoolYear } from "@/components/features/schoolyear/CreateSchoolYear";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SchoolYear() {
  return (
    <div className="space-y-2">
      <div>
        <Label className="text-2xl">School Year Management</Label>
      </div>
      <div className="flex items-center gap-x-2">
        <div>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="School Year" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <CreateSchoolYear />
        </div>
      </div>
    </div>
  );
}

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { CreateTeacher } from "@/components/features/teachers/CreateTeacher";
import { TeacherList } from "@/components/features/teachers/TeacherList";
import { ParentList } from "@/components/features/parents/ParentList";
import { CreateParent } from "@/components/features/parents/CreateParent";

export default function Users() {
  const [tab, setTab] = useState<string>("teachers");

  return (
    <div className="no-scrollbar flex h-full flex-col gap-4 overflow-y-auto">
      <div>
        <Label className="text-2xl">Manage your school community.</Label>
      </div>
      {/* Tab list */}
      <div className="flex gap-2 flex-col sm:flex-row md:items-center">
        <Tabs onValueChange={(value) => setTab(value)} defaultValue={tab}>
          <TabsList className="w-full">
            <TabsTrigger value="teachers">Teachers</TabsTrigger>
            <TabsTrigger value="parents">Parents</TabsTrigger>
          </TabsList>
        </Tabs>
        {/* Buttons */}
        {tab !== "students" && (
          <div className="self-end md:self-center">
            {tab === "teachers" && <CreateTeacher />}
            {tab === "parents" && <CreateParent />}
          </div>
        )}
      </div>
      {/* Main content */}
      <TeacherList isActive={tab === "teachers"} />
      <ParentList isActive={tab === "parents"} />
    </div>
  );
}

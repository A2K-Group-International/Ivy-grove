import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { CreateTeacher } from "@/components/features/teachers/CreateTeacher";

export default function Users() {
  const [tab, setTab] = useState<string>("teachers");

  return (
    <div className="no-scrollbar flex h-full flex-col gap-7 overflow-y-auto">
      <div>
        <Label className="text-2xl">Manage your school community.</Label>
      </div>
      {/* Tab list */}
      <div className="flex gap-2 flex-col sm:flex-row md:items-center">
        <Tabs onValueChange={(value) => setTab(value)} defaultValue={tab}>
          <TabsList className="w-full">
            <TabsTrigger value="teachers">Teachers</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
            <TabsTrigger value="licenses">Licenses</TabsTrigger>
          </TabsList>
        </Tabs>
        {/* Buttons */}
        {tab === "teachers" && (
          <div className="self-end md:self-center">
            <Separator orientation="vertical" className="hidden sm:block" />
            <CreateTeacher />
          </div>
        )}
      </div>
      {/* Main content */}
      {tab === "teachers" && <div>test</div>}
    </div>
  );
}

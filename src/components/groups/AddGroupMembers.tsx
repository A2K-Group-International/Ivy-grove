import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useGroupMembers } from "@/hooks/groups/useGroupMembers";
import type { Group } from "@/pages/Protected/Groups";
import CustomReactSelect from "../CustomReactSelect";

const formSchema = z.object({
  userIds: z.array(z.string()).min(1, "Please select at least one member"),
});

interface AddGroupMembersProps {
  group: Group;
}

const AddGroupMembers = ({ group }: AddGroupMembersProps) => {
  const [open, setOpen] = useState(false);
  const {
    addMembers,
    isAdding,
    members,
    isLoading: membersLoading,
    availableUsers,
    isLoadingUsers,
  } = useGroupMembers(group.id);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userIds: [],
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    addMembers(values.userIds, {
      onSuccess: () => {
        form.reset();
        setOpen(false);
      },
    });
  };

  // Backend-filtered users (no need for frontend filtering)
  const userOptions =
    availableUsers?.map((user) => ({
      value: user.id,
      label: `${user.first_name} ${user.last_name}`,
    })) || [];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <UserPlus className="h-4 w-4" />
          Add Members
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Members to {group.name}</DialogTitle>
          <DialogDescription>
            Select users to add to this group.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="userIds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Select Members</FormLabel>
                  <FormControl>
                    <CustomReactSelect
                      isMulti
                      options={userOptions}
                      value={userOptions.filter((option) =>
                        field.value.includes(option.value)
                      )}
                      onChange={(selected) => {
                        const values = Array.isArray(selected)
                          ? selected.map((option) => option.value)
                          : [];
                        field.onChange(values);
                      }}
                      placeholder="Select members to add..."
                      isLoading={isLoadingUsers}
                      isDisabled={isLoadingUsers}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Current Members List */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium">
                Current Members ({members?.length || 0})
              </h4>
              <div className="max-h-40 overflow-y-auto space-y-2">
                {membersLoading ? (
                  <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-2 rounded-lg"
                      >
                        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                        <div className="h-4 bg-gray-200 rounded animate-pulse flex-1"></div>
                      </div>
                    ))}
                  </div>
                ) : members && members.length > 0 ? (
                  members.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-3 p-2 rounded-lg bg-gray-50"
                    >
                      <Avatar className="w-8 h-8">
                        <AvatarFallback>
                          {member.user?.first_name?.[0]}
                          {member.user?.last_name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {member.user?.first_name} {member.user?.last_name}
                        </p>
                        <p className="text-xs text-gray-500">
                          Added{" "}
                          {new Date(member.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No members in this group yet
                  </p>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isAdding}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isAdding || userOptions.length === 0}
              >
                {isAdding ? "Adding..." : "Add Members"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddGroupMembers;

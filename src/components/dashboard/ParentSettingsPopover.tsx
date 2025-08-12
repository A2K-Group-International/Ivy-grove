import { Popover, PopoverTrigger, PopoverContent } from "../ui/popover";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import ChangePasswordDialog from "./ChangePasswordDialog";

import { Settings } from "lucide-react";

function ParentSettingsPopover() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-start gap-2 hover:bg-school-50 hover:text-school-700 text-gray-600 rounded-lg py-2.5 transition-all duration-200"
        >
          <Settings className="h-4 w-4" />
          <span className="text-sm font-medium">Settings</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-4 space-y-3 ml-2">
        <h3 className="text-sm font-semibold">Account Settings</h3>
        <div className="text-sm text-muted-foreground">
          Manage your account preferences.
        </div>
        <Separator />
        <div>
          <ChangePasswordDialog />
        </div>
      </PopoverContent>
    </Popover>
  );
}

export default ParentSettingsPopover;

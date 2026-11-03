"use client";

import { ChevronDown, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/toast";

export function AccountDropdown() {
  const showComingSoon = (action: "Login" | "Sign up") => {
    toast.add({
      title: `${action} Is Coming Soon`,
      type: "info",
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="ghost" className="account-button" aria-label="Account options" />}
      >
        <UserCircle aria-hidden="true" />
        <ChevronDown aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="account-menu" align="end" sideOffset={8}>
        <DropdownMenuGroup>
          <DropdownMenuItem
            render={<Button type="button" variant="outline" className="account-menu-button" />}
            onClick={() => showComingSoon("Login")}
          >
            Login
          </DropdownMenuItem>
          <DropdownMenuItem
            render={<Button type="button" variant="outline" className="account-menu-button" />}
            onClick={() => showComingSoon("Sign up")}
          >
            Sign up
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

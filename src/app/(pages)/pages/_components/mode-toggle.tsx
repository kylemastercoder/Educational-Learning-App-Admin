"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  const handleToggle = (checked: boolean) => {
    setTheme(checked ? "light" : "dark");
  };

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id="dark-mode"
        checked={theme === "light"}
        onCheckedChange={handleToggle}
      />
      <Label htmlFor="dark-mode">
        {theme === "light" ? "Light" : "Dark"} Mode
      </Label>
    </div>
  );
}

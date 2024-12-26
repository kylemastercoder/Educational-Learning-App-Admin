"use client";

import React, { useEffect } from "react";
import Heading from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { createAccessSettings, updateAccessSettings } from "@/actions/settings";
import { collection, getDocs, query, doc } from "firebase/firestore";
import { db } from "../../../../lib/db";

const AccessSettings = () => {
  const [title, setTitle] = React.useState("");
  const [subTitle, setSubTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [settingsId, setSettingsId] = React.useState("");

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settingsQuery = query(collection(db, "Settings"));
        const settingsSnapshot = await getDocs(settingsQuery);

        if (!settingsSnapshot.empty) {
          const settingsDoc = settingsSnapshot.docs[0]; // Assuming only one settings document
          const settingsData = settingsDoc.data();

          setSettingsId(settingsDoc.id);
          setTitle(settingsData.title || "");
          setSubTitle(settingsData.subTitle || "");
          setContent(settingsData.content || "");
        }
      } catch (error) {
        console.error("Error fetching settings:", error);
      }
    };

    fetchSettings();
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (settingsId) {
        // Update existing settings
        const response = await updateAccessSettings(
          settingsId,
          title,
          subTitle,
          content
        );

        if (response.status === 200) {
          toast.success("Settings have been updated successfully");
        } else {
          toast.error(response.message || "Something went wrong");
        }
      } else {
        // Add new settings
        const response = await createAccessSettings(title, subTitle, content);

        if (response.status === 200) {
          toast.success("Settings have been added successfully");
        } else {
          toast.error(response.message || "Something went wrong");
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-10 px-20 gap-5">
      <Heading
        title="Access Settings"
        description="This page allows you to manage access settings. All changes will be reflected in your application."
      />
      <form onSubmit={onSubmit}>
        <div className="space-y-4 mt-10">
          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              disabled={loading}
              value={title}
              required
              onChange={(e) => setTitle(e.target.value)}
              className="dark:bg-themeBlack dark:border-themeGray dark:text-themeTextGray bg-white border-zinc-100 text-black"
              placeholder="e.g. Learn C Programming Language"
            />
          </div>
          <div className="space-y-2">
            <Label>Sub-Title</Label>
            <Input
              disabled={loading}
              value={subTitle}
              required
              onChange={(e) => setSubTitle(e.target.value)}
              className="dark:bg-themeBlack dark:border-themeGray dark:text-themeTextGray bg-white border-zinc-100 text-black"
              placeholder="e.g. Prepare by Topics"
            />
          </div>
          <div className="space-y-2">
            <Label>Content</Label>
            <Textarea
              disabled={loading}
              value={content}
              required
              onChange={(e) => setContent(e.target.value)}
              className="dark:bg-themeBlack dark:border-themeGray dark:text-themeTextGray bg-white border-zinc-100 text-black"
              placeholder="Enter the content here..."
            />
          </div>
        </div>
        <Button disabled={loading} className="mt-6" type="submit">
          {settingsId ? "Update Settings" : "Add Settings"}
        </Button>
      </form>
    </div>
  );
};

export default AccessSettings;

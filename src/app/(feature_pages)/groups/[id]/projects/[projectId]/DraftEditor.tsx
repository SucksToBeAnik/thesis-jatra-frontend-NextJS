"use client";

import { updateDraftContentGivenId } from "@/db-actions/project-drafts";
import { Draft } from "@/types/schema";
import { createClient } from "@/utils/supabase/client";
import debounce from "lodash/debounce";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});

interface DraftEditorProps {
  draft: Draft;
}

const supabase = createClient();

export default function DraftEditor({ draft }: DraftEditorProps) {
  const [content, setContent] = useState(draft.content || "");
  useEffect(() => {
    const channel = supabase
      .channel(`drafts:${draft.id}`)
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "project_drafts" },
        (payload) => {
          setContent(payload.new.content);
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const updateDraftContent = debounce(async (newContent: string) => {
    const updateRes = await updateDraftContentGivenId(
      supabase,
      draft.id,
      newContent
    );
    if (!updateRes.success) {
      console.error(updateRes.message);
    }
  }, 1000);

  function handleChange(value: string) {
    setContent(value);
    updateDraftContent(value);
  }
  return (
    <div className="h-full">
      <ReactQuill className="h-full" value={content} onChange={handleChange} />
    </div>
  );
}

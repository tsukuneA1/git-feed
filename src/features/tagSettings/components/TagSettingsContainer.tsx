"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchConfiguredTags,
  fetchTagCatalogue,
  saveConfiguredTags,
  MockServer
} from "@/mocks/mockServer";
import { TagSettingsView } from "./TagSettingsView";
import { TagSelectionSkeleton } from "@/features/tagSelection/components/TagSelectionSkeleton";

export function TagSettingsContainer() {
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const { data: configuredTags } = useQuery({
    queryKey: ["tag-settings", "configured"],
    queryFn: fetchConfiguredTags
  });

  const {
    data: catalogue,
    isLoading,
    isRefetching
  } = useQuery({
    queryKey: ["tag-settings", "catalogue", page],
    queryFn: () => fetchTagCatalogue(page)
  });

  useEffect(() => {
    if (configuredTags) {
      setSelectedIds(configuredTags);
    }
  }, [configuredTags]);

  const toggleTag = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((tagId) => tagId !== id) : [...prev, id]
    );
  };

  const mutation = useMutation({
    mutationFn: saveConfiguredTags,
    onSuccess: async (payload) => {
      setSelectedIds(payload);
      setFeedbackMessage("タグ設定を保存しました。");
      setErrorMessage(null);
      queryClient.setQueryData(["tag-settings", "configured"], payload);
      await queryClient.invalidateQueries({ queryKey: ["timeline"] });
      await queryClient.invalidateQueries({ queryKey: ["tag-selection"] });
    },
    onError: (error) => {
      if (MockServer.isMockServerError(error, "NO_TAG_SELECTED")) {
        setErrorMessage("タグを少なくとも1つ選択してください。");
      } else {
        setErrorMessage("タグ設定の保存に失敗しました。後でもう一度試してください。");
      }
      setFeedbackMessage(null);
    }
  });

  const handleSave = () => {
    if (selectedIds.length === 0) {
      setErrorMessage("タグが1つも選択されていません。");
      setFeedbackMessage(null);
      return;
    }

    mutation.mutate(selectedIds);
  };

  const canGoNext = useMemo(
    () => (catalogue ? page < catalogue.totalPages : false),
    [catalogue, page]
  );
  const canGoBack = page > 1;

  useEffect(() => {
    if (!mutation.isPending && feedbackMessage) {
      const timeout = setTimeout(() => setFeedbackMessage(null), 2500);
      return () => clearTimeout(timeout);
    }
  }, [mutation.isPending, feedbackMessage]);

  if (isLoading || isRefetching || !catalogue) {
    return <TagSelectionSkeleton />;
  }

  return (
    <TagSettingsView
      tags={catalogue.tags}
      selectedIds={selectedIds}
      page={page}
      totalPages={catalogue.totalPages}
      onToggleTag={toggleTag}
      onNextPage={() => canGoNext && setPage((prev) => prev + 1)}
      onPreviousPage={() => canGoBack && setPage((prev) => Math.max(1, prev - 1))}
      onSave={handleSave}
      isSaving={mutation.isPending}
      errorMessage={errorMessage}
      feedbackMessage={feedbackMessage}
    />
  );
}

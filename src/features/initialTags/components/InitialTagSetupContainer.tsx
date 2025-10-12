"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  fetchTagCatalogue,
  saveConfiguredTags,
  saveSelectedTags,
  MockServer
} from "@/mocks/mockServer";
import { InitialTagSetupView } from "./InitialTagSetupView";
import { TagSelectionSkeleton } from "@/features/tagSelection/components/TagSelectionSkeleton";

const DEFAULT_TAG_IDS = ["typescript", "javascript", "react", "nextjs", "go"];

export function InitialTagSetupContainer() {
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>(DEFAULT_TAG_IDS);
  const [initialised, setInitialised] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    data: catalogue,
    isLoading,
    isRefetching
  } = useQuery({
    queryKey: ["initial-tags", page],
    queryFn: () => fetchTagCatalogue(page)
  });

  useEffect(() => {
    if (catalogue && page === 1 && !initialised) {
      const initial = catalogue.tags
        .slice(0, DEFAULT_TAG_IDS.length)
        .map((tag) => tag.id);
      setSelectedIds(initial);
      setInitialised(true);
    }
  }, [catalogue, page, initialised]);

  const toggleTag = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((tagId) => tagId !== id) : [...prev, id]
    );
  };

  const mutation = useMutation({
    mutationFn: async (ids: string[]) => {
      await saveConfiguredTags(ids);
      await saveSelectedTags(ids);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["timeline"] });
      await queryClient.invalidateQueries({ queryKey: ["tag-settings"] });
      setErrorMessage(null);
      router.push("/");
    },
    onError: (error) => {
      if (MockServer.isMockServerError(error, "NO_TAG_SELECTED")) {
        setErrorMessage("タグを1つ以上選択してください。");
      } else {
        setErrorMessage("タグの保存に失敗しました。もう一度お試しください。");
      }
    }
  });

  const handleSave = () => {
    if (selectedIds.length === 0) {
      setErrorMessage("タグが選択されていません。");
      return;
    }
    mutation.mutate(selectedIds);
  };

  const canGoNext = useMemo(
    () => (catalogue ? page < catalogue.totalPages : false),
    [catalogue, page]
  );
  const canGoBack = page > 1;

  if (isLoading || isRefetching || !catalogue) {
    return <TagSelectionSkeleton />;
  }

  return (
    <InitialTagSetupView
      tags={catalogue.tags}
      selectedIds={selectedIds}
      onToggleTag={toggleTag}
      onSave={handleSave}
      isSaving={mutation.isPending}
      errorMessage={errorMessage}
      page={page}
      totalPages={catalogue.totalPages}
      onNextPage={() => canGoNext && setPage((prev) => prev + 1)}
      onPreviousPage={() => canGoBack && setPage((prev) => Math.max(1, prev - 1))}
    />
  );
}

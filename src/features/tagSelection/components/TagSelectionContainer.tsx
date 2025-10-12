"use client";

import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  fetchTagPage,
  saveSelectedTags,
  MockServer
} from "@/mocks/mockServer";
import type { TagPageResponse } from "@/mocks/types";
import { TagSelectionView } from "./TagSelectionView";
import { TagSelectionSkeleton } from "./TagSelectionSkeleton";
import { TagSelectionEmptyState } from "./TagSelectionEmptyState";

export function TagSelectionContainer() {
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [initialised, setInitialised] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    isRefetching
  } = useQuery({
    queryKey: ["tag-selection", page],
    queryFn: () => fetchTagPage(page),
    retry: false
  });

  useEffect(() => {
    if (data && !initialised) {
      setSelectedIds(data.selectedTagIds);
      setInitialised(true);
    }
  }, [data, initialised]);

  const toggleTag = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((tagId) => tagId !== id) : [...prev, id]
    );
  };

  const mutation = useMutation({
    mutationFn: saveSelectedTags,
    onSuccess: async (_, variables) => {
      await queryClient.invalidateQueries({ queryKey: ["timeline"] });
      await queryClient.invalidateQueries({ queryKey: ["tag-selection"] });
      setErrorMessage(null);
      setSelectedIds(variables);
      queryClient.setQueryData(["tag-selection", page], (previous: unknown) => {
        if (!previous || typeof previous !== "object") {
          return previous;
        }
        const casted = previous as TagPageResponse;
        return { ...casted, selectedTagIds: variables };
      });
    },
    onError: (error) => {
      if (MockServer.isMockServerError(error, "NO_TAG_SELECTED")) {
        setErrorMessage("タグを少なくとも1つは選択してください。");
      } else {
        setErrorMessage("タグの保存に失敗しました。時間をおいて再度お試しください。");
      }
    }
  });

  const handleSave = () => {
    if (selectedIds.length === 0) {
      setErrorMessage("タグを選択する必要があります。");
      return;
    }

    mutation.mutate(selectedIds);
  };

  const handleCancel = () => {
    if (data) {
      setSelectedIds(data.selectedTagIds);
    }
    setErrorMessage(null);
  };

  const canGoNext = useMemo(
    () => (data ? page < data.totalPages : false),
    [data, page]
  );

  const canGoBack = page > 1;

  if (isLoading || isRefetching) {
    return <TagSelectionSkeleton />;
  }

  if (!data) {
    return null;
  }

  if (data.tags.length === 0) {
    return (
      <TagSelectionEmptyState
        onOpenSettings={() => router.push("/tags/settings")}
      />
    );
  }

  return (
    <TagSelectionView
      tags={data.tags}
      selectedIds={selectedIds}
      onToggleTag={toggleTag}
      onNextPage={() => canGoNext && setPage((prev) => prev + 1)}
      onPreviousPage={() => canGoBack && setPage((prev) => Math.max(1, prev - 1))}
      page={page}
      totalPages={data.totalPages}
      onSave={handleSave}
      onCancel={handleCancel}
      isSaving={mutation.isPending}
      errorMessage={errorMessage}
    />
  );
}

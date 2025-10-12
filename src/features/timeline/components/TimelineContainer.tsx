"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  fetchAuth,
  fetchTimeline,
  reloadTimeline,
  MockServer
} from "@/mocks/mockServer";
import { TimelineView } from "./TimelineView";
import { TimelineSkeleton } from "./TimelineSkeleton";
import { TimelineEmptyState } from "./TimelineEmptyState";
import { TimelineTagNotice } from "./TimelineTagNotice";
import { resolveTagLabels } from "@/mocks/tagDictionary";
import { TimelineWelcomeCard } from "./TimelineWelcomeCard";

export function TimelineContainer() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: authState } = useQuery({
    queryKey: ["auth"],
    queryFn: fetchAuth
  });

  const {
    data,
    isLoading,
    error,
    isRefetching
  } = useQuery({
    queryKey: ["timeline"],
    queryFn: fetchTimeline,
    retry: false
  });

  const [reloadError, setReloadError] = useState<string | null>(null);
  const [welcomeDismissed, setWelcomeDismissed] = useState(false);

  const reloadMutation = useMutation({
    mutationFn: reloadTimeline,
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["timeline"] });
    },
    onSuccess: (payload) => {
      queryClient.setQueryData(["timeline"], payload);
      setReloadError(null);
    },
    onError: (mutationError) => {
      if (MockServer.isMockServerError(mutationError, "RELOAD_FAILED")) {
        setReloadError(mutationError.message);
      } else {
        setReloadError("タイムラインの更新に失敗しました。再度お試しください。");
      }
    }
  });

  const noTagsConfigured =
    error && MockServer.isMockServerError(error, "NO_TAGS_CONFIGURED");

  const isEmpty = useMemo(
    () => data && data.feeds.length === 0,
    [data]
  );

  if (isLoading || isRefetching) {
    return <TimelineSkeleton />;
  }

  if (noTagsConfigured) {
    return (
      <TimelineTagNotice
        message="タグが設定されていません。まずは興味のあるタグを設定しましょう。"
        onNavigateSettings={() => router.push("/tags/settings")}
      />
    );
  }

  if (error) {
    return (
      <TimelineTagNotice
        message="タイムラインの取得に失敗しました。時間をおいて再度お試しください。"
        onNavigateSettings={() => router.refresh()}
        actionLabel="再読み込み"
      />
    );
  }

  if (!data) {
    return null;
  }

  const activeTagIds =
    data.selectedTagIds.length > 0 ? data.selectedTagIds : data.configuredTagIds;
  const tagLabels = resolveTagLabels(activeTagIds);
  const shouldShowWelcome = Boolean(authState?.welcomeMessage) && !welcomeDismissed;

  if (isEmpty) {
    return (
      <TimelineEmptyState
        onOpenTagSelection={() => router.push("/timeline/select")}
      />
    );
  }

  return (
    <div className="space-y-6">
      {shouldShowWelcome ? (
        <TimelineWelcomeCard
          message={authState?.welcomeMessage ?? ""}
          onDismiss={() => setWelcomeDismissed(true)}
          onStartSetup={() => router.push("/tags/initial")}
        />
      ) : null}
      <TimelineView
        feeds={data.feeds}
        lastUpdated={data.updatedAt}
        tagLabels={tagLabels}
        onReload={() => reloadMutation.mutate()}
        isReloading={reloadMutation.isPending}
        reloadError={reloadError}
        onOpenTagSelection={() => router.push("/timeline/select")}
      />
    </div>
  );
}

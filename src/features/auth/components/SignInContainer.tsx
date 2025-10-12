"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { fetchAuth, signIn, MockServer } from "@/mocks/mockServer";
import { SignInView } from "./SignInView";

type SignInMode = "success" | "network-error" | "denied" | "token-error";

export function SignInContainer() {
  const [mode, setMode] = useState<SignInMode>("success");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: authState } = useQuery({
    queryKey: ["auth"],
    queryFn: fetchAuth
  });

  const mutation = useMutation({
    mutationFn: () => signIn(mode),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["auth"] });
      await queryClient.invalidateQueries({ queryKey: ["timeline"] });
      setErrorMessage(null);
      router.push("/");
    },
    onError: (error) => {
      if (MockServer.isMockServerError(error)) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("不明なエラーが発生しました。時間をおいて再試行してください。");
      }
    }
  });

  return (
    <SignInView
      mode={mode}
      onModeChange={setMode}
      isLoading={mutation.isPending}
      onSubmit={() => mutation.mutate()}
      errorMessage={errorMessage}
      authState={authState}
    />
  );
}

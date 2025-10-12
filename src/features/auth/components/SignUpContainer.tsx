"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { fetchAuth, signUp, MockServer } from "@/mocks/mockServer";
import { SignUpView } from "./SignUpView";

type SignUpMode = "success" | "no-account" | "creation-error";

export function SignUpContainer() {
  const [mode, setMode] = useState<SignUpMode>("success");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: authState } = useQuery({
    queryKey: ["auth"],
    queryFn: fetchAuth
  });

  const mutation = useMutation({
    mutationFn: () => signUp(mode),
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
        setErrorMessage("サインアップに失敗しました。時間をおいて再度お試しください。");
      }
    }
  });

  return (
    <SignUpView
      mode={mode}
      onModeChange={setMode}
      isLoading={mutation.isPending}
      onSubmit={() => mutation.mutate()}
      errorMessage={errorMessage}
      authState={authState}
    />
  );
}

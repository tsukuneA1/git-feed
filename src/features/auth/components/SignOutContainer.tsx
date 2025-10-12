"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { fetchAuth, signOut, MockServer } from "@/mocks/mockServer";
import { SignOutView } from "./SignOutView";

type SignOutMode = "success" | "network-error";

export function SignOutContainer() {
  const [mode, setMode] = useState<SignOutMode>("success");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: authState } = useQuery({
    queryKey: ["auth"],
    queryFn: fetchAuth,
    refetchOnWindowFocus: false
  });

  const mutation = useMutation({
    mutationFn: () => signOut(mode),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["auth"] });
      setErrorMessage(null);
      router.push("/signin");
    },
    onError: (error) => {
      if (MockServer.isMockServerError(error)) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("サインアウトに失敗しました。もう一度お試しください。");
      }
    }
  });

  return (
    <SignOutView
      authState={authState}
      mode={mode}
      onModeChange={setMode}
      onSubmit={() => mutation.mutate()}
      isLoading={mutation.isPending}
      errorMessage={errorMessage}
    />
  );
}

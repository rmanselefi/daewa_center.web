"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { AuthService } from "@/services/auth.service";

export function useLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const response = await AuthService.login(email, password);
      return response;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
}

export function useLogout() {
  const qc = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: async () => {
      await AuthService.LogOut();
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["user"] });
      router.push("/login");
    },
    onError: (error) => {
      console.error(error);
    },
  });
}

export function useUser() {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await AuthService.getUserMe();
      return response.user;
    },
    retry: false,
  });
}

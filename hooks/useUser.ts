"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { AuthService, CreateUserReq } from "@/services/auth.service";
import { toast } from "sonner";
import { AxiosError } from "axios";

export const USER_KEYS = {
  all: ["users"] as const,
  lists: () => [...USER_KEYS.all, "list"] as const,
  list: (filters: string) => [...USER_KEYS.lists(), { filters }] as const,
  details: () => [...USER_KEYS.all, "detail"] as const,
  detail: (id: string) => [...USER_KEYS.details(), id] as const,
};

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
      console.log(password);
      const response = await AuthService.login(email, password);
      return response;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: USER_KEYS.detail("me") });
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
      qc.invalidateQueries({ queryKey: USER_KEYS.detail("me") });
      router.push("/login");
    },
    onError: (error) => {
      console.error(error);
    },
  });
}

export function useUser() {
  return useQuery({
    queryKey: USER_KEYS.detail("me"),
    queryFn: async () => {
      const response = await AuthService.getUserMe();
      return response || null;
    },
    retry: false,
    // Suppress 401 errors - they're expected when user is not logged in
    onError: (error) => {
      // Only log non-401 errors
      if (error instanceof AxiosError && error.response?.status !== 401) {
        console.error("getUserMe error:", error);
      }
    },
    // Don't throw 401 errors to React Query
    throwOnError: (error) => {
      if (error instanceof AxiosError && error.response?.status === 401) {
        return false; // Don't throw 401 errors
      }
      return true; // Throw other errors
    },
  });
}

export function useUserRegister() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserReq) => AuthService.createUser(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: USER_KEYS.lists() });
      toast.success("User created successfully");
    },
    onError: (error: AxiosError<{ message?: string }>) => {
      toast.error(error.response?.data?.message || "Failed to create user");
    },
  });
}


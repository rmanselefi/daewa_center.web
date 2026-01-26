"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { AuthService, CreateUserReq, UserResponse, UserStats } from "@/services/auth.service";
import { toast } from "sonner";
import { AxiosError } from "axios";

export const USER_KEYS = {
  all: ["users"] as const,
  lists: () => [...USER_KEYS.all, "list"] as const,
  list: (filters: string) => [...USER_KEYS.lists(), { filters }] as const,
  details: () => [...USER_KEYS.all, "detail"] as const,
  detail: (id: string) => [...USER_KEYS.details(), id] as const,
  stats: () => [...USER_KEYS.all, "stats"] as const,
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
  return useQuery<UserResponse | null>({
    queryKey: USER_KEYS.detail("me"),
    queryFn: async () => {
      // getUserMe handles 401 and network errors gracefully by returning null
      // No need for try-catch here since errors are handled in the service layer
      return await AuthService.getUserMe();
    },
    retry: false, // Don't retry - network errors and 401s are handled gracefully
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

export function useUserStats(enabled: boolean = true) {
  return useQuery<UserStats>({
    queryKey: USER_KEYS.stats(),
    queryFn: async () => {
      try {
        const response = await AuthService.getUserStats();
        return response;
      } catch (error) {
        console.error("getUserStats error:", error);
        throw error;
      }
    },
    enabled,
    retry: false,
  });
}
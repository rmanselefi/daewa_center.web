"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
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
      const credentials = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const idToken = await credentials.user.getIdToken();
      await AuthService.loginWithIsdToken(idToken);
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
  return useMutation({
    mutationFn: async () => {
      await AuthService.LogOut();
      await signOut(auth);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["user"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });
}

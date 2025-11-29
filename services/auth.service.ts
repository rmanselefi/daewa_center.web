import api from "@/lib/api";

export type UserResponse = {
  id: string;
  email?: string | null;
  fullname?: string | null;
  photoURL?: string | null;
  profile?: Record<string, unknown> | null;
};

export type CreateUserReq = {
  email: string;
  password: string;
  fullname: string;
};

export const AuthService = {
  async login(email: string, password: string) {
    const response = await api.post("/api/auth/login", { email, password });
    return response.data;
  },

  async LogOut() {
    const response = await api.post("/api/auth/logout");
    return response.data;
  },

  async getUserMe(): Promise<UserResponse> {
    const response = await api.get("/api/auth/me");
    return response.data;
  },

  async createUser({ email, password, fullname }: CreateUserReq) {
    const response = await api.post("/api/user", { email, password, fullname });
    return response.data;
  },
};

import { useQuery } from "@tanstack/react-query";
import { useElysiaClient } from "../providers/Eden";

export function useAuth() {
  const elysiaClient = useElysiaClient();

  return useQuery({
    queryKey: ["auth"],
    queryFn: async () => {
      const res = await elysiaClient.auth.profile.get();

      if (res.error) {
        throw new Error("Not authenticated");
      }

      return res.data;
    },
    retry: false,
  });
}
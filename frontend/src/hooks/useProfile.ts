import { useState, useEffect } from "react";
import type { UserRead } from "../types/auth";
import { authService } from "../service/authService";

export const useProfile = () => {
  const [user, setUser] = useState<UserRead | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setError(null);
        const profile = await authService.profile();
        setUser(profile);
      } catch (error) {
        setUser(null);
        setError(
          error instanceof Error ? error.message : "Error loading profile",
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  return { user, loading, error };
};

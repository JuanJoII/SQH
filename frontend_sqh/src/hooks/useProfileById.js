// src/hooks/useProfileById.js
import { useState, useEffect } from "react";
import api from "../api/client";

export default function useProfileById(userId) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await api.get(`/profile/by-id/${userId}`);
        setProfile(res.data);
      } catch (err) {
        console.log("Perfil no encontrado para user_id:", userId);
        setProfile({
          username: "anónimo",
          full_name: null,
          profile_picture_url: null
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  return { profile, loading };
}
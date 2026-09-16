import { useEffect, useState } from "react";

const useAuth = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(`${API_URL}`, {
          method: "GET",
          credentials: "include",
          headers: {
            "content-type": "application/json",
          },
        });
        const data = await response.json();
        if (response.ok) {
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch (error) {
        setUser(null);
        console.log("Error in auth ", error);
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);
  return { loading, user };
};

export default useAuth;

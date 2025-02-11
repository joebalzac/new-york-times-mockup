import axios from "axios";
import { useEffect, useState } from "react";

const useData = <T>(endpoint: string) => {
  const [data, setdata] = useState<T[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchNewYorkTimes = async () => {
      if (!endpoint) return;
      try {
        setIsLoading(true);
        const res = await axios.get(`https://api.nytimes.com/svc/${endpoint}`, {
          params: {
            "api-key": "eo8G7acBqLqBHRGkrrV3GKq47GhYtMIH",
          },
        });
        const data: T[] = endpoint.includes("articlesearch")
          ? res.data.response.docs
          : res.data.results;
        setdata(data);
        console.log("Use Data", data);
      } catch (error) {
        if (error) {
          setError("An unknown error has occured");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchNewYorkTimes();
  }, [endpoint]);

  return { data, isLoading, error };
};

export default useData;

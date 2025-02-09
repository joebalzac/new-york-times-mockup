import axios from "axios";
import { useEffect, useState } from "react";

const useData = <T>(endpoint: string) => {
  const [data, setdata] = useState<T[]>([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
 
  useEffect(() => {
    const fetchNewYorkTimes = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `https://api.nytimes.com/svc/topstories/v2/${endpoint}`,
          {
            params: {
              "api-key": "eo8G7acBqLqBHRGkrrV3GKq47GhYtMIH",
            },
          }
        );
        const data: T[] = response.data.results;
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
  }, []);

  return { data, isLoading, error };
};

export default useData;

import { useState, useCallback, useRef, useEffect } from "react";

// a hook that sends an HTTP request and manages error&loading states;
export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(undefined);

  const activeHttpRequests = useRef([]); // or could use useState()

  const sendRequest = useCallback(
    async (url, method = "GET", body = null, headers = {}) => {
      const httpAbortController = new AbortController();
      activeHttpRequests.current.push(httpAbortController);

      setIsLoading(true);
      try {
        const response = await fetch(url, {
          method,
          headers,
          body,
          signal: httpAbortController.signal
        });

        const jsonResponse = await response.json();
        console.log("jsonResponse:", jsonResponse);
        setIsLoading(false); // stops the loading for both success&error

        // removes the current request's AbortController
        activeHttpRequests.current.filter((reqCtrl) => reqCtrl !== httpAbortController);

        if (response.ok) {
          return jsonResponse; // if not ok, undefined is returned (error is thrown);
        } else {
          console.log("Got a non-ok status code.");
          throw new Error(jsonResponse.message);
        }
      } catch (err) {
        setError(err.message || "Something went wrong. Please try again.");
        throw err; // to let the component know there's an error
      }
    },
    []
  );

  const errorResetHandler = () => {
    setError(null);
  };

  useEffect(() => {
    return () => {
      activeHttpRequests.current.forEach((abortCtrl) => abortCtrl.abort()); // abort each request registered
    };
  }, []);

  return { isLoading, error, sendRequest, errorResetHandler };
};


// note: aborting the HTTP request when the component unmounts is optional;

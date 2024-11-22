"use client";

import { useEffect, useRef } from "react";

interface SearchResultsCleanerProps {
  deleteSearchCookie: () => Promise<void>;
}

export default function SearchResultsCleaner({
  deleteSearchCookie,
}: SearchResultsCleanerProps) {
  const deleteSearchCookieRef = useRef(deleteSearchCookie);

  useEffect(() => {
    deleteSearchCookieRef.current = deleteSearchCookie;
  });

  useEffect(() => {
    deleteSearchCookieRef.current();
  }, []);

  return null;
}

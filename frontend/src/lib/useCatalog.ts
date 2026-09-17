"use client";

import { useEffect, useState } from "react";
import { api } from "./api";
import type { Catalog } from "./types";

let cached: Catalog | null = null;

export function useCatalog() {
  const [catalog, setCatalog] = useState<Catalog | null>(cached);
  const [loading, setLoading] = useState(!cached);

  useEffect(() => {
    if (cached) return;
    api
      .get<Catalog>("/onboarding/catalog")
      .then((data) => {
        cached = data;
        setCatalog(data);
      })
      .finally(() => setLoading(false));
  }, []);

  return { catalog, loading };
}

"use client"

import { debounce, parseAsString, useQueryState } from "nuqs"

export function useDataSearch() {
  const [search, setSearch] = useQueryState(
    "search",
    parseAsString.withDefault("").withOptions({ shallow: true })
  )

  return {
    search: search,
    setSearch: (newSearch: string) =>
      setSearch(newSearch, {
        limitUrlUpdates: newSearch === "" ? undefined : debounce(500),
      }),
    clearSearch: () => setSearch(""),
  }
}

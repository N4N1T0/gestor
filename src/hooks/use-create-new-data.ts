"use client"

import { NavMainItems } from "@/types"
import { debounce, parseAsStringEnum, useQueryState } from "nuqs"

export function useCreateNewData() {
  const [newData, setNewData] = useQueryState(
    "newData",
    parseAsStringEnum<NavMainItems | "">(Object.values(NavMainItems))
      .withDefault("")
      .withOptions({ shallow: true })
  )

  return {
    newData: newData,
    setNewData: (newDataValue: NavMainItems | "") =>
      setNewData(newDataValue, {
        limitUrlUpdates: newDataValue === "" ? undefined : debounce(500),
      }),
    clearNewData: () => setNewData(""),
  }
}

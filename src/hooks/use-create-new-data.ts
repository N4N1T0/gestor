"use client"

import { NavMainItems, NewDataAction } from "@/types"
import { debounce, parseAsStringEnum, useQueryState } from "nuqs"

export function useCreateNewData() {
  const [newData, setNewData] = useQueryState(
    "newData",
    parseAsStringEnum<NavMainItems | "">(Object.values(NavMainItems))
      .withDefault("")
      .withOptions({ shallow: true })
  )

  const [newDataAction, setNewDataAction] = useQueryState(
    "newDataAction",
    parseAsStringEnum<NewDataAction | "">(Object.values(NewDataAction))
      .withDefault("")
      .withOptions({ shallow: true })
  )

  return {
    newData: newData,
    newDataAction: newDataAction,
    setNewData: (
      newDataValue: NavMainItems | "",
      action: NewDataAction = NewDataAction.CREATE
    ) => {
      setNewData(newDataValue, {
        limitUrlUpdates: newDataValue === "" ? undefined : debounce(500),
      })

      setNewDataAction(newDataValue === "" ? "" : action, {
        limitUrlUpdates: newDataValue === "" ? undefined : debounce(500),
      })
    },
    clearNewData: () => {
      setNewData("")
      setNewDataAction("")
    },
  }
}

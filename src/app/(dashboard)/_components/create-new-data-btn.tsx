"use client"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useCreateNewData } from "@/hooks/use-create-new-data"
import { NavMainItems, NewDataAction } from "@/types"
import { PencilLine, Plus } from "lucide-react"

interface CreateNewDataBtnProps {
  dataSource: NavMainItems
  action?: NewDataAction
}

export const CreateNewDataBtn = ({
  dataSource,
  action = NewDataAction.CREATE,
}: CreateNewDataBtnProps) => {
  const { setNewData } = useCreateNewData()

  const formattedDataSource = dataSource.toLowerCase().replace(/s$/, "")

  const handleClick = () => {
    setNewData(dataSource, action)
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button type="button" onClick={handleClick}>
          {action === "create" ? <Plus /> : <PencilLine />}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="right">
        {action === "create"
          ? `Crear nuevo ${formattedDataSource}`
          : `Editar ${formattedDataSource}`}
      </TooltipContent>
    </Tooltip>
  )
}

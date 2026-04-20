"use client"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useCreateNewData } from "@/hooks/use-create-new-data"
import { NavMainItems } from "@/types"
import { PencilLine, Plus } from "lucide-react"

interface CreateNewDataBtnProps {
  dataSource: NavMainItems
  action?: "create" | "edit"
}

export const CreateNewDataBtn = ({
  dataSource,
  action = "create",
}: CreateNewDataBtnProps) => {
  const { setNewData } = useCreateNewData()

  const formattedDataSource = dataSource.toLowerCase().replace("s", "")

  const handleClick = () => {
    setNewData(dataSource)
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

"use client"

import { useState } from "react"
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Plus, MoreHorizontal, Calendar, AlertCircle } from "lucide-react"
import { format } from "date-fns"

// Mock Data
const INITIAL_COLUMNS = {
  todo: {
    id: "todo",
    title: "To Do / Intake",
    items: [
      {
        id: "imm-1",
        client: "TechCorp Guyana Inc.",
        applicant: "John Smith",
        type: "Work Permit",
        dueDate: new Date(2025, 4, 15),
        priority: "High",
      },
      {
        id: "imm-2",
        client: "Mining Ventures Ltd",
        applicant: "Maria Garcia",
        type: "Business Visa",
        dueDate: new Date(2025, 4, 20),
        priority: "Medium",
      },
    ],
  },
  in_progress: {
    id: "in_progress",
    title: "Processing (GRA/Home Affairs)",
    items: [
      {
        id: "imm-3",
        client: "Oil & Gas Services",
        applicant: "Robert Chen",
        type: "Work Permit Extension",
        dueDate: new Date(2025, 3, 30),
        priority: "Critical",
      },
    ],
  },
  review: {
    id: "review",
    title: "Pending Approval",
    items: [
      {
        id: "imm-4",
        client: "Retail Holdings",
        applicant: "Sarah Jones",
        type: "Citizenship",
        dueDate: new Date(2025, 5, 1),
        priority: "Low",
      },
    ],
  },
  done: {
    id: "done",
    title: "Completed / Issued",
    items: [],
  },
}

export function ImmigrationKanban() {
  const [columns, setColumns] = useState(INITIAL_COLUMNS)

  const onDragEnd = (result: any) => {
    if (!result.destination) return

    const { source, destination } = result

    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId as keyof typeof columns]
      const destColumn = columns[destination.droppableId as keyof typeof columns]
      const sourceItems = [...sourceColumn.items]
      const destItems = [...destColumn.items]
      const [removed] = sourceItems.splice(source.index, 1)
      destItems.splice(destination.index, 0, removed)
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems,
        },
      })
    } else {
      const column = columns[source.droppableId as keyof typeof columns]
      const copiedItems = [...column.items]
      const [removed] = copiedItems.splice(source.index, 1)
      copiedItems.splice(destination.index, 0, removed)
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems,
        },
      })
    }
  }

  return (
    <div className="h-[calc(100vh-200px)] w-full overflow-x-auto">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex h-full gap-6">
          {Object.values(columns).map((column) => (
            <div key={column.id} className="flex h-full w-[350px] min-w-[350px] flex-col rounded-lg bg-muted/50 p-4">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold text-foreground">
                  {column.title} <span className="ml-2 text-muted-foreground">({column.items.length})</span>
                </h3>
                {column.id === "todo" && (
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Plus className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <Droppable droppableId={column.id}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="flex flex-1 flex-col gap-3 overflow-y-auto"
                  >
                    {column.items.map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="cursor-grab active:cursor-grabbing"
                          >
                            <CardHeader className="p-4 pb-2">
                              <div className="flex items-start justify-between">
                                <Badge
                                  variant={
                                    item.priority === "Critical"
                                      ? "destructive"
                                      : item.priority === "High"
                                        ? "default"
                                        : "secondary"
                                  }
                                  className="text-[10px]"
                                >
                                  {item.priority}
                                </Badge>
                                <Button variant="ghost" size="icon" className="h-6 w-6">
                                  <MoreHorizontal className="h-3 w-3" />
                                </Button>
                              </div>
                              <CardTitle className="text-sm font-medium leading-tight">{item.applicant}</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 pt-2">
                              <div className="mb-2 text-xs text-muted-foreground">{item.client}</div>
                              <div className="mb-3 text-xs font-medium">{item.type}</div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <Calendar className="h-3 w-3" />
                                  {format(item.dueDate, "MMM d")}
                                </div>
                                {item.priority === "Critical" && <AlertCircle className="h-4 w-4 text-destructive" />}
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  )
}

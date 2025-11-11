import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2, ClipboardList } from "lucide-react"

const pendingTasks = [
  { id: 1, task: "Update missing PAN numbers", count: 2 },
  { id: 2, task: "Approve pending leave requests", count: 3 },
  { id: 3, task: "Verify attendance for Oct 3rd", count: 1 }
]

const TodoCard = () => {
  return (
    <Card className="w-full max-w-md rounded-2xl shadow-md">
      <CardHeader className="flex items-center gap-2">
        <ClipboardList className="text-amber-600" size={20} />
        <CardTitle className="text-lg font-semibold">Pending Tasks</CardTitle>
      </CardHeader>
      <CardContent className="">
        {pendingTasks.map(task => (
          <div
            key={task.id}
            className="flex items-center justify-between p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition"
          >
            <p className="text-sm text-gray-700">
              {task.task} <span className="font-semibold">({task.count})</span>
            </p>
            <CheckCircle2 size={18} className="text-gray-400 hover:text-green-500 cursor-pointer" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}


export default TodoCard
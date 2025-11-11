import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShieldCheck, RefreshCw } from "lucide-react"

const SystemInfo = () => {
  return (
    <Card className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 max-w-md">
      <CardHeader className="flex items-center gap-2">
        <ShieldCheck className="text-green-600" size={20} />
        <CardTitle className="text-lg font-semibold">System Info</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <RefreshCw size={16} className="text-blue-500" />
          <span>Last Data Sync: <b>Today at 10:00 AM</b></span>
        </div>
        <div className="flex items-center gap-2">
          <RefreshCw size={16} className="text-purple-500" />
          <span>Backup Scheduled: <b>Daily at 12 AM</b></span>
        </div>
      </CardContent>
      </Card>
  )
}

export default SystemInfo

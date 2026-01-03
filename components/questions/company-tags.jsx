import { Badge } from "@/components/ui/badge"
import { Building2 } from "lucide-react"

export default function CompanyTags({ companies, maxVisible = 3 }) {
  if (!companies || companies.length === 0) return null

  const visible = companies.slice(0, maxVisible)
  const remaining = companies.length - maxVisible

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
      {visible.map((company) => (
        <Badge key={company} variant="secondary" className="text-xs">
          {company}
        </Badge>
      ))}
      {remaining > 0 && (
        <Badge variant="secondary" className="text-xs">
          +{remaining}
        </Badge>
      )}
    </div>
  )
}

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface MetricCardProps {
  label: string
  value: string | number
  helper?: string
}

export default function MetricCard({ label, value, helper }: MetricCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle>{value}</CardTitle>
      </CardHeader>
      {helper ? (
        <CardContent className="text-muted-foreground">{helper}</CardContent>
      ) : null}
    </Card>
  )
}

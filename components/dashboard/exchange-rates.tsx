import { ArrowDown, ArrowUp, RefreshCcw, TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const RATES = [
  {
    currency: "USD",
    rate: 215.5,
    change: 0.25,
    trend: "up",
    name: "US Dollar",
  },
  {
    currency: "EUR",
    rate: 232.1,
    change: -0.15,
    trend: "down",
    name: "Euro",
  },
  {
    currency: "GBP",
    rate: 271.8,
    change: 0.4,
    trend: "up",
    name: "British Pound",
  },
  {
    currency: "CAD",
    rate: 158.2,
    change: 0.0,
    trend: "neutral",
    name: "Canadian Dollar",
  },
]

export function ExchangeRateWidget() {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Exchange Rates
            </CardTitle>
            <CardDescription>Indicative Commercial Bank Rates (GYD)</CardDescription>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <RefreshCcw className="h-4 w-4" />
            <span className="sr-only">Refresh rates</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {RATES.map((item) => (
            <div key={item.currency} className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted font-bold">
                  {item.currency}
                </div>
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">1 {item.currency} =</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-lg">${item.rate.toFixed(2)}</p>
                <div
                  className={`flex items-center justify-end text-xs ${
                    item.trend === "up"
                      ? "text-green-600"
                      : item.trend === "down"
                        ? "text-red-600"
                        : "text-muted-foreground"
                  }`}
                >
                  {item.trend === "up" && <ArrowUp className="mr-1 h-3 w-3" />}
                  {item.trend === "down" && <ArrowDown className="mr-1 h-3 w-3" />}
                  {item.change > 0 ? "+" : ""}
                  {item.change.toFixed(2)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

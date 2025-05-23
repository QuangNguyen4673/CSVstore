import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export function SearchBar({ value, onChange }: { value: string; onChange: (val: string) => void }) {
  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
      <Input
        type="text"
        placeholder="Search..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pl-10"
      />
    </div>
  )
}

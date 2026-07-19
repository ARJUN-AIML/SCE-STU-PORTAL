import * as React from "react"


export function TimetableFilters({
  filters,
  setFilters,
}: {
  filters: any
  setFilters: (f: any) => void
}) {
  const updateFilter = (key: string, value: string) => {
    setFilters((prev: any) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="bg-surface border border-border p-4 rounded-2xl shadow-sm flex flex-wrap gap-4 items-center mb-6">
      <div className="flex flex-col gap-1 w-[140px]">
        <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Department</label>
        <select
          value={filters.department}
          onChange={(e) => updateFilter("department", e.target.value)}
          className="h-9 px-3 bg-bg border border-border rounded-lg text-sm text-text focus:ring-2 focus:ring-primary/50"
        >
          {["CSE", "AIDS", "IT", "ECE", "EEE", "MECH", "CIVIL", "BME"].map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1 w-[120px]">
        <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Year</label>
        <select
          value={filters.year}
          onChange={(e) => updateFilter("year", e.target.value)}
          className="h-9 px-3 bg-bg border border-border rounded-lg text-sm text-text focus:ring-2 focus:ring-primary/50"
        >
          {["1", "2", "3", "4"].map((y) => (
            <option key={y} value={y}>Year {y}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1 w-[120px]">
        <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Semester</label>
        <select
          value={filters.semester}
          onChange={(e) => updateFilter("semester", e.target.value)}
          className="h-9 px-3 bg-bg border border-border rounded-lg text-sm text-text focus:ring-2 focus:ring-primary/50"
        >
          {["1", "2", "3", "4", "5", "6", "7", "8"].map((s) => (
            <option key={s} value={s}>Sem {s}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1 w-[120px]">
        <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Section</label>
        <select
          value={filters.section}
          onChange={(e) => updateFilter("section", e.target.value)}
          className="h-9 px-3 bg-bg border border-border rounded-lg text-sm text-text focus:ring-2 focus:ring-primary/50"
        >
          {["A", "B"].map((s) => (
            <option key={s} value={s}>Sec {s}</option>
          ))}
        </select>
      </div>
      
      <div className="flex flex-col gap-1 flex-1 min-w-[200px]">
         <label className="text-[10px] font-bold text-muted uppercase tracking-wider">Search Subject / Faculty</label>
         <input 
            type="text" 
            placeholder="Search..." 
            value={filters.search}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="h-9 px-3 bg-bg border border-border rounded-lg text-sm text-text focus:ring-2 focus:ring-primary/50 w-full"
         />
      </div>
    </div>
  )
}

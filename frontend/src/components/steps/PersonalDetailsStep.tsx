import { Mars, Venus } from "lucide-react"
import { NumberField } from "@/components/ui/NumberField"
import { SelectCard } from "@/components/ui/SelectCard"
import type { Gender } from "@/lib/types"

export interface PersonalDetails {
  age: string
  gender: Gender | null
  height: string
  weight: string
}

interface Props {
  value: PersonalDetails
  onChange: (patch: Partial<PersonalDetails>) => void
  errors: Partial<Record<keyof PersonalDetails, string>>
}

export function PersonalDetailsStep({ value, onChange, errors }: Props) {
  return (
    <div className="animate-fade-up space-y-6">
      <div className="space-y-1.5">
        <h1 className="text-balance text-2xl font-bold tracking-tight sm:text-3xl">
          Let&apos;s build your health plan
        </h1>
        <p className="text-pretty text-muted">
          Tell us a little about yourself to get a personalized recommendation.
        </p>
      </div>

      <div className="space-y-3">
        <span className="text-sm font-medium text-muted">Gender</span>
        <div className="grid grid-cols-2 gap-3">
          <SelectCard
            selected={value.gender === "male"}
            onSelect={() => onChange({ gender: "male" })}
            icon={<Mars className="h-5 w-5" />}
            title="Male"
          />
          <SelectCard
            selected={value.gender === "female"}
            onSelect={() => onChange({ gender: "female" })}
            icon={<Venus className="h-5 w-5" />}
            title="Female"
          />
        </div>
        {errors.gender && (
          <p className="text-xs font-medium text-red-400">{errors.gender}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <NumberField
          label="Age"
          unit="yrs"
          placeholder="25"
          min={1}
          max={120}
          value={value.age}
          onChange={(e) => onChange({ age: e.target.value })}
          error={errors.age}
        />
        <NumberField
          label="Height"
          unit="cm"
          placeholder="175"
          min={50}
          max={260}
          value={value.height}
          onChange={(e) => onChange({ height: e.target.value })}
          error={errors.height}
        />
        <NumberField
          label="Weight"
          unit="kg"
          placeholder="70"
          min={20}
          max={400}
          value={value.weight}
          onChange={(e) => onChange({ weight: e.target.value })}
          error={errors.weight}
        />
      </div>
    </div>
  )
}

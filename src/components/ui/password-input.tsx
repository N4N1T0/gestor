import { Eye, EyeClosed } from "lucide-react"
import { useState } from "react"
import { Input } from "./input"

type PasswordInputProps = React.ComponentProps<"input">

export const PasswordInput = ({ ...props }: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false)

  const handleToggleInput = () => {
    setShowPassword((prev) => !prev)
  }

  return (
    <div className="relative">
      <Input type={showPassword ? "text" : "password"} {...props} />

      <button
        type="button"
        onClick={handleToggleInput}
        className="absolute right-2 top-1/2 -translate-y-1/2"
      >
        {showPassword ? (
          <Eye strokeWidth={1} className="text-current" />
        ) : (
          <EyeClosed strokeWidth={1} className="text-current" />
        )}
      </button>
    </div>
  )
}

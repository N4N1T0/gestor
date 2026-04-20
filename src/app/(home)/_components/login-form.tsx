"use client"

import { loginUser } from "@/app/_actions/auth"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/ui/password-input"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { useAction } from "next-safe-action/hooks"
import { useRouter } from "next/dist/client/components/navigation"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import { LoginUserSchema, loginUserSchema } from "../_schemas"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  // STATE & ACTIONS
  const route = useRouter()
  const { handleSubmit, reset, formState, control } = useForm<LoginUserSchema>({
    resolver: zodResolver(loginUserSchema as never),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const { execute, isExecuting } = useAction(loginUser, {
    onSuccess: () => {
      reset()
      toast.success("Inicio de sesión exitoso")
      setTimeout(() => {
        route.push("/dashboard")
      }, 300)
    },
    onError: ({ error }) => {
      toast.error(error.serverError ?? "An unexpected error occurred")
    },
  })

  // HANDLERS AND COMPUTED
  const onSubmit = handleSubmit((data) => {
    execute(data)
  })

  const isDisabled = isExecuting || formState.isSubmitting

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Bienvenido de nuevo</CardTitle>
          <CardDescription>
            Inicia sesión en N4N0 G3ST0R para gestionar tus operaciones en
            línea.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="login-form" onSubmit={onSubmit}>
            <FieldGroup>
              <Controller
                name="email"
                control={control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="email">Correo electrónico</FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      required
                      autoComplete="email"
                      aria-invalid={fieldState.invalid}
                      disabled={isDisabled}
                      {...field}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Field>
                <Controller
                  name="password"
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor="password">Contraseña</FieldLabel>
                      <PasswordInput
                        id="password"
                        placeholder="Introduce tu contraseña"
                        required
                        autoComplete="current-password"
                        aria-invalid={fieldState.invalid}
                        disabled={isDisabled}
                        {...field}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              </Field>
              <Button type="submit" disabled={isDisabled}>
                {isExecuting ? "Iniciando sesión..." : "Iniciar sesión"}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

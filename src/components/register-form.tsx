"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { GalleryVerticalEndIcon, MessageSquare, MessagesSquare } from "lucide-react"
import { handleRegister } from "@/app/auth/signup/action"
import { useState } from "react"

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    const formData = new FormData(event.currentTarget);
    const result = await handleRegister(formData);
    if (result) setError(result.message);
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form
        onSubmit={handleSubmit}
      >
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <a
              href="#"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-8 items-center justify-center rounded-md">
                <MessagesSquare className="size-6" />
              </div>
              <span className="sr-only">PyChat</span>
            </a>
            <h1 className="text-xl font-bold">Welcome to PyChat.</h1>
            <FieldDescription>
              have an account? <a href="#">Sign In</a>
            </FieldDescription>
          </div>
          <Field>
            <FieldLabel htmlFor="email">Username</FieldLabel>
            <Input
              id="username"
              name="username"
              type="text"
              placeholder="Enter your username"
              required
            />
          </Field>
          <FieldGroup className="flex flex-row">
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Confirm Password</FieldLabel>
              <Input
                id="confirm_password"
                name="confirm_password"
                type="password"
                placeholder="Confirm your password"
                required
              />
            </Field>
          </FieldGroup>
          
          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
          <Field>
            <Button type="submit">Login</Button>
          </Field>
        </FieldGroup>
      </form>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </FieldDescription>
    </div>
  )
}

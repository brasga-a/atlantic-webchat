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
import { auth } from "@/services/auth/auth"

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
        setError(null);
        const formData = new FormData(event.currentTarget);
        const result = await auth.signUp({
          username: formData.get("username") as string,
          email: formData.get("email") as string,
          password: formData.get("password") as string,
          confirm_password: formData.get("confirm_password") as string,
        });
        console.log(formData.get("username"), formData.get("password"), formData.get("confirm_password"))
        if (result.data) {
          window.location.href = "/";
        } else if (result.error) {
          setError(result.error.message);
        }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form
        onSubmit={handleSubmit}
      >
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
           <div className="flex  items-center justify-center rounded-md">
              <span className="text-lg font-bold">atlantic</span>
            </div>
            <h1 className="text-xl font-bold">Welcome to WebChat.</h1>
            <FieldDescription>
              have an account? <a href="/auth/signin">Sign In</a>
            </FieldDescription>
          </div>
          <FieldGroup className="flex-row">
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
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                required
              />
            </Field>
          </FieldGroup>
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
            <Button type="submit">Register</Button>
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

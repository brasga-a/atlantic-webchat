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
import { handleLogin } from "@/app/auth/signin/action"
import { useState } from "react"
import { auth } from "@/services/auth/auth"

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {

  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    const formData = new FormData(event.currentTarget);
    const result = await auth.signIn({
      identifier: formData.get("identifier") as string,
      password: formData.get("password") as string,
    });
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
              Don&apos;t have an account? <a href="/auth/signup">Sign up</a>
            </FieldDescription>
          </div>
          <Field>
            <FieldLabel htmlFor="identifier">Username or Email</FieldLabel>
            <Input
              id="identifier"
              name="identifier"
              type="text"
              placeholder="Enter your username or email"
              required
            />
          </Field>
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

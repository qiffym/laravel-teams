import GuestLayout from "@/layouts/guest-layout"
import { Head, Form } from "@inertiajs/react"
import { Button } from "@/components/ui/button"
import { TextField } from "@/components/ui/text-field"
import { Loader } from "@/components/ui/loader"
import { FieldError, Label } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

interface ResetPasswordProps {
  token: string
  email: string
}

export default function ResetPassword(args: ResetPasswordProps) {
  const { token, email } = args

  return (
    <>
      <Head title="Reset Password" />

      <Form
        className="space-y-6"
        method="post"
        transform={(data) => ({ ...data, token, email })}
        action={route("password.request")}
      >
        {({ processing, errors }) => (
          <>
            <TextField type="email" name="email" autoComplete="username">
              <Label>Email</Label>
              <Input type="email" placeholder="you@domain.com" />
              <FieldError>{errors.email}</FieldError>
            </TextField>

            <TextField name="password" autoComplete="new-password" autoFocus>
              <Label>Password</Label>
              <Input type="password" placeholder="Shhh, it's secret" />
              <FieldError>{errors.password}</FieldError>
            </TextField>

            <TextField name="password_confirmation" autoComplete="new-password" isRequired>
              <Label>Confirm password</Label>
              <Input type="password" />
              <FieldError>{errors.password_confirmation}</FieldError>
            </TextField>

            <div className="mt-4 flex items-center justify-end">
              <Button type="submit" className="ml-4" isPending={processing}>
                {processing && <Loader />}
                Reset Password
              </Button>
            </div>
          </>
        )}
      </Form>
    </>
  )
}

ResetPassword.layout = (page: any) => (
  <GuestLayout
    header="Reset Password"
    description="Please enter your email address and new password to reset your password."
    children={page}
  />
)

import { AuthForm } from "@/components/auth/auth-form";
import { AuthShell } from "@/components/layout/auth-shell";

export const metadata = { title: "Sign up" };

export default function SignupPage() {
  return (
    <AuthShell title="Create your page" subtitle="Email and password. You can claim a username from the dashboard later.">
      <AuthForm
        mode="signup"
        submitLabel="Sign up"
        alternateHref="/login"
        alternateLabel="Already have an account? Log in"
      />
    </AuthShell>
  );
}

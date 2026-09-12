import { AuthForm } from "@/components/auth/auth-form";
import { AuthShell } from "@/components/layout/auth-shell";
import { signInAction } from "@/lib/auth/actions";

export const metadata = { title: "Log in" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const params = await searchParams;

  return (
    <AuthShell title="Welcome back" subtitle="Log in to your Streamly dashboard.">
      <AuthForm
        action={signInAction}
        submitLabel="Log in"
        nextPath={params.next ?? "/dashboard"}
        alternateHref="/signup"
        alternateLabel="Need an account? Sign up"
      />
    </AuthShell>
  );
}

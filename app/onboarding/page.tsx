import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";
import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Creator Onboarding" };

export default async function OnboardingPage() {
  const cookieStore = await cookies();
  const demoCookie = cookieStore.get("streamly_demo_session");
  let demoUser: { email: string; username: string; displayName: string } | null = null;

  if (demoCookie?.value) {
    try {
      demoUser = JSON.parse(demoCookie.value);
    } catch {
      // ignore
    }
  }

  let email = demoUser?.email ?? "creator@domain.com";

  if (isSupabaseConfigured()) {
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        email = user.email ?? email;

        const { data: creator } = await supabase
          .from("creators")
          .select("id")
          .eq("user_id", user.id)
          .maybeSingle();

        if (creator) {
          redirect("/dashboard");
        }
      }
    } catch {
      // fallback
    }
  }

  const defaultDisplayName = email.split("@")[0] ?? "Creator";

  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host") ?? "localhost:3000";
  const proto = headerList.get("x-forwarded-proto") ?? "https";
  const origin = `${proto}://${host}`;

  return (
    <div className="min-h-screen bg-[#09090B] py-12 px-4 flex items-center justify-center font-sans">
      <OnboardingWizard defaultDisplayName={defaultDisplayName} origin={origin} />
    </div>
  );
}

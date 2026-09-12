import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";
import { isSupabaseConfigured } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export const metadata = { title: "Creator Onboarding" };

export default async function OnboardingPage() {
  if (!isSupabaseConfigured()) {
    redirect("/login");
  }

  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    redirect("/login");
  }

  const userId = user.id;
  const email = user.email ?? "";
  const defaultDisplayName = email.split("@")[0] ?? "Creator";

  // Check if creator record already exists
  const { data: creator } = await supabase
    .from("creators")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();

  if (creator) {
    redirect("/dashboard");
  }

  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host") ?? "localhost:3000";
  const proto = headerList.get("x-forwarded-proto") ?? "http";
  const origin = `${proto}://${host}`;

  return (
    <div className="min-h-screen bg-[#09090B] py-12 px-4 flex items-center justify-center">
      <OnboardingWizard defaultDisplayName={defaultDisplayName} origin={origin} />
    </div>
  );
}

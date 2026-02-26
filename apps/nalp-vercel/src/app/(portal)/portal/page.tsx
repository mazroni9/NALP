import { redirect } from "next/navigation";

// TODO: Add real Auth check later (Keycloak / NextAuth / custom)
// For now, redirect to dashboard
export default function PortalPage() {
  redirect("/portal/dashboard");
}

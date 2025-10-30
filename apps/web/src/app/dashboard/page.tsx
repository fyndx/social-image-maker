import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import Dashboard from "./dashboard";

export default async function DashboardPage() {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (!session.data) {
    redirect("/login");
  }

  const { data: customerState, error: _error } = await authClient.customer.state({
    fetchOptions: {
      headers: await headers(),
    },
  });

  return <Dashboard customerState={customerState} session={session.data} />;
}

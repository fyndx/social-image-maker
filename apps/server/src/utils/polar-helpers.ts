import type { CustomerState } from "@polar-sh/sdk/models/components/customerstate.js";

export function hasActiveSubscription(customerState: CustomerState) {
  return customerState.activeSubscriptions?.some(
    (sub) => sub.status === "active"
  );
}

export function hasMeterBalance(customerState: CustomerState) {
  return customerState.activeMeters?.some((meter) => meter.balance > 0);
}

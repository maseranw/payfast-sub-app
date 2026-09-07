export type SubscriptionStatus = "pending" | "active" | "paused" | "cancelled";

export interface StatusBadgeConfig {
  label: string;
  colorClassName: string;
}

const ACTIVE_STATUS_BADGE_COLOR = "text-green-600 dark:text-green-400";
const INACTIVE_STATUS_BADGE_COLOR = "text-red-600 dark:text-red-400";

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function getStatusBadgeConfig(status: string): StatusBadgeConfig {
  return {
    label: capitalize(status),
    colorClassName:
      status === "active" ? ACTIVE_STATUS_BADGE_COLOR : INACTIVE_STATUS_BADGE_COLOR,
  };
}

export function canPause(status: string): boolean {
  return status === "active";
}

export function canResume(status: string): boolean {
  return status === "paused";
}

export function canCancel(status: string): boolean {
  return status === "active" || status === "paused";
}

import type { Status, Severity, IssueType } from '../../types';
import {
  STATUS_COLORS,
  SEVERITY_COLORS,
  ISSUE_TYPE_COLORS,
  STATUSES,
  SEVERITIES,
  ISSUE_TYPES,
} from '../../data/constants';

interface StatusBadgeProps {
  status: Status;
}

interface SeverityBadgeProps {
  severity: Severity;
}

interface TypeBadgeProps {
  type: IssueType;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const label = STATUSES.find((s) => s.value === status)?.label || status;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[status]}`}
    >
      {label}
    </span>
  );
}

export function SeverityBadge({ severity }: SeverityBadgeProps) {
  const label = SEVERITIES.find((s) => s.value === severity)?.label || severity;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${SEVERITY_COLORS[severity]}`}
    >
      {label}
    </span>
  );
}

export function TypeBadge({ type }: TypeBadgeProps) {
  const label = ISSUE_TYPES.find((t) => t.value === type)?.label || type;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ISSUE_TYPE_COLORS[type]}`}
    >
      {label}
    </span>
  );
}

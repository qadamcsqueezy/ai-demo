import type { IssueType, Severity, Status } from '../types';

export const ISSUE_TYPES: { value: IssueType; label: string }[] = [
  { value: 'pothole', label: 'Pothole' },
  { value: 'broken_streetlight', label: 'Broken Streetlight' },
  { value: 'graffiti', label: 'Graffiti' },
  { value: 'illegal_dumping', label: 'Illegal Dumping' },
  { value: 'damaged_sign', label: 'Damaged Sign' },
  { value: 'other', label: 'Other' },
];

export const SEVERITIES: { value: Severity; label: string }[] = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'critical', label: 'Critical' },
];

export const STATUSES: { value: Status; label: string }[] = [
  { value: 'reported', label: 'Reported' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'closed', label: 'Closed' },
];

export const STATUS_COLORS: Record<Status, string> = {
  reported: 'bg-yellow-100 text-yellow-800',
  in_progress: 'bg-blue-100 text-blue-800',
  resolved: 'bg-green-100 text-green-800',
  closed: 'bg-gray-100 text-gray-800',
};

export const SEVERITY_COLORS: Record<Severity, string> = {
  low: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  critical: 'bg-red-100 text-red-800',
};

export const ISSUE_TYPE_COLORS: Record<IssueType, string> = {
  pothole: 'bg-amber-100 text-amber-800',
  broken_streetlight: 'bg-purple-100 text-purple-800',
  graffiti: 'bg-pink-100 text-pink-800',
  illegal_dumping: 'bg-emerald-100 text-emerald-800',
  damaged_sign: 'bg-cyan-100 text-cyan-800',
  other: 'bg-slate-100 text-slate-800',
};

// Rabat, Morocco coordinates
export const DEFAULT_MAP_CENTER = {
  lat: 34.0209,
  lng: -6.8416,
};

export const DEFAULT_MAP_ZOOM = 13;

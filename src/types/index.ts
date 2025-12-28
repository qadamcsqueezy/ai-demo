export type IssueType =
  | "pothole"
  | "broken_streetlight"
  | "graffiti"
  | "illegal_dumping"
  | "damaged_sign"
  | "other";

export type Severity = "low" | "medium" | "high" | "critical";

export type Status = "reported" | "in_progress" | "resolved" | "closed";

export interface Location {
  lat: number;
  lng: number;
  address?: string;
}

export interface Issue {
  id: string;
  type: IssueType;
  description: string;
  location: Location;
  severity: Severity;
  status: Status;
  reportedAt: string;
}

export type NewIssue = Omit<Issue, 'id' | 'status' | 'reportedAt'>;

import { useNavigate } from 'react-router-dom';
import type { Issue } from '../../types';
import { StatusBadge, SeverityBadge, TypeBadge } from './StatusBadge';

interface IssueCardProps {
  issue: Issue;
}

function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}

export function IssueCard({ issue }: IssueCardProps) {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/issues/${issue.id}`)}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md hover:border-gray-300 transition-all cursor-pointer"
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <span className="text-sm font-mono text-gray-500">{issue.id}</span>
          <div className="mt-1">
            <TypeBadge type={issue.type} />
          </div>
        </div>
        <span className="text-sm text-gray-500">{formatDate(issue.reportedAt)}</span>
      </div>

      <p className="text-gray-700 text-sm mb-3">
        {truncateText(issue.description, 100)}
      </p>

      <div className="flex items-center gap-2">
        <StatusBadge status={issue.status} />
        <SeverityBadge severity={issue.severity} />
      </div>
    </div>
  );
}

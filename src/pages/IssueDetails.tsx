import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Button } from '../components/common/Button';
import { StatusBadge, SeverityBadge, TypeBadge } from '../components/issues/StatusBadge';
import { StaticMap } from '../components/issues/IssueMap';
import { useIssueStore } from '../store/useIssueStore';

function formatDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function IssueDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getIssueById, isLoading, loadIssues, issues } = useIssueStore();

  useEffect(() => {
    if (issues.length === 0) {
      loadIssues();
    }
  }, [issues.length, loadIssues]);

  const issue = id ? getIssueById(id) : undefined;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="Loading..." showBackButton />
        <main className="max-w-2xl mx-auto px-4 py-6">
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-500">Loading issue details...</div>
          </div>
        </main>
      </div>
    );
  }

  if (!issue) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="Issue Not Found" showBackButton />
        <main className="max-w-2xl mx-auto px-4 py-6">
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-16 w-16 mx-auto"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-medium text-gray-600 mb-2">
              Issue not found
            </h2>
            <p className="text-gray-500 mb-4">
              The issue you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate('/issues')}>Back to Issues</Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title={issue.id} showBackButton />

      <main className="max-w-2xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <TypeBadge type={issue.type} />
            <StatusBadge status={issue.status} />
            <SeverityBadge severity={issue.severity} />
          </div>

          {/* Report Date */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Reported</h3>
            <p className="text-gray-900">{formatDate(issue.reportedAt)}</p>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Description</h3>
            <p className="text-gray-900 whitespace-pre-wrap">{issue.description}</p>
          </div>

          {/* Location */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-2">Location</h3>
            <StaticMap location={issue.location} />
          </div>

          {/* Back Button */}
          <div className="pt-4 border-t border-gray-200">
            <Button variant="outline" onClick={() => navigate('/issues')}>
              Back to Issues
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}

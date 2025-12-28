import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Button } from '../components/common/Button';
import { IssueCard } from '../components/issues/IssueCard';
import { useIssueStore } from '../store/useIssueStore';

export function IssuesList() {
  const navigate = useNavigate();
  const { issues, isLoading, loadIssues } = useIssueStore();

  useEffect(() => {
    loadIssues();
  }, [loadIssues]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="City Issue Reporter"
        rightAction={
          <Button onClick={() => navigate('/issues/create')}>
            Report New Issue
          </Button>
        }
      />

      <main className="max-w-4xl mx-auto px-4 py-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-500">Loading issues...</div>
          </div>
        ) : issues.length === 0 ? (
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
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h2 className="text-xl font-medium text-gray-600 mb-2">
              No issues reported yet
            </h2>
            <p className="text-gray-500 mb-4">
              Be the first to report a city issue in your area
            </p>
            <Button onClick={() => navigate('/issues/create')}>
              Report New Issue
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-500">
              {issues.length} issue{issues.length !== 1 ? 's' : ''} reported
            </p>
            {issues.map((issue) => (
              <IssueCard key={issue.id} issue={issue} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

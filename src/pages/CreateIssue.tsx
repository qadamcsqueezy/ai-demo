import { Header } from '../components/layout/Header';
import { IssueForm } from '../components/issues/IssueForm';

export function CreateIssue() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Report New Issue" showBackButton />

      <main className="max-w-2xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <IssueForm />
        </div>
      </main>
    </div>
  );
}

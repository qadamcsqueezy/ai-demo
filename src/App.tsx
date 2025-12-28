import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { IssuesList } from './pages/IssuesList';
import { CreateIssue } from './pages/CreateIssue';
import { IssueDetails } from './pages/IssueDetails';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/issues" replace />} />
        <Route path="/issues" element={<IssuesList />} />
        <Route path="/issues/create" element={<CreateIssue />} />
        <Route path="/issues/:id" element={<IssueDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../common/Button';
import { InteractiveMap } from './IssueMap';
import { ISSUE_TYPES, SEVERITIES } from '../../data/constants';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addIssue } from '../../store/slices/issuesSlice';
import { selectNextIssueId } from '../../store/selectors/issuesSelectors';
import type { IssueType, Severity, Location, NewIssue } from '../../types';

export function IssueForm() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const previewId = useAppSelector(selectNextIssueId);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<{
    type: IssueType | '';
    severity: Severity | '';
    description: string;
    location: Location | null;
  }>({
    type: '',
    severity: '',
    description: '',
    location: null,
  });

  const [errors, setErrors] = useState<{
    type?: string;
    severity?: string;
    description?: string;
    location?: string;
  }>({});

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    if (!formData.type) {
      newErrors.type = 'Please select an issue type';
    }
    if (!formData.severity) {
      newErrors.severity = 'Please select a severity level';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Please provide a description';
    }
    if (!formData.location) {
      newErrors.location = 'Please select a location on the map';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const newIssue: NewIssue = {
        type: formData.type as IssueType,
        severity: formData.severity as Severity,
        description: formData.description.trim(),
        location: formData.location!,
      };

      await dispatch(addIssue(newIssue)).unwrap();
      navigate('/issues');
    } catch (error) {
      console.error('Error creating issue:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Issue ID (Read-only) */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Issue ID
        </label>
        <input
          type="text"
          value={previewId}
          disabled
          className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-500 font-mono"
        />
        <p className="mt-1 text-xs text-gray-500">Auto-generated ID</p>
      </div>

      {/* Issue Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Issue Type <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.type}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, type: e.target.value as IssueType }))
          }
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            errors.type ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">Select an issue type</option>
          {ISSUE_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
        {errors.type && <p className="mt-1 text-sm text-red-500">{errors.type}</p>}
      </div>

      {/* Severity */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Severity <span className="text-red-500">*</span>
        </label>
        <div className="flex flex-wrap gap-3">
          {SEVERITIES.map((severity) => (
            <label
              key={severity.value}
              className={`flex items-center px-4 py-2 border rounded-lg cursor-pointer transition-colors ${
                formData.severity === severity.value
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <input
                type="radio"
                name="severity"
                value={severity.value}
                checked={formData.severity === severity.value}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, severity: e.target.value as Severity }))
                }
                className="sr-only"
              />
              <span className="text-sm font-medium">{severity.label}</span>
            </label>
          ))}
        </div>
        {errors.severity && (
          <p className="mt-1 text-sm text-red-500">{errors.severity}</p>
        )}
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Location <span className="text-red-500">*</span>
        </label>
        <p className="text-sm text-gray-500 mb-2">
          Click on the map to select the issue location
        </p>
        <InteractiveMap
          onLocationSelect={(location) =>
            setFormData((prev) => ({ ...prev, location }))
          }
          selectedLocation={formData.location}
        />
        {errors.location && (
          <p className="mt-1 text-sm text-red-500">{errors.location}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }
          placeholder="Describe the issue..."
          rows={4}
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
            errors.description ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-500">{errors.description}</p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Reporting...' : 'Report Issue'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => navigate('/issues')}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}

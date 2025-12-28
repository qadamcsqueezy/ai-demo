import type { Issue } from '../types';

export function getInitialMockData(): Issue[] {
  const now = new Date();

  return [
    {
      id: 'ISS-2024-001',
      type: 'pothole',
      description: 'Large pothole in the middle of the road causing traffic issues. Several cars have been damaged trying to avoid it.',
      location: {
        lat: 34.0209,
        lng: -6.8416,
        address: 'Avenue Mohammed V, Rabat',
      },
      severity: 'high',
      status: 'reported',
      reportedAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'ISS-2024-002',
      type: 'broken_streetlight',
      description: 'Streetlight has been flickering for weeks and now completely stopped working. The area is very dark at night.',
      location: {
        lat: 34.0150,
        lng: -6.8350,
        address: 'Rue Oukaimeden, Agdal',
      },
      severity: 'medium',
      status: 'in_progress',
      reportedAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'ISS-2024-003',
      type: 'graffiti',
      description: 'Offensive graffiti on the wall of the public library. Needs immediate removal.',
      location: {
        lat: 34.0250,
        lng: -6.8450,
        address: 'Place Pietri, Hassan',
      },
      severity: 'low',
      status: 'resolved',
      reportedAt: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'ISS-2024-004',
      type: 'illegal_dumping',
      description: 'Large pile of construction debris dumped illegally near the park. Creating health hazard.',
      location: {
        lat: 34.0180,
        lng: -6.8500,
        address: 'Avenue Al Marsa, Les Orangers',
      },
      severity: 'critical',
      status: 'reported',
      reportedAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'ISS-2024-005',
      type: 'damaged_sign',
      description: 'Stop sign knocked down by a vehicle. Currently lying on the sidewalk.',
      location: {
        lat: 34.0300,
        lng: -6.8380,
        address: 'Boulevard Hassan II, Centre Ville',
      },
      severity: 'high',
      status: 'reported',
      reportedAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];
}

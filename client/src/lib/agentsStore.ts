// ══════════════════════════════════════════════════════════════════════════════
// FAIR DEAL PROPERTIES LTD - TEST USER AGENTS & ROSTER STORE
// ══════════════════════════════════════════════════════════════════════════════

export interface AgentUser {
  id: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'AGENT';
  phone?: string;
  active: boolean;
  createdAt: string;
  _count?: {
    assignedInspections: number;
    assignedListings: number;
  };
}

let testAgents: AgentUser[] = [
  {
    id: 'admin-fallback-01',
    name: 'FDP Principal Admin',
    email: 'admin@fdealproperties.com',
    role: 'SUPER_ADMIN',
    phone: '+2349049924198',
    active: true,
    createdAt: '2026-01-10T08:00:00Z',
    _count: { assignedInspections: 1, assignedListings: 4 },
  },
  {
    id: 'agent-fallback-01',
    name: 'Emeka Nwosu (Senior Surveyor)',
    email: 'emeka.agent@fdealproperties.com',
    role: 'AGENT',
    phone: '+2348031234567',
    active: true,
    createdAt: '2026-01-15T09:30:00Z',
    _count: { assignedInspections: 2, assignedListings: 3 },
  },
  {
    id: 'agent-fallback-02',
    name: 'Stephen Alaekwe (Field Surveyor)',
    email: 'agent@fdealproperties.com',
    role: 'AGENT',
    phone: '+2348099887766',
    active: true,
    createdAt: '2026-01-16T10:00:00Z',
    _count: { assignedInspections: 1, assignedListings: 2 },
  },
  {
    id: 'agent-fallback-03',
    name: 'Fatima Al-Hassan (Cadastral & Title Specialist)',
    email: 'fatima.agent@fdealproperties.com',
    role: 'AGENT',
    phone: '+2348023456789',
    active: true,
    createdAt: '2026-02-01T11:15:00Z',
    _count: { assignedInspections: 3, assignedListings: 5 },
  },
  {
    id: 'agent-fallback-04',
    name: 'Babajide Adeleke (Structural Engineer & Valuer)',
    email: 'babajide.agent@fdealproperties.com',
    role: 'AGENT',
    phone: '+2348056789012',
    active: true,
    createdAt: '2026-02-10T14:20:00Z',
    _count: { assignedInspections: 2, assignedListings: 4 },
  },
  {
    id: 'agent-fallback-05',
    name: 'Chiamaka Okafor (Diaspora Client Liaison)',
    email: 'chiamaka.agent@fdealproperties.com',
    role: 'AGENT',
    phone: '+2348078901234',
    active: true,
    createdAt: '2026-02-18T16:45:00Z',
    _count: { assignedInspections: 4, assignedListings: 4 },
  },
  {
    id: 'agent-fallback-06',
    name: 'Tarila Briggs (Commercial & Energy Asset Surveyor)',
    email: 'tarila.agent@fdealproperties.com',
    role: 'AGENT',
    phone: '+2348090123456',
    active: true,
    createdAt: '2026-03-01T12:00:00Z',
    _count: { assignedInspections: 1, assignedListings: 3 },
  },
];

export function getTestAgents(): AgentUser[] {
  return [...testAgents];
}

export function getTestAgentByEmail(email: string): AgentUser | null {
  const norm = email.toLowerCase().trim();
  return testAgents.find((a) => a.email.toLowerCase() === norm) || null;
}

export function updateTestAgentStatus(idOrEmail: string, active: boolean): AgentUser | null {
  const norm = idOrEmail.toLowerCase().trim();
  const agent = testAgents.find((a) => a.id.toLowerCase() === norm || a.email.toLowerCase() === norm);
  if (agent) {
    agent.active = active;
    return { ...agent };
  }
  return null;
}

export function addTestAgent(newAgent: Partial<AgentUser>): AgentUser {
  const agent: AgentUser = {
    id: newAgent.id || `agent-user-${Date.now().toString(36)}`,
    name: newAgent.name || 'Field Officer',
    email: newAgent.email || `officer-${Date.now().toString(36)}@fdealproperties.com`,
    role: (newAgent.role as any) || 'AGENT',
    phone: newAgent.phone || '+2348000000000',
    active: true,
    createdAt: new Date().toISOString(),
    _count: { assignedInspections: 0, assignedListings: 0 },
  };
  testAgents.push(agent);
  return agent;
}

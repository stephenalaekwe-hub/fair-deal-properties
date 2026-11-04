// ══════════════════════════════════════════════════════════════════════════════
// FAIR DEAL PROPERTIES LTD - PERSISTENT TEST USER AGENTS & ROSTER STORE
// ══════════════════════════════════════════════════════════════════════════════

import fs from 'node:fs';
import path from 'node:path';

export interface AgentUser {
  id: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'AGENT';
  phone?: string;
  password?: string;
  active: boolean;
  createdAt: string;
  _count?: {
    assignedInspections: number;
    assignedListings: number;
  };
}

export const INITIAL_TEST_AGENTS: AgentUser[] = [
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
    name: 'Emeka Okonkwo (Senior Surveyor)',
    email: 'emeka.agent@fdealproperties.com',
    role: 'AGENT',
    phone: '+2348031234567',
    active: true,
    createdAt: '2026-01-15T09:30:00Z',
    _count: { assignedInspections: 2, assignedListings: 3 },
  },
  {
    id: 'agent-fallback-02',
    name: 'Aisha Bello (Field Surveyor)',
    email: 'aisha.agent@fdealproperties.com',
    role: 'AGENT',
    phone: '+2348098765432',
    active: true,
    createdAt: '2026-01-16T10:00:00Z',
    _count: { assignedInspections: 2, assignedListings: 2 },
  },
  {
    id: 'agent-ismail-kewa',
    name: 'Ismail Kewa (Field Agent & Surveyor)',
    email: 'ismail.kewa@fdealproperties.com',
    role: 'AGENT',
    phone: '+2348092872837',
    active: true,
    createdAt: '2026-01-20T11:00:00Z',
    _count: { assignedInspections: 1, assignedListings: 2 },
  },
];

let inMemoryCache: AgentUser[] | null = null;

function getStoreFilePaths(): string[] {
  const cwd = process.cwd();
  return [
    path.join(cwd, 'src', 'data', 'agents.json'),
    path.join(cwd, 'client', 'src', 'data', 'agents.json'),
    path.join(cwd, '.fdp-data', 'agents.json'),
    path.join(cwd, 'client', '.fdp-data', 'agents.json'),
  ];
}

function loadAgentsFromDisk(): AgentUser[] {
  const filePaths = getStoreFilePaths();
  let loadedAgents: AgentUser[] | null = null;

  for (const fp of filePaths) {
    try {
      if (fs.existsSync(/* turbopackIgnore: true */ fp)) {
        const raw = fs.readFileSync(/* turbopackIgnore: true */ fp, 'utf-8');
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          loadedAgents = parsed;
          break;
        }
      }
    } catch {
      // Continue to next path
    }
  }

  const agents: AgentUser[] = loadedAgents && loadedAgents.length > 0 ? [...loadedAgents] : [...INITIAL_TEST_AGENTS];

  // Guarantee that the 4 essential accounts are ALWAYS present
  for (const initial of INITIAL_TEST_AGENTS) {
    const exists = agents.some((a) => a.email.toLowerCase() === initial.email.toLowerCase() || a.id === initial.id);
    if (!exists) {
      agents.push({ ...initial });
    }
  }

  inMemoryCache = agents;
  return agents;
}

function saveAgentsToDisk(agents: AgentUser[]): void {
  inMemoryCache = [...agents];
  const filePaths = getStoreFilePaths();
  const serialized = JSON.stringify(agents, null, 2);

  for (const fp of filePaths) {
    try {
      const dir = path.dirname(fp);
      if (!fs.existsSync(/* turbopackIgnore: true */ dir)) {
        fs.mkdirSync(/* turbopackIgnore: true */ dir, { recursive: true });
      }
      fs.writeFileSync(/* turbopackIgnore: true */ fp, serialized, 'utf-8');
    } catch {
      // Non-fatal, try next path
    }
  }
}

export function getTestAgents(): AgentUser[] {
  if (!inMemoryCache) {
    return loadAgentsFromDisk();
  }
  return [...inMemoryCache];
}

export function getTestAgentByEmail(email: string): AgentUser | null {
  const norm = email.toLowerCase().trim();
  const agents = getTestAgents();
  const direct = agents.find((a) => a.email.toLowerCase() === norm);
  if (direct) return direct;

  // Friendly alias matching for Ismail Kewa
  if (
    norm === 'i.kewa@alustudent.com' ||
    norm === 'ismail@fdealproperties.com' ||
    norm === 'ismailkewa@gmail.com' ||
    norm === 'ismail.kewa@gmail.com'
  ) {
    return agents.find((a) => a.id === 'agent-ismail-kewa' || a.email.toLowerCase() === 'ismail.kewa@fdealproperties.com') || null;
  }

  // Aliases for Aisha & Emeka
  if (norm === 'aisha@fdealproperties.com') {
    return agents.find((a) => a.email.toLowerCase() === 'aisha.agent@fdealproperties.com') || null;
  }
  if (norm === 'emeka@fdealproperties.com') {
    return agents.find((a) => a.email.toLowerCase() === 'emeka.agent@fdealproperties.com') || null;
  }

  return null;
}

export function updateTestAgentStatus(idOrEmail: string, active: boolean): AgentUser | null {
  const norm = idOrEmail.toLowerCase().trim();
  const agents = getTestAgents();
  const agent = agents.find((a) => a.id.toLowerCase() === norm || a.email.toLowerCase() === norm);
  if (agent) {
    agent.active = active;
    saveAgentsToDisk(agents);
    return { ...agent };
  }
  return null;
}

export function addTestAgent(newAgent: Partial<AgentUser>): AgentUser {
  const agents = getTestAgents();
  const existing = agents.find(
    (a) => a.email.toLowerCase() === (newAgent.email || '').toLowerCase().trim()
  );

  if (existing) {
    existing.name = newAgent.name || existing.name;
    existing.phone = newAgent.phone || existing.phone;
    existing.role = (newAgent.role as any) || existing.role;
    existing.active = true;
    if (newAgent.password) existing.password = newAgent.password;
    saveAgentsToDisk(agents);
    return existing;
  }

  const agent: AgentUser = {
    id: newAgent.id || `agent-user-${Date.now().toString(36)}`,
    name: newAgent.name || 'Field Officer',
    email: newAgent.email || `officer-${Date.now().toString(36)}@fdealproperties.com`,
    role: (newAgent.role as any) || 'AGENT',
    phone: newAgent.phone || '+2348000000000',
    password: newAgent.password,
    active: true,
    createdAt: new Date().toISOString(),
    _count: { assignedInspections: 0, assignedListings: 0 },
  };

  agents.push(agent);
  saveAgentsToDisk(agents);
  return agent;
}

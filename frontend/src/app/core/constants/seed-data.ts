import { AppUser } from '../../models/user.model';

export const SEED_USERS: AppUser[] = [
  {
    id: 'USR-1001',
    name: 'Aarav Mehta',
    email: 'aarav.mehta@mploychek.io',
    department: 'Engineering',
    role: 'admin',
    status: 'active',
    lastLogin: '2026-05-26 09:42',
    createdAt: '2026-01-14'
  },
  {
    id: 'USR-1002',
    name: 'Priya Nair',
    email: 'priya.nair@mploychek.io',
    department: 'Finance',
    role: 'user',
    status: 'active',
    lastLogin: '2026-05-25 18:18',
    createdAt: '2026-02-03'
  },
  {
    id: 'USR-1003',
    name: 'Kabir Sharma',
    email: 'kabir.sharma@mploychek.io',
    department: 'Operations',
    role: 'user',
    status: 'pending',
    lastLogin: '2026-05-23 12:10',
    createdAt: '2026-03-19'
  },
  {
    id: 'USR-1004',
    name: 'Nisha Rao',
    email: 'nisha.rao@mploychek.io',
    department: 'Human Resources',
    role: 'admin',
    status: 'active',
    lastLogin: '2026-05-26 08:05',
    createdAt: '2026-01-28'
  },
  {
    id: 'USR-1005',
    name: 'Dev Malhotra',
    email: 'dev.malhotra@mploychek.io',
    department: 'Security',
    role: 'user',
    status: 'suspended',
    lastLogin: '2026-05-12 16:24',
    createdAt: '2026-04-01'
  },
  {
    id: 'USR-1006',
    name: 'Sara Thomas',
    email: 'sara.thomas@mploychek.io',
    department: 'Legal',
    role: 'user',
    status: 'pending',
    lastLogin: '2026-05-24 10:57',
    createdAt: '2026-04-17'
  }
];

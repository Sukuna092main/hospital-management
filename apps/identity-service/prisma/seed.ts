/// <reference types="node" />
import { prisma } from '../src/lib/prisma.js';

const ROLES = ['PATIENT', 'DOCTOR', 'NURSE', 'PHARMACIST', 'ADMIN'];

async function main() {
  for (const name of ROLES) {
    await prisma.role.upsert({ where: { name }, update: {}, create: { name } });
  }
  console.log('Seeded roles:', ROLES.join(', '));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
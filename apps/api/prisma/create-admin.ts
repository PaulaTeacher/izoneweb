/**
 * Crea (o actualiza) un AdminUser para el futuro panel.
 *
 * Uso:
 *   pnpm --filter api db:create-admin -- admin@izone.co 'TuPasswordSegura' SUPERADMIN "Paula"
 */
import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const SALT_ROUNDS = 12;

async function main() {
  const args = process.argv.slice(2).filter((a) => a !== '--');
  const [email, password, roleArg, name] = args;

  if (!email || !password) {
    console.error(
      "Uso: pnpm --filter api db:create-admin -- email password [SUPERADMIN|ADMIN_INVENTARIO|EDITOR] [nombre]",
    );
    process.exit(1);
  }

  const role = (roleArg as Role) || Role.SUPERADMIN;
  if (!Object.values(Role).includes(role)) {
    throw new Error(`Rol inválido: ${roleArg}`);
  }

  const hashed = await bcrypt.hash(password, SALT_ROUNDS);
  const admin = await prisma.adminUser.upsert({
    where: { email },
    update: { password: hashed, role, name: name || undefined, isActive: true },
    create: { email, password: hashed, role, name: name || null, isActive: true },
    select: { id: true, email: true, role: true, name: true },
  });

  console.log('✅ Admin listo:', admin);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => prisma.$disconnect());

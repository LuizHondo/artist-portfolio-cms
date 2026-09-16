import { execSync } from 'child_process';
import { existsSync, unlinkSync } from 'fs';

export default async function globalSetup() {
  const dbPath = 'prisma/test.db';
  if (existsSync(dbPath)) unlinkSync(dbPath);

  execSync('npx prisma migrate deploy', {
    env: { ...process.env, DATABASE_URL: 'file:./test.db' },
    cwd: 'prisma',
    stdio: 'inherit',
  });
}

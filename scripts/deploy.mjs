import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const rootDir = process.cwd();
const distDir = path.join(rootDir, 'dist');

if (!fs.existsSync(path.join(distDir, 'index.html'))) {
  console.error('Error: dist/index.html not found. Run "npm run build" first.');
  process.exit(1);
}

function runGit(args, cwd = rootDir) {
  return execFileSync('git', args, {
    cwd,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
}

const remoteUrl = runGit(['remote', 'get-url', 'origin']);
const commitSha = runGit(['rev-parse', '--short', 'HEAD']);
const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'minigame-gh-pages-'));

try {
  fs.cpSync(distDir, tmpDir, { recursive: true });
  fs.writeFileSync(path.join(tmpDir, '.nojekyll'), '');

  runGit(['init', '-b', 'gh-pages'], tmpDir);
  runGit(['add', '-A'], tmpDir);
  runGit(
    ['commit', '-m', `deploy: publish build from ${commitSha} (${new Date().toISOString()})`],
    tmpDir,
  );

  const pushArgs = [];
  if (remoteUrl.startsWith('https://github.com/')) {
    try {
      execFileSync('gh', ['auth', 'status'], { stdio: 'ignore' });
      pushArgs.push('-c', 'credential.helper=', '-c', 'credential.helper=!gh auth git-credential');
    } catch {
      // Fallback to default git credential helper
    }
  }
  pushArgs.push('push', '--force', remoteUrl, 'gh-pages:gh-pages');

  execFileSync('git', pushArgs, {
    cwd: tmpDir,
    stdio: 'inherit',
  });

  console.log('\nDeployed dist/ to branch "gh-pages" successfully.');
} finally {
  fs.rmSync(tmpDir, { recursive: true, force: true });
}

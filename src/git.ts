import child_process from 'node:child_process';
import type { MainOptions } from './main.js';
import { runCommand } from './spawn.js';

export async function getCurrentBranch(): Promise<string> {
  const currentBranchResult = await runCommand('git', ['branch', '--show-current']);
  return currentBranchResult.stdout.trim();
}

export async function getBaseBranch(options: MainOptions): Promise<string | undefined> {
  const { stdout: prViewResult } = await runCommand(
    'gh',
    ['pr', 'view', options.issueNumber.toString(), '--json', 'headRefName'],
    { ignoreExitStatus: true }
  );
  try {
    if (prViewResult) {
      const prData = JSON.parse(prViewResult);
      return prData.headRefName;
    }
  } catch {
    // Not a PR or error parsing
  }
}

export function getGitRepoName(): string {
  const repoUrlResult = child_process.spawnSync('git', ['remote', 'get-url', 'origin'], {
    encoding: 'utf8',
    stdio: 'pipe',
  });
  const repoUrl = repoUrlResult.stdout.trim();
  const repoMatch = repoUrl.match(/github\.com[/:]([\w-]+\/[\w-]+)(\.git)?$/);
  return repoMatch ? repoMatch[1] : '';
}

export function getHeaderOfFirstCommit(baseBranch: string): string {
  const firstCommitResult = child_process.spawnSync('git', ['log', `${baseBranch}..HEAD`, '--reverse', '--pretty=%s'], {
    encoding: 'utf8',
    stdio: 'pipe',
  });
  return firstCommitResult.stdout.trim().split('\n')[0];
}

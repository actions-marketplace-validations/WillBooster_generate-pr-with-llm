import { runCommand } from './spawn.js';

export async function configureGitUserDetailsIfNeeded(): Promise<void> {
  const gitUserName = (await runCommand('git', ['config', 'user.name'], { ignoreExitStatus: true })).stdout.trim();
  const gitUserEmail = (await runCommand('git', ['config', 'user.email'], { ignoreExitStatus: true })).stdout.trim();
  if (!gitUserName || !gitUserEmail) {
    const githubUserInfoJson = (await runCommand('gh', ['api', 'user'], { ignoreExitStatus: true })).stdout.trim();
    try {
      const { name, email } = JSON.parse(githubUserInfoJson);
      if (name) {
        await runCommand('git', ['config', 'user.name', name]);
      }
      if (email) {
        await runCommand('git', ['config', 'user.email', email]);
      }
    } catch {}
  }
}

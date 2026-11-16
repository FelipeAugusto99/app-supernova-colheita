const { execSync } = require('child_process');

// Hash do commit que gerou o build, exibido na tela "Sobre o App".
// No EAS Build vem da variavel EAS_BUILD_GIT_COMMIT_HASH; localmente, do proprio git.
function hashDoCommit() {
  if (process.env.EAS_BUILD_GIT_COMMIT_HASH) {
    return process.env.EAS_BUILD_GIT_COMMIT_HASH.slice(0, 7);
  }
  try {
    return execSync('git rev-parse --short HEAD', { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim();
  } catch {
    return 'sem-git';
  }
}

module.exports = ({ config }) => ({
  ...config,
  extra: {
    ...config.extra,
    commitHash: hashDoCommit(),
    dataBuild: new Date().toISOString().slice(0, 10),
  },
});

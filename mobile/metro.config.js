const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '..');

const config = getDefaultConfig(projectRoot);

// Watch the shared content directory at the repo root
config.watchFolders = [path.resolve(monorepoRoot, 'content')];

// Resolve @content/* imports to ../content/*
config.resolver.extraNodeModules = {
    ...config.resolver.extraNodeModules,
    '@content': path.resolve(monorepoRoot, 'content'),
};

module.exports = config;

const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// SVG Support
config.transformer.babelTransformerPath = require.resolve(
  'react-native-svg-transformer'
);

// Treat SVG as source instead of an asset
config.resolver.assetExts = config.resolver.assetExts.filter(
  ext => ext !== 'svg'
);

config.resolver.sourceExts.push('svg');

// Keep your existing asset extensions
config.resolver.assetExts.push(
  'db',
  'mp4',
  'mp3',
  'zip',
  'exe',
  'bin'
);

module.exports = config;
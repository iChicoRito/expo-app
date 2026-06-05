const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Render `.svg` files as React components via react-native-svg-transformer
// (used by the avatar registry in constants/avatars.ts).
config.transformer.babelTransformerPath = require.resolve(
  'react-native-svg-transformer/expo',
);
config.resolver.assetExts = config.resolver.assetExts.filter(
  (ext) => ext !== 'svg',
);
config.resolver.sourceExts = [...config.resolver.sourceExts, 'svg'];

module.exports = config;

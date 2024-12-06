module.exports = function (api) {
  api.cache(true)
  return {
    presets: ['babel-preset-expo'],
    //plugins: ['nativewind/babel'] // Add this line to include nativewind
  }
}

// module.exports = function (api) {
//   api.cache(true);
//   return {
//     presets: [
//       ['babel-preset-expo', { jsxImportSource: 'nativewind' }]
//     ],
//     plugins: ['react-native-reanimated/plugin'],
//   };
// };

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      // "expo-router/babel", // Required for expo-router functionality
      "nativewind/babel"   // Optional: For Tailwind CSS if used
    ],
  };
};

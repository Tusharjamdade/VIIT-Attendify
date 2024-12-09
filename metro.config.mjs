import { getDefaultConfig } from "@expo/metro-config";

const config = getDefaultConfig(__dirname);

config.resolver.sourceExts = [...config.resolver.sourceExts, "cjs", "mjs"];

export default config;

import * as Network from "expo-network";

/**
 * Proactive connectivity check used before an AI request so we can show the
 * "No Internet Connection" dialog instead of waiting for a fetch to fail.
 *
 * `isInternetReachable` can be `undefined` on some platforms/states; we only
 * treat an explicit `false` as offline to avoid false negatives.
 */
export async function isOnline(): Promise<boolean> {
  try {
    const state = await Network.getNetworkStateAsync();
    if (state.isConnected === false) return false;
    if (state.isInternetReachable === false) return false;
    return true;
  } catch {
    // If we can't determine state, assume online and let the request surface
    // any real failure.
    return true;
  }
}

// Utility function to handle asset paths with base path
export function getAssetPath(path: string): string {
  const basePath = process.env.BASE_PATH || '';
  // Remove leading slash from path if present to avoid double slashes
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return basePath ? `${basePath}/${cleanPath}` : `/${cleanPath}`;
}
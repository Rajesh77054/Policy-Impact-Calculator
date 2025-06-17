// Image loading utility with fallback and error handling
export const getImagePath = (path: string): string => {
  // Handle URL encoding for paths with spaces
  if (path.includes(' ')) {
    return path.replace(/ /g, '%20');
  }
  return path;
};

export const testImageLoad = async (path: string): Promise<boolean> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = getImagePath(path);
  });
};

export const preloadImage = async (path: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to load image: ${path}`));
    img.src = getImagePath(path);
  });
};
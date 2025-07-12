interface PreloadOptions {
  priority?: boolean;
  sizes?: string;
  fetchPriority?: 'high' | 'low' | 'auto';
}

class ImagePreloadService {
  private preloadedImages = new Set<string>();
  private pendingPreloads = new Map<string, Promise<void>>();

  preloadImage(url: string, options: PreloadOptions = {}): Promise<void> {
    if (typeof window === 'undefined') {
      return Promise.resolve();
    }

    // Return existing promise if already preloading
    if (this.pendingPreloads.has(url)) {
      return this.pendingPreloads.get(url)!;
    }

    // Skip if already preloaded
    if (this.preloadedImages.has(url)) {
      return Promise.resolve();
    }

    const promise = new Promise<void>((resolve, reject) => {
      // Check if link preload already exists
      const existingLink = document.querySelector(`link[rel="preload"][href="${url}"]`);
      if (existingLink) {
        this.preloadedImages.add(url);
        resolve();
        return;
      }

      // Create link preload
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = url;

      if (options.sizes) {
        link.setAttribute('imagesizes', options.sizes);
      }

      if (options.fetchPriority) {
        link.setAttribute('fetchpriority', options.fetchPriority);
      }

      link.onload = () => {
        this.preloadedImages.add(url);
        this.pendingPreloads.delete(url);
        resolve();
      };

      link.onerror = () => {
        this.pendingPreloads.delete(url);
        reject(new Error(`Failed to preload image: ${url}`));
      };

      document.head.appendChild(link);
    });

    this.pendingPreloads.set(url, promise);
    return promise;
  }

  preloadCriticalImages(images: Array<{ url: string; sizes?: string }>): Promise<void> {
    return Promise.allSettled(
      images.map((img) =>
        this.preloadImage(img.url, {
          priority: true,
          sizes: img.sizes,
          fetchPriority: 'high',
        }),
      ),
    ).then(() => undefined);
  }
}

// Create singleton instance
const imagePreloadService = new ImagePreloadService();

export default imagePreloadService;

// Export convenience function (only the one being used)
export const preloadCriticalImages = (images: Array<{ url: string; sizes?: string }>) =>
  imagePreloadService.preloadCriticalImages(images);

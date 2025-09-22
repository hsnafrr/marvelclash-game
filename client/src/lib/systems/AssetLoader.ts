/**
 * Asset Loader with preloading and compression support
 */
export class AssetLoader {
  private static loadedTextures: Map<string, any> = new Map();
  private static loadedModels: Map<string, any> = new Map();
  private static loadedAudio: Map<string, HTMLAudioElement> = new Map();
  private static loadingPromises: Map<string, Promise<any>> = new Map();

  static async preloadAssets(): Promise<void> {
    console.log("Starting asset preloading...");
    
    const assetLists = {
      textures: [
        '/textures/grass.png',
        '/textures/asphalt.png',
        '/textures/wood.jpg',
        '/textures/sand.jpg',
        '/textures/sky.png'
      ],
      audio: [
        '/sounds/background.mp3',
        '/sounds/hit.mp3',
        '/sounds/success.mp3'
      ],
      models: [
        '/geometries/heart.gltf'
      ]
    };

    const loadPromises: Promise<void>[] = [];

    // Preload textures
    assetLists.textures.forEach(url => {
      loadPromises.push(this.preloadTexture(url));
    });

    // Preload audio
    assetLists.audio.forEach(url => {
      loadPromises.push(this.preloadAudio(url));
    });

    // Preload models
    assetLists.models.forEach(url => {
      loadPromises.push(this.preloadModel(url));
    });

    try {
      await Promise.allSettled(loadPromises);
      console.log("Asset preloading completed");
    } catch (error) {
      console.error("Some assets failed to preload:", error);
    }
  }

  private static async preloadTexture(url: string): Promise<void> {
    if (this.loadedTextures.has(url)) {
      return Promise.resolve();
    }

    if (this.loadingPromises.has(url)) {
      return this.loadingPromises.get(url);
    }

    const promise = new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        // Create a compressed version if possible
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          if (ctx) {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            
            // Store both original and canvas for flexibility
            this.loadedTextures.set(url, {
              image: img,
              canvas: canvas,
              width: img.width,
              height: img.height
            });
          } else {
            this.loadedTextures.set(url, { image: img });
          }
        } catch (error) {
          this.loadedTextures.set(url, { image: img });
        }
        
        console.log(`Preloaded texture: ${url}`);
        resolve();
      };
      
      img.onerror = () => {
        console.warn(`Failed to preload texture: ${url}`);
        reject(new Error(`Failed to load texture: ${url}`));
      };
      
      img.src = url;
    });

    this.loadingPromises.set(url, promise);
    return promise;
  }

  private static async preloadAudio(url: string): Promise<void> {
    if (this.loadedAudio.has(url)) {
      return Promise.resolve();
    }

    if (this.loadingPromises.has(url)) {
      return this.loadingPromises.get(url);
    }

    const promise = new Promise<void>((resolve, reject) => {
      const audio = new Audio();
      audio.preload = 'auto';
      
      audio.addEventListener('canplaythrough', () => {
        this.loadedAudio.set(url, audio);
        console.log(`Preloaded audio: ${url}`);
        resolve();
      });
      
      audio.addEventListener('error', () => {
        console.warn(`Failed to preload audio: ${url}`);
        reject(new Error(`Failed to load audio: ${url}`));
      });
      
      audio.src = url;
      audio.load();
    });

    this.loadingPromises.set(url, promise);
    return promise;
  }

  private static async preloadModel(url: string): Promise<void> {
    if (this.loadedModels.has(url)) {
      return Promise.resolve();
    }

    if (this.loadingPromises.has(url)) {
      return this.loadingPromises.get(url);
    }

    const promise = new Promise<void>((resolve, reject) => {
      fetch(url)
        .then(response => response.arrayBuffer())
        .then(buffer => {
          this.loadedModels.set(url, buffer);
          console.log(`Preloaded model: ${url}`);
          resolve();
        })
        .catch(error => {
          console.warn(`Failed to preload model: ${url}`, error);
          reject(error);
        });
    });

    this.loadingPromises.set(url, promise);
    return promise;
  }

  static getTexture(url: string): any {
    return this.loadedTextures.get(url);
  }

  static getAudio(url: string): HTMLAudioElement | undefined {
    return this.loadedAudio.get(url);
  }

  static getModel(url: string): ArrayBuffer | undefined {
    return this.loadedModels.get(url);
  }

  static getLoadingStats() {
    return {
      texturesLoaded: this.loadedTextures.size,
      audioLoaded: this.loadedAudio.size,
      modelsLoaded: this.loadedModels.size,
      pendingLoads: this.loadingPromises.size
    };
  }

  static clearCache(): void {
    this.loadedTextures.clear();
    this.loadedAudio.clear();
    this.loadedModels.clear();
    this.loadingPromises.clear();
    console.log("Asset cache cleared");
  }
}

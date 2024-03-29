import PluginService from "./PluginService";
import { EAspectRatio } from "../ts/types";

interface IImageDetails {
  src: string;
  node: HTMLImageElement;
  aspect: EAspectRatio;
  isLoaded: boolean; // New property to track the loaded status
  onLoad?: (event: Event) => void;
  onError?: (event: ErrorEvent) => void;
}

type TRestrictedImageDetails = Omit<IImageDetails, "node" | "isLoaded">;

class ImageService extends PluginService {
  private _images: IImageDetails[]; // Assuming you'll always initialize with an array
  private _defaultAspectRatio = EAspectRatio.Square;

  constructor(images: TRestrictedImageDetails[]) {
    super();

    this.extendImageDetails(images);
  }

  private loadImage(imageDetails: IImageDetails): void {
    const { src, onLoad, onError } = imageDetails;

    const img = new Image();
    img.src = src;

    img.onload = (event : Event) => {
      imageDetails.isLoaded = true; // Update the loaded status
      if (onLoad) {
        onLoad(event);
      }
    };

    img.onerror = (event : ErrorEvent) => {
      imageDetails.isLoaded = false; // Update the loaded status on error
      if (onError) {
        onError(event);
      }
    };

    imageDetails.node = img; // Assign the created image to the node property
  }

  isImageLoaded(src: string): boolean {
    const imageDetail = this._images.find((image) => image.src === src);
    return !!imageDetail?.isLoaded;
  }

  getImageDetails(): IImageDetails[] {
    return this._images;
  }

  getImageNodes() : HTMLImageElement[] {
    return this._images.map(image => image.node);
  }

  preloadImages(): void {
    this._images.forEach((image) => this.loadImage(image));
  }

  extendImageDetails(restrictedImageDetails: TRestrictedImageDetails[]) {
    this._images = restrictedImageDetails.map((details) => ({
      ...details,
      isLoaded: false,
      aspect: details.aspect || this._defaultAspectRatio,
      node: null,
    }));
  }

  init(): void {
    this.preloadImages();
  }

  destroy(): void {
    this._images.forEach((image) => image.node.remove()); // Optional: Remove images from DOM
    this._images = []; // Clear the images array
  }
}

export default ImageService;

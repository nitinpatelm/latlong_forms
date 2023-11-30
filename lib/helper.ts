import imageCompression from "browser-image-compression";
const defaultOptions = {
  maxSizeMB: 3,
};
export function compressFile(imageFile: any, options = defaultOptions) {
  return imageCompression(imageFile, options);
}

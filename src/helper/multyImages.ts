import deleteOldFile from "../utilities/deleteFile";


export const syncImages = (
  existingImages: string[],
  currentImages: string[] | string | null | undefined,
  files?: Express.Multer.File[],
  uploadPath: string = "uploads"
) => {

  // normalize kept images
  let keptImages: string[] = [];

  if (currentImages) {
    keptImages = Array.isArray(currentImages) ? currentImages : [currentImages];
  }

  // map new uploaded images
  const newImages =
    files?.map((file) => `${uploadPath}/${file.filename}`) || [];

  // find removed images
  const removedImages = existingImages.filter(
    (img) => !keptImages.includes(img)
  );

  // delete removed images
  removedImages.forEach((img) => {
    deleteOldFile(img);
  });

  // final image list
  const updatedImages = [...keptImages, ...newImages];

  return updatedImages;
};
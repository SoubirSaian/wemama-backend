import multer from "multer";
import { profileStorage } from "../../helper/multer";
import { multerS3Storage } from "../../helper/multerS3";


//multer configuration for local storage

// upload user image
 export const uploadProfile = multer({
   storage: profileStorage,
 
   limits: {
     fileSize: 5 * 1024 * 1024, // 5MB . less than 5mb file allowed
    //  fieldSize: 3 * 1024 *1024
   },
 
   fileFilter: (req, file, cb) => {
    
       if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg" ) {
 
         cb(null, true);
 
       } else {
         cb(new Error("Only .jpg, .png or .jpeg format allowed!"));
       }
     
   },
 });

 // upload post image
 export const uploadPostImage = multer({
   storage: profileStorage,
 
   limits: {
     fileSize: 3145728, // 3MB . less than 3mb file allowed
    //  fieldSize: 3 * 1024 *1024
   },
 
   fileFilter: (req, file, cb) => {
    
       if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg" ) {
 
         cb(null, true);
 
       } else {
         cb(new Error("Only .jpg, .png or .jpeg format allowed!"));
       }
     
   },
 });

 // upload category image
 export const uploadCategoryImage = multer({
   storage: profileStorage,
 
   limits: {
     fileSize: 3145728, // 3MB . less than 3mb file allowed
    //  fieldSize: 3 * 1024 *1024
   },
 
   fileFilter: (req, file, cb) => {
    
       if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg" ) {
 
         cb(null, true);
 
       } else {
         cb(new Error("Only .jpg, .png or .jpeg format allowed!"));
       }
     
   },
 });

 // upload category image
 export const uploadPromotionalImage = multer({
   storage: profileStorage,
 
   limits: {
     fileSize: 3145728, // 3MB . less than 3mb file allowed
    //  fieldSize: 3 * 1024 *1024
   },
 
   fileFilter: (req, file, cb) => {
    
       if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg" ) {
 
         cb(null, true);
 
       } else {
         cb(new Error("Only .jpg, .png or .jpeg format allowed!"));
       }
     
   },
 });

// upload promotional video
export const uploadPromotionalVideo = multer({
  storage: profileStorage,

  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max
  },

  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      "video/mp4",
      "video/webm",
      "video/ogg",
      "video/quicktime",
      "video/avi",
      "video/mov",
      "video/wmv",
      "video/flv",
      "video/mkv",
      "video/3gp"
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          "Only video files are allowed (mp4, webm, ogg, mov)"
        )
      );
    }
  },
});


 // preapre the final multer upload object
//  export const uploadDocument = multer({
//    storage: profileStorage,
 
//    limits: {
//      fileSize: 3145728, // 3MB . less than 3mb file allowed
//     //  fieldSize: 3 * 1024 *1024
//    },
 
//    fileFilter: (req, file, cb) => {
    
//        if (file.mimetype === "application/pdf" ) {
 
//          cb(null, true);
 
//        } else {
//          cb(new Error("Only pdf file format allowed!"));
//        }
     
//    },
//  });


//aws s3 multer middleware configuration

//upload image to s3
export const uploadImageToS3 = multer({
  storage: multerS3Storage,

  limits: {
    fileSize: 3 * 1024 * 1024, // 50MB
  },

  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      "image/png",
      "image/jpeg",
      "image/jpg",
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only PNG, JPEG, and JPG are allowed."));
    }
  },
});

//upload video s3
export const uploadVideoToS3 = multer({
  storage: multerS3Storage,

  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB
  },

  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = [
      "video/mp4",
      "video/webm",
      "video/ogg",
      "video/quicktime",
      "video/avi",
      "video/mov",
      "video/wmv",
      "video/flv",
      "video/mkv",
      "video/3gp"
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only MP4 and WEBM are allowed."));
    }
  },
});
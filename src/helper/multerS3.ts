// middlewares/uploadToS3.ts
import multer from "multer";
import multerS3 from "multer-s3";
import path from "path";
import { s3 } from "../config/awsS3";

// router.post(
//   "/upload-multiple",
//   uploadToS3.array("files", 5),
//   createPost
// );

// router.post(
//   "/upload",
//   uploadToS3.single("file"),
//   createPost
// );

// const createPost = catchAsync(async (req, res) => {
//   const file = req.file as Express.MulterS3.File;

//   // S3 gives you a public URL
//   const fileUrl = file.location;

//   sendResponse(res, {
//     statusCode: 200,
//     success: true,
//     message: "File uploaded successfully",
//     data: {
//       url: fileUrl,
//       key: file.key,
//     },
//   });
// });




export const multerS3Storage = multerS3({
    s3,
    bucket: process.env.S3_BUCKET_NAME!,
    acl: "public-read", // or private
    contentType: multerS3.AUTO_CONTENT_TYPE,

    key: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const fileName = `uploads/${Date.now()}-${file.originalname}`;
      cb(null, fileName);
    },
  });
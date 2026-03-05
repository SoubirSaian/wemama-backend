import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../config/awsS3";


export const deleteFromS3 = async (key: string): Promise<void> => {
  if (!key) return;

  try {
    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
    });

    await s3.send(command);
  } catch (error) {
    console.error("Failed to delete file from S3:", error);
    throw new Error("S3 file deletion failed");
  }
};

// if (oldPost.imageKey) {
//   await deleteFromS3(oldPost.imageKey);
// }

// export const extractS3KeyFromUrl = (url: string): string => {
//   const bucketUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/`;
//   return url.replace(bucketUrl, "");
// };

// const key = extractS3KeyFromUrl(oldImageUrl);
// await deleteFromS3(key);

// import { DeleteObjectsCommand } from "@aws-sdk/client-s3";

// export const deleteMultipleFromS3 = async (keys: string[]) => {
//   if (!keys.length) return;

//   const command = new DeleteObjectsCommand({
//     Bucket: process.env.AWS_BUCKET_NAME!,
//     Delete: {
//       Objects: keys.map((key) => ({ Key: key })),
//       Quiet: true,
//     },
//   });

//   await s3.send(command);
// };

// {
//   "Effect": "Allow",
//   "Action": ["s3:DeleteObject"],
//   "Resource": "arn:aws:s3:::YOUR_BUCKET_NAME/*"
// }


/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Request } from 'express';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

 // define storage for images
 export const profileStorage = multer.diskStorage({
   // destination: (req, file, cb) => {
   //   cb(null, "uploads/profile-image");
   // },
   destination: function (req: Request, file, cb) {
       let uploadPath = `uploads/${file.fieldname}`;
 
       cb(null, uploadPath);
   },
 
   filename: (req, file, cb) => {
     //extract the file extension from filename
     const fileExtension = path.extname(file.originalname);
 
     const fileName = file.originalname.replace(fileExtension, "").toLowerCase().split(" ").join("-") +"-" + Date.now();
 
     cb(null, fileName + fileExtension);
   },
 });
 
 




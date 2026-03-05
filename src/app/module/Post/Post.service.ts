import mongoose from "mongoose";
import ApiError from "../../../error/ApiError";
import { IJwtPayload } from "../../../interface/jwt.interface";
import { IPost } from "./Post.interface";
import PostModel from "./Post.model";
import { ENUM_POST_STATUS } from "../../../utilities/enum";
import { title } from "process";

const createPostService = async ( userDetails: IJwtPayload,files: Express.Multer.File[] | undefined,payload: Partial<IPost>) => {
    
    const creatorId = userDetails.userId;

    //handle images upload
    let imageUrls: string[] = [];

    if(files && files.length > 0){
        imageUrls = files?.map(file => `uploads/post-images/${file.filename}`);
    }
    

    const newPost = await PostModel.create({
      creator: creatorId,
      images: imageUrls,
        ...payload,
    });

    if(!newPost){
        throw new ApiError(500,"Failed to create new post.");
    }

    //calculate delivery fee if needed
    // Step-by-step

    // Customer creates job

    // Backend calculates price

    // Price stored in DB

    // Customer pays via gateway

    // Payment webhook confirms

    // Order marked as PAID

    // Driver assigned

    // Job completed

    // Driver wallet credited

    return newPost;
};

const getAllPostService = async ( userDetails: IJwtPayload ,query: Record<string,unknown>) => {
    const { postStatus } = query;
    const creatorId = userDetails.userId;

    const filter: Record<string, unknown> = { creator: creatorId, status: postStatus  };

    // if (status) {
    //     filter.status = status;
    // }

    const posts = await PostModel.find(filter);

    return posts;
};

const getNearbyPostsService = async (userDetails: IJwtPayload, query: Record<string,unknown>) => {
  const userId = userDetails.userId;

  const { latitude, longitude, radiusKm } = query as {
    latitude: number;
    longitude: number;
    radiusKm: number;
  };

  const radiusInMeters = radiusKm * 1000;

  const queryparameters = {
    creator: { $ne: new mongoose.Types.ObjectId(userId) },
    status: ENUM_POST_STATUS.PENDING, // not my post
      pickUpLocation: {
        $nearSphere: {
          $geometry: {
            type: "Point",
            coordinates: [longitude, latitude],
          },
          $maxDistance: radiusKm * 1000,
        }
      }
  }

  const posts = await PostModel.find({
    creator: { $ne: new mongoose.Types.ObjectId(userId) },
    status: ENUM_POST_STATUS.PENDING, // not my post
    pickUpLocation: {
      $nearSphere: {
        $geometry: {
          type: "Point",
          coordinates: [longitude, latitude],
        },
        $maxDistance: radiusInMeters,
      },
    },
  });

  return posts;
};

const getPostDetailService = async (postId: string) => {

    const post = await PostModel.findById(postId);

    if (!post) {
        throw new ApiError(404, "Post not found.");
    }

    return post;
}

const acceptPostService = async (userDetails: IJwtPayload, postId: string) => {
    const userId = userDetails.userId;

    const post = await PostModel.findById(postId);

    if (!post) {
        throw new ApiError(404, "Post not found to accept request.");
    }

    if (post.status !== ENUM_POST_STATUS.PENDING) {
        throw new ApiError(400, "Post is not available for acceptance.");
    }

    post.bearer = new mongoose.Types.ObjectId(userId);
    post.status = ENUM_POST_STATUS.ACCEPTED;

    await post.save();

    return {
      bearer: post.bearer, 
      title: post.title, 
      description: post.description,
      status: post.status, 
    };

}


/*

{
  "creator": "64f1c2a9e4b0f8b5a1c9d123",
  "bearer": "64f1c2a9e4b0f8b5a1c9d456",
  "status": "PENDING",
  "priority": "URGENT",
  "size": "SMALL",
  "title": "Deliver Documents Urgently",
  "description": "Need to deliver important documents within the city today.",
  "images": [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg"
  ],
  "pickUpLocation": {
    "type": "Point",
    "coordinates": [90.3566, 23.7465],
    "address": "Banani, Dhaka",
  },
  "dropLocation": {
     "type": "Point",
    "coordinates": [90.3566, 23.7465],
    "address": "Dhanmondi, Dhaka",
  },
  "category": "Documents",
  "price": 500,
  "deliveryDate": "2025-01-05",
  "deliveryTime": "2025-01-05T15:30:00.000Z"
}

*/

//dashboard

const dashboardAllPostService = async () => {

  const allPosts = await PostModel.find({}).lean();

  return allPosts;
}


const PostServices = { 
    createPostService ,
    getAllPostService,
    getNearbyPostsService,
    getPostDetailService,
    acceptPostService,

    dashboardAllPostService
};
export default PostServices;
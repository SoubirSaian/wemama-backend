import { Types } from "mongoose";

export interface IPost {
  creator: Types.ObjectId;  
  bearer: Types.ObjectId  ;
  status: string;
  priority: string;
  size: string;
  title: string;
  description: string;
  images: string[];
  pickUpLocation: object;
  dropLocation: object;
  category: string;
//   subcategory: string; 
  price: number;
  deliveryDate: Date;
  deliveryTime: Date;

}

export interface INearbyPostParams {
  // userId: string;
  latitude: number;
  longitude: number;
  radiusKm: number; // 30 or 50
}
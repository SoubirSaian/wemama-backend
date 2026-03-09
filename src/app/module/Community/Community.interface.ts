import { Types } from "mongoose";

export interface ICommunity {
  creator: Types.ObjectId
  name: string
  image: string
  members: Array<Types.ObjectId>

}


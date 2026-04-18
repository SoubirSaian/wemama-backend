import { model, models, Schema } from "mongoose";
import { IUser } from "./User.interface";
import bcrypt from "bcrypt";
import config from "../../../config";
import { ENUM_SUBSCRIPTION_TYPE } from "../../../utilities/enum";


const UserSchema = new Schema<IUser>({
    auth: { type: Schema.Types.ObjectId, ref: "Auth" },
    agoraUid:{ type: Number, default: null},
    name: {
        type: String,
        default: ''
        // required: [true,"Name is required"],
    },
    email: {
        type: String,
        required: [true,"email is required"],
    },
    phone: {
        type: String,
        default: ''
    },
    profileImage: {
        type: String,
        default: ''
    },
    images: [
        {
            type: String,
            default: ''
        }
    ],
    location: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point"
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            // required: true
            default: [0, 0]
        }
            
    },
    address:{
        type: String,
        default: ''
    },
    children:[{
        gender: {type: String, default: "Male"},
        dob: {type: Date, defalt: Date.now}
    }],
    DOB: {
        type: Date,
        default: null
    },
    state:{
        type: String,
        default: ''
    },
    city:{
        type: String,
        default: ''
    },
    // country:{
    //     type: String,
    //     default: ''
    // },
    bio:{
        type: String,
        default: ''
    },
    interesteds: [{
        type: String,
        default: ''
    }],
    mumStage:{
        type: String,
        default: ''
    },
    subscription: {
        isSubscribed: { type: Boolean, default: false },
        planType: {type: String, enum: Object.values(ENUM_SUBSCRIPTION_TYPE) ,default: ENUM_SUBSCRIPTION_TYPE.FREE},
        planPrice: {type: Number, default: 0},
        subscribedAt: { type: Date, default: null },
        expiredAt: { type: Date, default: null }
    },
   matchCount: {
    type: Number,
    default: 0
   },
   streakCount: {
    type: Number,
    default: 0
   },
   lastCheckInDate:{
    type: Date,
    defaultL: null
   }
    
    
}, { timestamps: true });

// In your user.model.ts
UserSchema.index({ location: '2dsphere' });

//dashboard get all users
//To keep this fast in production:
UserSchema.index({ createdAt: -1 });
UserSchema.index({ "subscription.planType": 1 });
UserSchema.index({ name: "text", email: "text" });



const UserModel = models.User || model<IUser>("User", UserSchema);

export default UserModel;
import { model, models, Schema } from "mongoose";
import { IUser } from "./User.interface";
import bcrypt from "bcrypt";
import config from "../../../config";


const UserSchema = new Schema<IUser>({
    auth: { type: Schema.Types.ObjectId, ref: "Auth" },
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
    image: [
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
        type: Date,
        default: null
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
        subscribedAt: { type: Date, default: null },
        expiredAt: { type: Date, default: null }
    }
   
    
    
}, { timestamps: true });

// UserSchema.pre('save', async function (next) {
//     // eslint-disable-next-line @typescript-eslint/no-this-alias
//     const user = this;
//     if (user.password) {
//         user.password = await bcrypt.hash(
//             user.password,
//             Number(config.bcrypt.salt_round)
//         );
//     }
//     next();
// });

// UserSchema.post('save', function (doc, next) {
//     doc.password = '';
//     next();
// });

// // statics method for check is user exists
// UserSchema.statics.isUserExists = async function (phoneNumber: string) {
//     return await UserModel.findOne({ phoneNumber }).select('+password');
// };

// // statics method for check password match  ----
// UserSchema.statics.isPasswordMatched = async function (
//     plainPasswords: string,
//     hashPassword: string
// ) {
//     return await bcrypt.compare(plainPasswords, hashPassword);
// };

// UserSchema.statics.isJWTIssuedBeforePasswordChange = async function (
//     passwordChangeTimeStamp,
//     jwtIssuedTimeStamp
// ) {
//     const passwordChangeTime =
//         new Date(passwordChangeTimeStamp).getTime() / 1000;

//     return passwordChangeTime > jwtIssuedTimeStamp;
// };

const UserModel = models.User || model<IUser>("User", UserSchema);

export default UserModel;
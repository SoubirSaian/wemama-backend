import { model, models, Schema } from "mongoose";
import { IPost } from "./Post.interface";
import { ENUM_POST_PRIORITY, ENUM_POST_SIZE, ENUM_POST_STATUS } from "../../../utilities/enum";
import { required } from "zod/v4/core/util.cjs";

const PostSchema = new Schema<IPost>({
    creator: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true,"Post creator id is required."]
    },
    bearer: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    status: {
        type: String,
        enum: Object.values(ENUM_POST_STATUS),
        default: ENUM_POST_STATUS.PENDING
    },
    priority: {
        type: String,
        enum: Object.values(ENUM_POST_PRIORITY),
        default: ENUM_POST_PRIORITY.URGENT
    },
    size: {
        type: String,
        enum: Object.values(ENUM_POST_SIZE),
        default: ENUM_POST_SIZE.SMALL
    },
    title: {
        type: String,
        required: [true,"Post title required."]
    },
    description: {
        type: String,
        required: [true,"Post description required."]
    },
    images: [{
        type: String,
        default: ''
    }],
    pickUpLocation: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point"
        },
        coordinates: {
            type: [Number], // [longitude, latitude]
            required: true
        },
        address: {
            type: String,
            required: true
        }
    },
    dropLocation: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point"
        },
        coordinates: {
            type: [Number],
            required: true
        },
        address: {
            type: String,
            required: true
        }
    },
    category: {
        type: String
    },
    price: {
        type: Number
    },
    deliveryDate: {
        type: Date
    },
    deliveryTime: {
        type: Date
    },
}, { timestamps: true });


/* ✅ ADD INDEX RIGHT HERE */
PostSchema.index({ pickUpLocation: "2dsphere" });

/* (Optional) If needed later */
PostSchema.index({ dropLocation: "2dsphere" });

const PostModel = models.Post || model<IPost>("Post", PostSchema);

export default PostModel;
import { model, models, Schema } from "mongoose";
import { IComment, ILike, IPost } from "./Post.interface";

const PostSchema = new Schema<IPost>({
    creator: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true,"Post creator id is required."]
    },
    community: {
        type: Schema.Types.ObjectId,
        ref: "Community",
        required: true
    },
    content: {
        type: String,
        required: [true,"Post title required."]
    },
    isAnonymous: {
        type: Boolean,
        default: false
    }
    
    
}, { timestamps: true });

const LikeSchema = new Schema<ILike>({
    creator: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true,"Post creator id is required."]
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: "Post",
        required: [true,"Post id is required."]
    },
    name: {
        type: String,
        required: [true,"Liker name is required."]
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});
      

const commentSchema = new Schema<IComment>({
    creator: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true,"Comment creator id is required."]
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: "Post",
        required: [true,"Post id is required."]
    },
    comment: {
        type: Schema.Types.ObjectId,
        ref: "Comment",
    },
    content: {
        type: String,
        required: [true,"Comment content is required."]
    },
    name: {
        type: String,
        required: [true,"Comment name is required."]
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
    
    
});


const PostModel = models.Post || model<IPost>("Post", PostSchema);
const LikeModel = models.Like || model<ILike>("Like", LikeSchema);
const CommentModel = models.Comment || model<IComment>("Comment", commentSchema);

export { LikeModel, CommentModel };

export default PostModel;
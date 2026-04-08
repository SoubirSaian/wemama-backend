import { model, models, Schema } from "mongoose";
import { IComment, ILike, IPost } from "./Post.interface";

//post schema
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
    totalLike: {
        type: Number,
        default: 0
    },
    totalComment: {
        type: Number,
        default: 0
    },
    isAnonymous: {
        type: Boolean,
        default: false
    },
    isPinned: {
        type: Boolean,
        default: false
    },
    isCommentLocked: {
        type: Boolean,
        default: false
    }
      
}, { timestamps: true });

//like schema
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

//To prevent duplicate likes, add a unique compound index:
//1 user → 1 like per post
LikeSchema.index({ creator: 1, post: 1 }, { unique: true });

//comment schema
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
    parentComment: {
        type: Schema.Types.ObjectId,
        ref: "Comment",
        default: null
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
//for better pipeline performance
commentSchema.index({ post: 1, parentComment: 1 });


const PostModel = models.Post || model<IPost>("Post", PostSchema);
const LikeModel = models.Like || model<ILike>("Like", LikeSchema);
const CommentModel = models.Comment || model<IComment>("Comment", commentSchema);

export { LikeModel, CommentModel };

export default PostModel;
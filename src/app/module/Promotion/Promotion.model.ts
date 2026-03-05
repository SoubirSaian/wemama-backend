import { model, models, Schema } from "mongoose";
import { INews, IVideo } from "./Promotion.interface";

const newsSchema = new Schema<INews>({
    title: { type: String , required: true},
    description: { type: String , required: true},
    image: { type: String, default: "" },
}, { timestamps: true });

const videoSchema = new Schema<IVideo>({
    title: { type: String , required: true},
    description: { type: String , required: true},
    video: { type: String, default: "" },
}, { timestamps: true });


const NewsModel = models.News || model<INews>("News", newsSchema);
const VideoModel = models.Video || model<IVideo>("Video", videoSchema);

export { NewsModel, VideoModel };
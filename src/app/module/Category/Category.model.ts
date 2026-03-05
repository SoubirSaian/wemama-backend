import { model, models, Schema } from "mongoose";
        import { ICategory } from "./Category.interface";

const CategorySchema = new Schema<ICategory>({
    
    name: { type: String, required: true },
    image: { type: String, default: "" },
}, { timestamps: true });

const CategoryModel = models.Category || model<ICategory>("Category", CategorySchema);

export default CategoryModel;
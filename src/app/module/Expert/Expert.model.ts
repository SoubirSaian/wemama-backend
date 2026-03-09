import { model, Schema, models } from "mongoose";
import { IExpert, ISession } from "./Expert.interface";
import { ENUM_SESSION_STATUS } from "../../../utilities/enum";

const ExpertSchema = new Schema<IExpert>({
    name: { type: String, default: "" },
    phone: { type: String , default: ""},
    email: { type: String, required: true, unique: true },
    image: { type: String, default: "" },
    country: { type: String , default: ""},
    city: { type: String, default: "" },
    profession: {
        title: { type: String, default: "" },
        designation: { type: String, default: "" },
        experience: { type: Number, default: "" },
    },
    license:{
        qualification: { type: String, default: "" },
        number: { type: String, default: "" },
        proof: { type: String, default: "" }
    },
    session : {
        topic: { type: String, default: "" },
        format: { type: String, default: "" },
        length: { type: String, default: "" }
    },
    availability: {
        day: { type: String, default: "" },
        time: { type: String, default: "" }
    }
}, { timestamps: true });


const SessionSchema = new Schema<ISession>({
    expert: {
        type: Schema.Types.ObjectId,
        ref: "Expert",
        required: [true,"Expert id is required."]
    },
    status: { 
        type: String, 
        enum: Object.values(ENUM_SESSION_STATUS), 
        default: ENUM_SESSION_STATUS.UPCOMING 
    },
    title: { type: String, required: true },
    description: { type: String, required: true },
    time: { type: Date, required: true },
    date: { type: Date, required: true }
}, { timestamps: true });




const ExpertModel = models.Expert || model<IExpert>("Expert", ExpertSchema);
const SessionModel = models.Session || model<ISession>("Session", SessionSchema);

export { ExpertModel, SessionModel };


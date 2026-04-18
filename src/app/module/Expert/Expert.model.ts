import { model, Schema, models } from "mongoose";
import { IExpert, IQuestion, ISession } from "./Expert.interface";
import { ENUM_SESSION_STATUS } from "../../../utilities/enum";

const ExpertSchema = new Schema<IExpert>({
    auth: { type: Schema.Types.ObjectId, ref: "Auth"},

    agoraUid: { type: Number, default: null },
    name: { type: String, default: "" },
    phone: { type: String , default: ""},
    email: { type: String, required: true, unique: true },
    image: { type: String, default: "" },
    country: { type: String , default: ""},
    city: { type: String, default: "" },
    signature: { type: String, default: "" },
    date: { type: Date, default: Date.now },
    profession: {
        title: { type: String, default: "" },
        designation: [{ type: String, default: "" }],
        experience: { type: Number, default: "" },
    },
    license:{
        qualification: { type: String, default: "" },
        certificate: { type: String, default: "" },
        proof: { type: String, default: "" }
    },
    session : {
        topic: { type: String, default: "" },
        format: [{ type: String, default: "" }],
        length: { type: String, default: "" }
    },
    availability: {
        days: [{ type: String, default: "" }],
        timezone: { type: String, default: "" }
    },
    isApproved: {type: Boolean, default: false}
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
    date: { type: Date, required: true },
    channelName: { type: String, default: '' },
    
    doctorUid: { type: Number, default: null},
    recordingUid: { type: Number, default: null},
    resourceId: { type: String, default: ''},
    sid: { type: String, default: ''},
    
    recordingMp4Url: { type: String, default: ''},
    recordingHlsUrl: { type: String, default: ''},
    recordingFiles: [{ 
        filename :{ type: String, default: ''},
        url :{ type: String, default: ''},
        type :{ type: String, default: ''},
    }],
    duration: { type: Number, default: null}, //in seconds
    startedAt: { type: Date, default: null },
    finishedAt: { type: Date, default: null },
    isApproved: {type: Boolean, default: false},
}, { timestamps: true });


const QuestionSchema = new Schema<IQuestion>({
    expert: {
        type: Schema.Types.ObjectId,
        ref: "Expert",
        required: [true,"Expert id is required."]
    },
    session: {
        type: Schema.Types.ObjectId,
        ref: "Session",
        required: [true,"Session id is required."]
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true,"User id is required."]
    },
    question: { type: String, required: true },
    isAnswerd: {type: Boolean, default: false},
    createdAt: { type: Date, default: Date.now }
});




const ExpertModel = models.Expert || model<IExpert>("Expert", ExpertSchema);
const SessionModel = models.Session || model<ISession>("Session", SessionSchema);
const QuestionModel = models.Question || model<IQuestion>("Question", QuestionSchema);

export { ExpertModel, SessionModel,QuestionModel };


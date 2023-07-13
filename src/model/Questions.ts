import mongoose, {Document} from 'mongoose';

export interface IQuestion extends Document {
    _id: mongoose.Schema.Types.ObjectId;
    name: string;
    body: string;
    problemId: number;
    problemCode: string;
    submissions: number;
    masterjudgeId : number;
    createdAt: Date;
}

const questionSchema = new mongoose.Schema(
    {
        name: {type:String, require:true},
        body: {type:String, },
        problemId: {type:Number,require:true},
        problemCode: {type: String,},
        masterjudgeId: {type:Number ,require: true},
        submissions: {type: Number, default: 0},
        createdAt: {type: Date}
    }
);

const Question = mongoose.model<IQuestion>("Question", questionSchema);

export default Question;
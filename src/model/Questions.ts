import mongoose, {Document} from 'mongoose';

export interface IQuestion extends Document {
    _id: mongoose.Schema.Types.ObjectId;
    name: string;
    problemStatement: string;
    difficulty: string;
    Submissions: number;
    createdAt: Date;
}

const questionSchema = new mongoose.Schema(
    {
        name: {type:String, require:true},
        problemStatement: {type:String, require:true, trim:true, unique:true},
        difficulty: {type:String ,require: true, trim: true},
        Submissions: {type: Number, default: 0},
        createdAt: {type: Date}
    }
);

const Question = mongoose.model<IQuestion>("User", questionSchema);

export default Question;
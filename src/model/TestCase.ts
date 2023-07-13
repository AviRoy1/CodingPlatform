import mongoose, {Document} from 'mongoose';

export interface ITestcase extends Document {
    _id: mongoose.Schema.Types.ObjectId;
    input: string;
    output: string;
    problemId: number;
    masterjudgeId : number;
    timelimit: number;
    createdAt: Date;
}

const testcaseSchema = new mongoose.Schema(
    {
        input: {type:String, },
        output: {type:String,},
        problemId: {type:Number, require:true},
        masterjudgeId: {type:Number ,require: true},
        createdAt: {type: Date}
    }
);

const Testcase = mongoose.model<ITestcase>("Testcase", testcaseSchema);

export default Testcase;
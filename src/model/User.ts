import mongoose, {Document} from 'mongoose';

export interface IUser extends Document {
    _id: mongoose.Schema.Types.ObjectId;
    name: string;
    email: string;
    username: string;
    password: string;
    problemSolved: number;
    isAdmin: Boolean,
    createdAt: Date;
}

const userSchema = new mongoose.Schema(
    {
        name: {type:String, require:true},
        username: {type: String, require: true, trim: true},
        email: {type:String, require:true, trim:true, unique:true},
        password: {type:String ,require: true, trim: true},
        problemSolved: {type: Number, default: 0},
        isAdmin: {type:Boolean , default: false},
        createdAt: {type: Date, require:true},
    }
);

const User = mongoose.model<IUser>("User", userSchema);

export default User;
// Defines the blueprint for mongodb

import mongoose, { Document,Schema} from "mongoose";
//ITask --> interface describes the shape of the document
export interface ITask extends Document{
    title: string;
    description?:string;
    status:"pending" | "in-progress" | "completed";
    dueDate?:string;
    user:mongoose.Types.ObjectId; //whihc user owns this task
}
//Task Schem
const TaskSchema: Schema<ITask> = new Schema(
   {
 title:{
        type:String,
        required:true,
        trim:true,
    },
    description: {
        type: String,
    
    },
    status:{
        type: String,
        enum: ["pending","in-progress","completed"],
        default:"pending",
    },
    dueDate: {
        type: String,
    },
     user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",     // tells Mongoose this links to the User model
      required: true,  // every task MUST belong to a user (no orphan tasks)
    },

},
{
    // timestamps : create two fields
    // createdAt --> when task was first created
    // updatesAt --> when the task wad last modified
    timestamps: true,
}

);
const Task = mongoose.model<ITask>("Task",TaskSchema);
export default Task;
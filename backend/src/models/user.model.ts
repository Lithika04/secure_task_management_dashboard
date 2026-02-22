import mongoose, { Document,Schema} from "mongoose";
import bcrypt from "bcrypt";
 
 // Iuser Interface- Defines the structure of a user document

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;

  // Method to compare entered password with hashed password
  comparePassword(candidatePassword: string): Promise<boolean>;
}
// user schema -- define how user data is stored in mongodb
const UserSchema: Schema<IUser> = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true, // Removes extra whitespace
    },
    email: {
      type: String,
      required: true,
      unique: true, // Prevent duplicate emails
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6, // Basic validation
    },
  },
  {
    timestamps: true, // Adds createdAt & updatedAt automatically
  }
);
// pre-save hook --> this runs before saving user to db. it hashes password 
UserSchema.pre<IUser>("save", async function () {
  // Only hash if password was changed
  if (!this.isModified("password")) return ;

  // Generate salt
  const salt = await bcrypt.genSalt(10);

  // Hash password
  this.password = await bcrypt.hash(this.password, salt);

});
/**
 * comparePassword Method
 * Used during login to compare entered password
 * with hashed password stored in DB.
 */
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Create model from schema
const User = mongoose.model<IUser>("User", UserSchema);

export default User;

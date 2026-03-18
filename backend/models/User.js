import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    height: {
        type: Number
    },
    weight: {
        type: Number
    },
    age: {
        type: Number
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other']
    },
    activityLevel: {
        type: String,
        enum: ['Sedentary', 'Lightly Active', 'Moderately Active', 'Very Active', 'Super Active']
    },
    targetWeight: {
        type: Number
    },
    fitnessGoal: {
        type: String,
        enum: ['Lose Fat', 'Maintain Health', 'Gain Muscle']
    },
    dietPreference: {
        type: String,
        enum: ['Vegetarian', 'Non-Vegetarian']
    }
}, { timestamps: true });

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Encrypt password using bcrypt
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);
export default User;

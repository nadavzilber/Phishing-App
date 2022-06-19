import mongoose from 'mongoose'
const emailSchema = new mongoose.Schema({
    name: {
        type : String,
        required: true
    },
    email: {
        type : String,
        required: true
    },
    status: {
        type : String,
        required: true
    }
});
export const emailModel = mongoose.model( 'Email' , emailSchema );

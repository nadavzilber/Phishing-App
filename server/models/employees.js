import mongoose from 'mongoose'
const employeeSchema = new mongoose.Schema({
    name: {
        type : String,
        required: true
    },
    email: {
        type : String,
        required: true
    },
    password: {
        type : String,
        required: true
    }
});
export const employeeModel = mongoose.model( 'Employee' , employeeSchema );

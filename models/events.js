const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const eventSchema = new Schema({
    title: {type: String, required : [true, 'Title is required.']},
    host:{type: Schema.Types.ObjectId, ref:'User'},
    details:{type: String, required : [true, 'Details is required.'],
            minLength: [10, 'Details must be at least 10 characters']},
    category:{type: String, required: [true, 'Category is required']},
    location:{type: String, required: [true, 'location is required']}, 
    startDate:{type: Date, required: [true, 'Start Date is required']}, 
    endDate:{type: Date, required: [true, 'Category is required']},
    rsvps: [{
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        status: { type: String, enum: ['YES', 'NO', 'MAYBE'], required: true }
    }]
},
{timestamps : true}
);


//Collection name is events in database.
module.exports = mongoose.model('Event', eventSchema)

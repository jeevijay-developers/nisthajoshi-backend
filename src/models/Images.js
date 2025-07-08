const mongoose = require("mongoose")

const imageSchema = new mongoose.Schema({
    title: {
        type: String, 
        required: true
    },
    images: [
        {
            url: {
                type: String
            },
            public_id: { 
                type: String 
            },
        }
    ]
})

module.exports = mongoose.model("Images", imageSchema)
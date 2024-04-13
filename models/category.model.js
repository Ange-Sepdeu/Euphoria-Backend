import mongoose from "mongoose";
const productSchema = new mongoose.Schema({
    product_name: {
        type:String,
        required:true
    },
    product_description: {
        type:String,
        required:true
    },
    product_image_url: {
        type:String,
        required:true
    },
    tags: {
        type:String,
        required: true
    },
    country: {
        type:String
    },
    status: {
        type:String,
        default: "active"
    },
    unit_price: {
        type: Number,
        default: Math.floor(Math.random()*(9501))+500
    }
}, {timestamps:true})

const categorySchema = new mongoose.Schema({
    category_name: {
        type: String,
        required: true
    },
    gender: {
        type: String
    },
    category_description: {
        type: String,
        required: true
    },
    category_image_url: {
        type:String,
        required: true
    },
    status: {
        type:String,
        default: "active"
    },
    products: [productSchema]
}, {timestamps:true});

const Category =  mongoose.model("Category", categorySchema);
export default Category;
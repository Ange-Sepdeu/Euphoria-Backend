import Users from "../models/user.model.js";
import path from "path"
import validator from "validator";
import fs from "fs"
import {uploadFile} from "../utils/saveFile.js";
import __dirname from "../helper.js";
import Category from "../models/category.model.js";

export const getAllUsers = async(req, res) => {
    const users = await Users.find();
    return res.status(200).json({message: "Success !", data: users});
}

export const getAllCategories = async(req, res) => {
    const allCategories = await Category.find({status: "active"});
   return res.status(200).json({message: "Success", data: allCategories});
}

export const addCategory = async (req, res) => {
    const { category_name, category_description,category_image_url } = req.body;
    // const category_image = req.files.category_image;
    // const filename = "category" + `${new Date().getTime()}`+path.extname(category_image.name);
    // const path_to_file = path.join(__dirname, "public/images/category/"+filename) 
    // const uploadDir = path.join(__dirname, "public/images/category")
    const gender = ["Male", "Female"][Math.floor(Math.random()*(2))]
    if (validator.isEmpty(category_name) || validator.isEmpty(category_description))
    return res.status(400).json({message: "Remplir le formulaire et choisir un fichier"})
    const category_exists = await Category.findOne({category_name, gender});
    if (category_exists)
    return res.status(400).json({message: "A category with this name and gender exists already !"})
    // const uploaded = uploadFile(category_image,path_to_file,uploadDir);
    // if (uploaded) {
        const new_category = await Category.create({
            category_name,
            category_description,
            gender,
            category_image_url,
            products: []
        })
        if (new_category)
        return res.status(200).json({message:"Category created successfully !", data:new_category});
    // }
    // else {
    //     return res.status(400).json({message: "An error occured, try again or choose an image of smaller size"});
    // }
}

export const removeCategory = async (req, res) => {
    const {_id} = req.body;
    const removedCategory = await Category.findByIdAndUpdate(_id, {status:"inactive"});
    // fs.rmSync(`${__dirname}/public/${removedCategory.category_image_url}`)
    return res.status(200).json({message: "Category deleted successfully !", data: removedCategory})
}

export const updateCategory = async (req, res) => {
    const {_id, category_name, category_description,category_image_url} = req.body;
    var category;
    category = await Category.findByIdAndUpdate(_id, {category_name, category_description, category_image_url});
    // const category_image = req.files.category_image;
    // const filename = "category" + `${new Date().getTime()}`+path.extname(category_image.name);
    // const path_to_file = path.join(__dirname, "public/images/category/"+filename);
    // const uploadDir = path.join(__dirname, "public/images/category/")
    // const uploaded = uploadFile(category_image,path_to_file,uploadDir)
    // if (uploaded){
        // fs.rmSync(`${__dirname}/public/${category.category_image_url}`);
        // category.category_image_url = `images/category/${filename}`;
        // category = await category.save();
    return res.status(200).json({message: "Category updated successfully !", data:category});
}

export const addProduct = async (req, res) => {
    const {product_name, product_description, category_id, product_image_url,tags,country} = req.body;
    // const product_image = req.files.product_image;
    // const filename = "product" + new Date().getTime()+path.extname(product_image.name);
    // const path_to_file = path.join(__dirname, "public/images/products/"+filename);
    // const uploadDir = path.join(__dirname, "public/images/products")
    console.log(req.body)
    if (validator.isEmpty(product_name) || validator.isEmpty(product_description) || validator.isEmpty(category_id))
    return res.status(400).json({message: "Fill in the form fields"})
    const category = await Category.findById(category_id)
    let product_exists = false;
    category.products.forEach(pdt => {
        if (pdt.product_name === product_name)
            product_exists = true;
    })
    if(product_exists)
        return res.status(400).json({message: "A product with this name already exists in this category !"});
    // const uploaded = uploadFile(product_image,path_to_file,uploadDir);
    // if (uploaded) {
        if (req.body.price){
            category.products.push({
                product_name,
                product_description,
                product_image_url,
                unit_price: req.body.price,
                country,
                tags
            })
         }
         else {
            category.products.push({
                product_name,
                product_description,
                country,
                tags,
                product_image_url
            })
         }
         const updatedCategory =  await category.save();
         return res.status(200).json({message: "Product added successfully !", data:updatedCategory});   
}
export const removeProduct = async (req, res) => {
    const {product_id, category_id} = req.body;
    var category;
    category = await Category.findById(category_id);
    // const product = category.products.find((pdt) => pdt._id === product_id);
    // fs.rmSync(`${__dirname}/public/${product.product_image_url}`);
    category.products.forEach(pdt => {
        if (pdt._id === product_id)
        pdt.status = "inactive";
    })
    const updated_category = category.save();
    return res.status(200).json({message: "Product deleted successfully !", data: updated_category})
}

export const updateProduct = async (req, res) => {
    const {product_id, category_id, product_name, product_description, tags, country} = req.body;
    var category;
    category = await Category.findById(category_id);
     category.products.forEach(pdt => {
        if(pdt._id === product_id)
        {
            pdt.product_name = product_name;
            pdt.product_description = product_description;
            pdt.unit_price = price;
            pdt.tags = tags;
            pdt.country = country;
        }
     })
     category = category.save();
    return res.status(200).json({message: "Product updated successfuly !", data:category});
}
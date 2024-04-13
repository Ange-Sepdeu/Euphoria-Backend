import validator from "validator"
import bcrypt from "bcryptjs"
import Users from "../models/user.model.js"
import jwt from "jsonwebtoken"

const saltRound = 20

export const register = async(req, res) => {
    const {username, email, password} = req.body
    if(validator.isEmpty(username) || validator.isEmpty(email) || validator.isEmpty(password))
        return res.status(400).json({message: "Fill in the empty fields"})
    else {
        if(!validator.isEmail(email)) return res.status(400).json({message: "Enter a valid email address"})
        if(/^(?=.*?\d)(?=.*?[a-zA-Z])[a-zA-Z\d]+$/.test(password)) return res.status(400).json({message: "Password must contain atleast one uppercase, lowercase number and special character"})
        const user = await Users.findOne({email})
        if(user) return res.status(400).json({message: "Email already taken !"})
        const salt = await bcrypt.genSalt(saltRound)
        const hashedPassword = await bcrypt.hash(password, salt)
        const created_user = await Users.create({
            username, 
            email, 
            password: hashedPassword,
        })
        return res.status(200).json({message: "User created successfully !"})
    }
}

export const login = async(req, res) => {
    const {email, password} = req.body
    if(validator.isEmpty(email) || validator.isEmpty(password))
    return res.status(400).json({message: "Fill in the empty fields !"})
    const user = await Users.findOne({email})
    if(!user) 
    return res.status(400).json({message: "Invalid credentials"})
    const dbPassword = user.password
    const validPasssword = bcrypt.compare(password, dbPassword)
    if(!validPasssword) return res.status(400).json({message: "Invalid credentials"})
    const token = jwt.sign({user}, process.env.JWT_TOKEN_KEY,{
        expiresIn: "10h",
      })
    return res.status(200).json({message: "User login successful !", data: {user, token}})
}
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const hashPassword = async(password)=>{
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);

}
const comparePassword = async(password, hash)=>{
    return await bcrypt.compare(password, hash);
}
const generateToken = (res, userId)=>{
    const token = jwt.sign({userId}, process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRES
    })
    res.cookie("jwt", token,{
        httpOnly: true,
        secure: process.env.NODE_ENV ==="production",
        sameSite: "Strict",
        maxAge: 7*24*60*1000
    });
    return token;
};
export { hashPassword, comparePassword, generateToken };
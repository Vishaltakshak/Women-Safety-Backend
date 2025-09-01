import jwt from "jsonwebtoken";
export const protect = ()=>{
    let token;
    if(req.cookies && req.cookies.token) token = req.cookies.token;
    else if(req.headers.authorization && req.headers.authorization.startswith("Bearer ")) token = req.headers.authorization.split(" ")[1];
    if(!token) res.status(401).json({message:"authorized no token found"})
    try {

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userID = decoded.id;
        next();
        
    } catch (error) {
        return res.status(401).json({message:`Unauthorized no token found Error: ${error}`});
        
    }
}
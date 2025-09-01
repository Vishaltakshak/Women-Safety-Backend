import { comparePassword, generateToken } from "../../../middleware/authHelper.js";
import  user  from "../model/userSchema.js";
import { fetchLocations, updateUserLocation } from "../services/UserServices.js"; 


//udate location function
export const updateLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const { coordinates } = req.body; 

    if (!Array.isArray(coordinates) || coordinates.length !== 2) {
      return res.status(400).json({ message: "Invalid coordinates format. Expected [longitude, latitude]" });
    }

    await updateUserLocation(id, coordinates);

    return res.status(200).json({ message: "Location updated successfully" });

  } catch (error) {
    console.error("Error in updateLocation controller:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};


//login user function controller
export const loginUser = async (req, res) => {
  try {
    const { mail, password } = req.body;

    if (!mail || !password) {
      return res.status(400).json({ message: "Email or password missing" });
    }

    const details = await user.findOne({ Mail: mail }).select("+Password");

    if (!details) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await comparePassword(password, details.Password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = await generateToken(res, details._id);

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        details:details
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "An error occurred during login" });
  }
};


//logout user function
export const logoutUser = (req, res)=>{
    try {
        res.cookie("token", "", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
                maxAge: 20*60,
                path: "/",
                domain: process.env.COOKIE_DOMAIN
            });

            return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
         console.error("Logout error:", error);
        res.status(500).json({ message: "An error occurred during logout" });
        
    }

}


//fetch near by users contolller function
export const fetchNearByUsers = async(req, res)=>{
  const {coordinates} = req.body;
  if(!Array.isArray(coordinates)|| coordinates.length !== 2) return res.status(400).json({message:"Invalid coordinates"});
  try {
    const nearByUsers = await fetchLocations(coordinates);
    if (!nearByUsers || nearByUsers.length === 0) {
      return res.status(404).json({ message: "No users found nearby." });
    }
    return res.status(200).json({data:nearByUsers});
  } catch (error) {
    console.error("error in fetchNearByUsers");
    return res.status(500).json({message:"server side error"});

  }
}
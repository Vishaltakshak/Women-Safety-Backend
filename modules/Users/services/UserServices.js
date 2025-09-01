import user from "../model/userSchema.js";
import { hashPassword } from "../../../middleware/authHelper.js";
import { UserLocation } from "../model/userLocationSchema.js";
export const addUser = async(req, res)=>{
    const details = req.body;
    if (!details) return res.status(400).json({ message: "Invalid request body" });

    try {
        const addedUser = await user.create(details);
        if(!addedUser) return res.status(400).json({message:"user not added"});
        return res.status(200).json({ message: "User added successfully", user: addedUser });

    } catch (error) {
        console.error("error adding user", error)
        return res.status(500).json({error:error});
        
    }
}
export const findUser = async(req, res)=>{
    const{id} = req.params;
    try {
        const foundUser = await user.findById(id);
        if(!foundUser) return res.status(404).json({message:"No user found"});
        return res.status(200).json({user:foundUser});
    } catch (error) {
        console.error("Cannot run finduser not going in try function is breaking")
        return res.status(500).json({message:"server side error"})
        
    }
}


export const updateUser = async (req, res) => {
  const { id } = req.params;

  const {
    Name,
    Mail,
    Password,
    PhoneNumber,
    EmergencyContacts,
    Address,
    imgURL
  } = req.body;

  try {
    const updatePayload = {
      Name,
      Mail,
      PhoneNumber,
      EmergencyContacts,
      Address,
      imgURL
    };

    // Only hash password if it's provided
    if (Password && Password.trim() !== "") {
      updatePayload.Password = await hashPassword(Password);
    }

    const updatedUser = await user.findByIdAndUpdate(id, updatePayload, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ message: "Couldn't update the user" });
    }

    return res
      .status(200)
      .json({ message: "User updated successfully", UpdatedDetails: updatedUser });

  } catch (error) {
    console.error("Server side error in updateUser:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const fetchUser = async(req, res)=>{
    try {
        const users = await user.find({}).exec();
        if(!users) return res.status(404).json({message:"no user found"});
        return res.status(200).json({data:users})
    } catch (error) {
        console.error("Server error");
        return res.status(500).json({error:error})
        
    }
}



export const updateUserLocation = async (id, coordinates) => {
  try {
    
    await UserLocation.create({
      id,
      Location: {
        type: "Point",
        coordinates,
        timestamp: new Date(),
      },
    });

   
    const locations = await UserLocation.find({ id })
      .sort({ "Location.timestamp": -1 }) 
      .skip(3); 

   
    if (locations.length > 0) {
      const idsToDelete = locations.map(loc => loc._id);
      await UserLocation.deleteMany({ _id: { $in: idsToDelete } });
    }

    return { success: true };
  } catch (err) {
    console.error("Error updating location:", err);
    throw new Error("Failed to update location");
  }
};
export const fetchLocations = async (coordinates) => {
  try {
    const [lng, lat] = coordinates;

    const locations = await UserLocation.find({
      Location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [lng, lat], // IMPORTANT: GeoJSON expects [lng, lat]
          },
          $maxDistance: 3000, // distance in meters
        },
      },
    }).populate("id", "Name Mail PhoneNumber");

    return locations;
  } catch (error) {
    console.error("Error fetching nearby locations:", error);
    throw new Error("Failed to fetch locations");
  }
};

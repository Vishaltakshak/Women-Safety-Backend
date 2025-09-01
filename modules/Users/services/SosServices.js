import { emergencySchema } from "../model/sosSchema.js"; 
import fetch from "node-fetch"; // if not in native fetch environment
import user from "../model/userSchema.js";

// Create SOS
export const CreateSos = async (req, res) => {
  try {
    const { id, name, coordinates, status } = req.body;
    console.log("Raw body:", req.body);

    if (!id || !name || !coordinates || coordinates.length !== 2) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const lat = coordinates[1];
    const lng = coordinates[0];

    // Reverse geocode using OpenStreetMap
    const geoRes = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
    );
    const geoData = await geoRes.json();
    const areaName =
      geoData.address?.suburb ||
      geoData.address?.city ||
      geoData.address?.state ||
      "Unknown Area";

    // Unique human-readable name
    const requestName = `${name}-${areaName}-${Date.now()}`;

    const sos = await emergencySchema.create({
      user: id, // Mongoose ref to User
      name,
      coordinates: {
      type: "Point",
      coordinates: [lng, lat]
    },
      areaName,
      status,
      requestName,
      createdAt: new Date(),
    });
    const users = await user.findById(id);
    const firstContact = user.EmergencyContacts?.[0];

    if (firstContact?.PhoneNumber) {
       const message =  await axios.post("https://textbelt.com/text", {
        phone: firstContact.PhoneNumber,
        message: `🚨 SOS Alert! ${user.name} needs help at ${location}.`,
        key: "textbelt"
      });
      if(!message) console.log("Message not Sent");
      console.log(message)
    }


    if (!sos) {
      return res.status(500).json({ message: "Failed to generate the SOS" });
    }

    return res.status(201).json({
      message: "SOS Generated and Active",
      data: sos,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update SOS status
export const UpdateSos = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) return res.status(400).json({ message: "SOS ID is required" });

    const updatedSos = await emergencySchema.findByIdAndUpdate(
      id,
      { status: "resolved" },
      { new: true }
    );

    if (!updatedSos) {
      return res.status(404).json({ message: "SOS request not found" });
    }

    return res.status(200).json({
      message: "SOS request resolved successfully",
      data: updatedSos,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error updating the SOS", error: error.message });
  }
};

export const getNearbySos=async (req, res)=> {
    try {
      const { coordinates} = req.query; // radius in km
      if (!coordinates) {
        return res.status(400).json({ message: "Coordinates are required" });
      }

      const [lng, lat] = coordinates.split(",").map(Number);

      const activeSos = await emergencySchema.find({
        status: "active",
        coordinates: {
    $near: {
      $geometry: {
        type: "Point",
        coordinates: [lng, lat],
      },
      $maxDistance: 5000 // meters
    },
  },
      }).populate("user", "name imgURL"); // get user infos

      return res.status(200).json({
        message: "Nearby active SOS requests",
        data: activeSos,
      });
    } catch (error) {
      console.error("Error fetching nearby SOS:", error);
      return res.status(500).json({ message: "Server error", error: error.message });
    }
  }


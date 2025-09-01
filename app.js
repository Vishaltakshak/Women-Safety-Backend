import express from "express";
import { userRoutes } from "./modules/Users/Routes/userRoutes.js";
import { protect } from "./middleware/authMiddleware.js";
import dotenv from "dotenv"
import { CreateConnection } from "./shared/Connection/connection.js";
import cors from "cors"
import { sosRoutes } from "./modules/Users/Routes/SosRoutes.js";
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors({
  origin:'http://localhost:5173',
}))

app.use("/api/user", userRoutes);
app.use("/api",sosRoutes);
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
  next();
});
CreateConnection()
 .then(() => {
     app.listen(process.env.PORT, () => {
      console.log(`🚀 Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => console.log("❌ Database Connection Failed:", err));

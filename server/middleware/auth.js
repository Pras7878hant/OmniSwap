import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
     try {
          let token = req.headers.authorization;

          console.log("AUTH HEADER:", token);

          if (!token) {
               console.log("❌ NO TOKEN");
               return res.status(401).json("No token");
          }

          if (token.startsWith("Bearer ")) {
               token = token.split(" ")[1];
          }

          const decoded = jwt.verify(token, process.env.JWT_SECRET);

          console.log("✅ DECODED TOKEN:", decoded);

          req.user = decoded;

          next();
     } catch (error) {
          console.log("❌ TOKEN ERROR:", error.message);
          res.status(401).json("Invalid token");
     }
};
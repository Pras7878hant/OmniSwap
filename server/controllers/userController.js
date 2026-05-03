import User from "../models/User.js";

export const updateSkills = async (req, res) => {
     try {
          console.log("BODY:", req.body);
          console.log("USER FROM TOKEN:", req.user);
          console.log("NEW CONTROLLER RUNNING");

          // normalize function (handles string OR array)
          const normalize = (input) => {
               if (!input) return [];

               // if frontend sends "react, node"
               if (typeof input === "string") {
                    return input
                         .split(",")
                         .map((s) => s.toLowerCase().trim())
                         .filter((s) => s.length > 0);
               }

               // if frontend sends array ["react","node"]
               if (Array.isArray(input)) {
                    return input
                         .map((s) => s.toLowerCase().trim())
                         .filter((s) => s.length > 0);
               }

               return [];
          };

          const updateData = {};

          const skillsHave = normalize(req.body.skillsHave);
          const skillsWant = normalize(req.body.skillsWant);

          if (skillsHave.length) {
               updateData.skillsHave = skillsHave;
          }

          if (skillsWant.length) {
               updateData.skillsWant = skillsWant;
          }

          console.log("NORMALIZED HAVE:", skillsHave);
          console.log("NORMALIZED WANT:", skillsWant);

          if (!req.user?.id) {
               console.log("NO USER ID");
               return res.status(401).json("No user");
          }

          const user = await User.findByIdAndUpdate(
               req.user.id,
               updateData,
               { new: true }
          );

          console.log("UPDATED USER:", user);

          if (!user) {
               return res.status(404).json("User not found");
          }

          res.json(user);
     } catch (err) {
          console.log("UPDATE ERROR:", err.message);
          res.status(500).json(err.message);
     }
};

export const getMatches = async (req, res) => {
     try {
          console.log("USER ID:", req.user.id);

          const normalize = (arr) =>
               (arr || [])
                    .map((s) => s.toLowerCase().trim())
                    .filter(Boolean);

          const currentUser = await User.findById(req.user.id);

          if (!currentUser) {
               return res.status(404).json("User not found");
          }

          console.log("CURRENT USER:", currentUser);

          const currentHave = normalize(currentUser.skillsHave);
          const currentWant = normalize(currentUser.skillsWant);

          const users = await User.find({
               _id: { $ne: currentUser._id }
          });

          const matches = users
               .map((user) => {
                    const userHave = normalize(user.skillsHave);
                    const userWant = normalize(user.skillsWant);

                    const iWant = userHave.filter((s) =>
                         currentWant.includes(s)
                    );

                    const theyWant = userWant.filter((s) =>
                         currentHave.includes(s)
                    );

                    const score = iWant.length + theyWant.length;

                    return {
                         ...user._doc,
                         score
                    };
               })
               .filter((u) => u.score > 0)
               .sort((a, b) => b.score - a.score);

          console.log("MATCHES:", matches);

          res.json(matches);
     } catch (err) {
          console.log("MATCH ERROR:", err.message);
          res.status(500).json(err.message);
     }
};
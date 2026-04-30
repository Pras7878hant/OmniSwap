import User from "../models/User.js";

export const updateSkills = async (req, res) => {
     try {
          const normalize = (arr) =>
               (arr || [])
                    .map((s) => s.toLowerCase().trim())
                    .filter((s) => s.length > 0);

          const skillsHave = normalize(req.body.skillsHave);
          const skillsWant = normalize(req.body.skillsWant);

          const user = await User.findByIdAndUpdate(
               req.user.id,
               { skillsHave, skillsWant },
               { new: true }
          );

          res.json(user);
     } catch (err) {
          res.status(500).json(err.message);
     }
};

export const getMatches = async (req, res) => {
     try {
          const normalize = (arr) =>
               (arr || []).map((s) => s.toLowerCase().trim());

          const currentUser = await User.findById(req.user.id);

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
                         score,
                         debug: {
                              iWant,
                              theyWant
                         }
                    };
               })
               .filter((u) => u.score > 0)
               .sort((a, b) => b.score - a.score);

          res.json(matches);
     } catch (err) {
          res.status(500).json(err.message);
     }
};
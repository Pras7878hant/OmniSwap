import User from "../models/User.js";

export const getMatches = async (req, res) => {
     try {
          const normalize = (arr) => arr.map(s => s.toLowerCase());

          const currentHave = normalize(currentUser.skillsHave);
          const currentWant = normalize(currentUser.skillsWant);

          const currentUser = await User.findById(req.user.id);

          const users = await User.find({
               _id: { $ne: currentUser._id }
          });

          const matches = users.map(user => {
               const common = user.skillsHave.filter(skill =>
                    currentUser.skillsWant.includes(skill)
               );

               const reverse = user.skillsWant.filter(skill =>
                    currentUser.skillsHave.includes(skill)
               );

               const score = common.length + reverse.length;

               return {
                    ...user._doc,
                    score
               };
          })
               .filter(u => u.score > 0)
               .sort((a, b) => b.score - a.score);

          res.json(matches);
     } catch (err) {
          res.status(500).json(err.message);
     }
};
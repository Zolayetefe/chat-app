const User = require("../models/User");

exports.searchUsers = async (req, res, next) => {
   try {
        const { q } = req.query;
        if (!q) {
            return res.status(200).json([]);
        }
        // Search for users whose username starts with the query string (case-insensitive)
        const users = await User.find({ 
            username: { $regex: `^${q}`, $options: 'i' } 
        }).select('_id username'); // Select only ID and username

        res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};
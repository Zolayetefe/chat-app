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


exports.getUserStatus = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select("lastSeen");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // Note: Online status is determined by socket, not stored in DB
    res.json({
      isOnline: false, // Default to false; socket updates override this
      lastSeen: user.lastSeen ? user.lastSeen.toISOString() : null,
    });
  } catch (err) {
    next(err);
  }
};
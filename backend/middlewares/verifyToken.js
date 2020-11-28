const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  // check header or url parameters or post parameters for token
  var { accessToken } = req.body;

  jwt.verify(accessToken, process.env.JWT_SECRET, function (err, user) {
    if (err) {
      return res.status(200).json({
        success: false,
        message: "Please Register/Login to play the game!",
      });
    } else {
      req.user = user; //set the user to req so other routes can use it
      next();
    }
  });
};

module.exports = verifyToken;

const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  // check header or url parameters or post parameters for token
  const bearer = req.headers.authorization;
  if (bearer) {
    const accessToken = bearer.split(" ")[1];

    jwt.verify(accessToken, process.env.JWT_SECRET, function (err, payload) {
      if (err) {
        return res.status(401).json({
          success: false,
          message: "Please Register/Login to play the game!",
        });
      } else {
        const { sub, user, isGuest } = payload;
        req.user = user; //set the user to req so other routes can use it
        req.userID = sub;
        req.isGuest = isGuest;
        next();
      }
    });
  } else {
    res.status(401).send({
      success: false,
      message: "Token not found.",
    });
  }
};

module.exports = verifyToken;

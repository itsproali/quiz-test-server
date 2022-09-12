const authRouter = require("express").Router();
const passport = require("passport");
const mongodb = require("../features/mongodb");

async function run() {
  const userCollection = await mongodb.collection("users");

  try {
    // Log In
    authRouter.get("/login/success", async (req, res) => {
      console.log(req.user);
      if (req.user) {
        const { email, name, picture, sub } = req.user?._json;
        const exist = await userCollection.findOne({ email });
        if (!exist) {
          const insert = await userCollection.insertOne({
            email,
            name,
            picture,
            sub,
          });
        }
        res.status(200).send({
          error: false,
          message: "Successfully Logged In",
          user: req.user._json,
        });
      } else {
        res.send({ error: true, message: "Not Authorized" });
      }
    });

    // Log In Failed
    authRouter.get("/login/failed", (req, res) => {
      res.status(401).send({
        error: true,
        message: "Log in failure",
      });
    });

    // Authentication with Google
    authRouter.get(
      "/google",
      passport.authenticate("google", ["profile", "email"])
    );

    // Google Authentication Callback
    authRouter.get(
      "/google/callback",
      passport.authenticate("google", {
        successRedirect: `${process.env.CLIENT_URL}/dashboard`,
        failureRedirect: "/login/failed",
      })
    );

    // User LogOut
    authRouter.get("/logout", (req, res) => {
      req.logout(function (err) {
        if (err) {
          return next(err);
        }
        res.redirect(process.env.CLIENT_URL);
      });
    });
  } finally {
    // Nothing to do
  }
}

// Call the asynchronous function
run().catch(console.dir);

module.exports = authRouter;

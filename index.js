const express = require("express");
PORT = process.env.PORT || 5000;
const cors = require("cors");
require("dotenv").config();
const passport = require("passport");
const authRouter = require("./routes/auth");
const passportStrategy = require("./passport");
const session = require("express-session");
const app = express();

// Middleware
app.use(express.json());
app.use(
  session({
    secret: "anything",
    resave: false,
    saveUninitialized: true,
    // cookie: { secure: true },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

// Routes
app.use("/auth", authRouter);

// Server Default Route
app.get("/", (req, res) => {
  res.send("Hey..! Welcome to Quiz Test Server side.");
});

// Listen the server
app.listen(PORT, () => console.log("Server running on Port: ", PORT));

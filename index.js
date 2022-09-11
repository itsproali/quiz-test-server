const express = require('express');
const app = express()
PORT = process.env.PORT || 5000

app.get("/", (req, res) => {
    res.send("Hey..! Welcome to Quiz Test Server side.")
})

app.listen(PORT)
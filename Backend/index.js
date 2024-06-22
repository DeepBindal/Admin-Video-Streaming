const express = require('express');
const userRouter = require('./routes/userRoutes')
const videoRouter = require('./routes/videoRoutes');
const cors = require('cors');
const bodyParser = require('body-parser')
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json())

const port = 5000;

app.listen(port, () => {
    console.log(`listening at port ${port}`);
})

app.use("/auth", userRouter)
app.use("/api", videoRouter);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  });

app.get("/", (req, res) => {
    res.send("hello world")
})
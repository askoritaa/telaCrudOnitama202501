const express = require("express");
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3000;
const router = require("./routes/index");

app.use(cors());

router(app, express);
app.use(express.static("public"));

app.listen(port, (error) => {
    if (error) {
        console.log("error on server");
        return;
    }
    console.log(`server started on port ${port}`);
});


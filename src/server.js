const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const router = require("./routes/index");

router(app, express);
app.use(express.static("public"));

app.listen(port, (error) => {
    if (error) {
        console.log("error on server");
        return;
    }
    console.log(`server started on port ${port}`);
});


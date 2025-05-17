const routerSkin = require("./skins");
const routerBackground = require("./backgrounds");

module.exports = (app, express) => {
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));
    app.use(routerSkin);
    app.use(routerBackground);    
}

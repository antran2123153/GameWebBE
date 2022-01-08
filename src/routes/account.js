const router = require("express").Router();
const accountController = require("../controllers/accountController");

router.post("/login", accountController.login);

router.post("/register", accountController.register);

router.get("/", accountController.get);

router.delete("/", accountController.delete);

router.put("/", accountController.update);

module.exports = router;

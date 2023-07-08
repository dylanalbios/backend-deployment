const router = require("express").Router({ mergeParams: true });
const controller = require("./urls.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");
const usesRouter = require("../uses/uses.router");

router.use("/:urlId/uses", usesRouter);

router
    .route("/:urlId")
    .get(controller.recordUse)
    .put(controller.update)
    .all(methodNotAllowed);

router  
    .route("/")
    .post(controller.create)
    .get(controller.list)
    .all(methodNotAllowed);


module.exports = router;
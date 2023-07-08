const router = require("express").Router({ mergeParams: true });
const controller = require("./uses.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

router
  .route("/:useId")
  .get(controller.getUse)
  .delete(controller.delete)
  .all(methodNotAllowed);
  
router
  .route("/")
  .get(controller.getAllUses)
  .all(methodNotAllowed);

module.exports = router;

const { Router } = require("express");
const {
  createGroup,
  deleteGroup,
  updateGroup,
  getGroup,
  removeList,
} = require("../controller/group.controller");
const verifyJwt = require("../middleware/auth.middleware");

const router = Router();

router.use(verifyJwt);

router.route("/create").post(createGroup);
router.route("/delete/:group_id").delete(deleteGroup);
router.route("/update/:group_id").patch(updateGroup);
router.route("").get(getGroup);
router.route("/remove-list/:group_id").delete(removeList);

module.exports = router;

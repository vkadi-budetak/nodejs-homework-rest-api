const express = require("express");
const { validateBody, aunthenticate } = require("../../middlewares");
const { userJoiSchema, userSubscriptionSchema } = require("../../models/schema");

const router = express.Router();

const ctrl = require("../../models/user");

router.post("/register", validateBody(userJoiSchema), ctrl.registerUser);

router.post("/login", validateBody(userJoiSchema), ctrl.loginUser);

router.get("/current", aunthenticate, ctrl.getCurrentUser);

router.post("/logout", aunthenticate, ctrl.logoutUser);

router.patch(
  "/",
  aunthenticate,
  validateBody(userSubscriptionSchema),
  ctrl.updateSubscription
);

module.exports = router;

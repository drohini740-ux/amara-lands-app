const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {

    addProperty,
    getProperties,
    getProperty,
    updateProperty,
    deleteProperty

} = require("../controllers/propertyController");

// Add Property
router.post(
    "/",
    authMiddleware,
    addProperty
);

// Get All Properties
router.get(
    "/",
    authMiddleware,
    getProperties
);

// Get Single Property
router.get(
    "/:id",
    authMiddleware,
    getProperty
);

// Update Property
router.put(
    "/:id",
    authMiddleware,
    updateProperty
);

// Delete Property
router.delete(
    "/:id",
    authMiddleware,
    deleteProperty
);

module.exports = router;
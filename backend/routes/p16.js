const express = require("express");
const router = express.Router();

const P16Controller = require("../controllers/p16Controller");
const { authentication } = require("../middlewares/auth");

// ➕ create
router.post("/", authentication, P16Controller.create);

// 🔍 get semua
router.get("/", authentication, P16Controller.getAll);

// 🔥 GET BY PERKARA (INI YANG BIKIN 404 TADI)
router.get("/perkara/:id", authentication, P16Controller.getByPerkara);

// 🔍 detail
router.get("/:id", authentication, P16Controller.getById);

router.put("/:perkara_id", authentication, P16Controller.update);

router.get("/jaksa/:id", authentication, P16Controller.getByJaksa);
// ❌ delete (optional)
router.delete("/:id", authentication, P16Controller.delete);

module.exports = router;

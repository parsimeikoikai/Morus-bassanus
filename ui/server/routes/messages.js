const { addMessage, getMessages,deleteMessages } = require("../controllers/messageController");
const router = require("express").Router();

router.post("/addmsg/", addMessage);
router.post("/getmsg/", getMessages);
router.post("/deletemsg/", deleteMessages);
router.post("/deletemsg/", deleteMessages);

module.exports = router;

const Messages = require("../models/messageModel");

module.exports.getMessages = async (req, res, next) => {
  try {
    const { from, to } = req.body;

    const messages = await Messages.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });
    const projectedMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        question: msg.message.text,
        answer : msg.message.answer,
        sources: msg.message.sources
      };
    });
    res.json(projectedMessages);
  } catch (ex) {
    next(ex);
  }
};

module.exports.addMessage = async (req, res, next) => {
  try {
      const { from, to, message,resData } = req.body;
      const data = await Messages.create({
      message: { 
         text: message,
         answer : resData.answer,
         sources : resData.sources
         },
      users: [from, to],
      sender: from,
    });
    if (data) return res.json({ msg: "Message added successfully." });
    else return res.json({ msg: "Failed to add message to the database" });
  } catch (ex) {
    next(ex);
  }
};
module.exports.deleteMessages = async (req, res, next) => {
 
  try {
    const { sender} = req.body;

    const data = await Messages.deleteMany({
      $and: [
        {
          $or: [
            {
              sender: sender,
            }
          ],
        },
        {
          users: {
            $all: [sender],
          },
        }
      ],
    });

    // Handle the result of the delete operation if needed
    //console.log(`${data.deletedCount} messages deleted`);
    // Send a response to the client if desired
    res.status(200).json({ message: `${data.deletedCount} messages deleted` });
  } catch (ex) {
    next(ex);
  }
};


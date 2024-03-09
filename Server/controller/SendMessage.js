const { send } = require("process");
const client = require("../cassanndra-driver");
const crypto = require("crypto");

module.exports.SendMessage = async (socket, data) => {
  const { conversationid, message, last_counter, reply, sender, status } = data;
  const currentTimestamp = Date.now();
  const messageid = crypto.randomUUID();

  let lastcounter = parseInt(last_counter) + 1;

  if (reply === null) {
    await client
      .execute(
        "INSERT INTO messages (messageid, conversationid, createddate, message, order_sequence, sender, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [
          messageid,
          conversationid,
          new Date(currentTimestamp),
          message,
          lastcounter,
          sender,
          status,
        ],
        { prepare: true }
      )
      .then(async (result) => {
        await client.execute(
          "UPDATE conversation SET last_counter = ? WHERE conversationid = ?",
          [lastcounter, conversationid],
          { prepare: true }
        );
        socket.emit('messageSent', "Gui thanh cong");
      });
  } else {
    await client
      .execute(
        "INSERT INTO messages (messageid, conversationid, createddate, message, order_sequence, reply, sender, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [
          messageid,
          conversationid,
          new Date(currentTimestamp),
          message,
          lastcounter,
          reply,
          sender,
          status,
        ],
        { prepare: true }
      )
      .then(async (result) => {
        await client.execute(
          "UPDATE conversation SET last_counter = ? WHERE conversationid = ?",
          [lastcounter, conversationid],
          { prepare: true }
        );
        socket.emit('messageSent', "Gui thanh cong");
      });
  }
};

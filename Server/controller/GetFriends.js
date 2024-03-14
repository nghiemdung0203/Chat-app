const client = require("../cassanndra-driver");

module.exports.GetFriends = async (req, res) => {
  const user_id = req.query.user_id;
  try {
    const resultChats = await client.execute(
      `SELECT * FROM chats WHERE user_id = '${user_id}'` // No ALLOW FILTERING
    );

    const conversationIDs = resultChats.rows.map((row) => row.conversationid);

    const friendid = await client.execute(
      `SELECT * FROM chats WHERE conversationid IN ('${conversationIDs}') AND user_id != '${user_id}'` // Use != for efficient filtering with index
    );

    console.log(friendid);
  } catch (error) {
    console.error("Error retrieving records:", error);
    return res.status(500).send("Internal Server Error");
  }
};

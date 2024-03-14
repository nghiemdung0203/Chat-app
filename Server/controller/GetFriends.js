const client = require("../cassanndra-driver");

module.exports.GetFriends = async (req, res) => {
  const data = await client.execute("Select * from users");
  return res.status(200).send(data.rows);
};

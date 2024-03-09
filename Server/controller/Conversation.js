const client = require("../cassanndra-driver");
const crypto = require("crypto");

module.exports.Conversation = async (req, res) => {
  const { name } = req.body;
  const conversationid = crypto.randomUUID();
  const currentTimestamp = Date.now();
  try {
    await client
      .execute("Select * from users where email = ? ALLOW FILTERING", [name])
      .then(async (response) => {
        if (response.rows.length > 0) {
          await client
            .execute(
              "Select * from conversation where conversationname = ? ALLOW FILTERING",
              [name]
            )
            .then(async (result) => {
              if (result.rows.length > 0) {
                return res.status(200).send(result.rows[0]);
              } else {
                await client
                  .execute(
                    "INSERT INTO conversation (conversationid, conversationname, createddate,last_counter) VALUES (?, ?, ?, ?)",
                    [conversationid, name, new Date(currentTimestamp),1],
                    { prepare: true }
                  )
                  .then(async (ressult) => {
                    await client
                      .execute(
                        "Select * from conversation where conversationname = ? ALLOW FILTERING",
                        [name]
                      )
                      .then((ress) => {
                        if (ress.rows.length > 0) {
                          return res.status(200).send(ress.rows[0]);
                        }
                      });
                  });
              }
            });
        } else {
          return res.status(404).send("cannot find user");
        }
      });
  } catch (error) {
    return res.status(500).send(error.message);
  }
};

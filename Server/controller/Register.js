const client = require("../cassanndra-driver");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

module.exports.Register = async (req, res) => {
  const { Email, Password } = req.body;

  console.log(Email, Password);

  var salt = crypto.randomBytes(16).toString("hex");

  const user_id = crypto.randomUUID();

  const passHash = crypto
    .createHash("md5")
    .update(Password)
    .update(crypto.createHash("md5").update(salt, "utf-8").digest("hex"))
    .digest("hex");

  console.log(passHash);


  await client
    .execute("INSERT INTO users (user_id, Email, password, salt) VALUES (?, ?, ?, ?)", [
      user_id,
      Email,
      passHash,
      salt,
    ])
    .then(async(result) => {
      await client.execute('SELECT * from users WHERE Email = ? ALLOW FILTERING', [Email]).then((ress) => {
        let token = jwt.sign(
          { user_id: ress.rows[0].user_id, Email },
          "09f26e402586e2faa8da4c98a35f1b20d6b033c6097befa8be3486a829587fe2f90a832bd3ff9d42710a4da095a2ce285b009f0c3730cd9b8e1af3eb84df6611",
          { expiresIn: "24h" }
        );
        res.status(200).send(token);
      });
    })
    .catch((error) => {
      console.error("Error during login:", error);
      res.status(500).send("Login failed"); // Handle error gracefully
    });
};

const bcrypt = require("bcrypt");

const hash =
  "$2b$10$gTl.OFKfi54lENUIv77ezeWIfYPem9Oma.zsccI4P2mr8lYkYY1SW";

bcrypt.compare("Admin123", hash).then((result) => {
  console.log("Admin123 =>", result);
});

bcrypt.compare("123456", hash).then((result) => {
  console.log("123456 =>", result);
});

bcrypt.compare("password", hash).then((result) => {
  console.log("password =>", result);
});
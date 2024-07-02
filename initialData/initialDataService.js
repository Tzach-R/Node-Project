const { users, cards } = require("./initialData.json");
const { User } = require("../models/users.model");
const { Card } = require("../models/cards.model");
const bcrypt = require("bcrypt");
const chalk = require("chalk");
const _ = require("lodash");

if (require.main === module) {
  require("../configs/loadEnvs");

  require("../db/dbService")
    .connect()
    .then(seed)
    .catch(err => console.error(chalk.red("Database connection failed:", err)));
}

async function seed() {
  try {
    const [existingUsersCount, existingCardsCount] = await Promise.all([
      User.countDocuments(),
      Card.countDocuments()
    ]);

    if (existingUsersCount > 0 || existingCardsCount > 0) {
      console.log(chalk.magenta("The users and cards already exist"));
      return;
    }

    const createdUsers = await generateUsers();
    const firstBusinessUser = createdUsers.find(user => user.isBusiness);

    if (firstBusinessUser) {
      await generateCards(firstBusinessUser._id);
    }

    console.log(chalk.yellow("Seeding completed"));
  } catch (err) {
    console.error(chalk.red("Seeding failed:", err));
  }
}

async function generateUsers() {
  const userPromises = users.map(async user => {
    user.password = await bcrypt.hash(user.password, 12);
    return new User(user).save();
  });

  return Promise.all(userPromises);
}

async function generateCards(user_id) {
  const cardPromises = cards.map(card => {
    card.user_id = user_id;
    return new Card(card).save();
  });

  return Promise.all(cardPromises);
}

module.exports = { seed };

import user from "../models/user.js";
import UserSchema from "../models/user.js";

export default class userController {
  static getUser = async (req, res) => {
    try {
      const telegramId = req.query.telegramId;

      if (!telegramId) {
        return res.status(404).json({ message: "TelegramId is not definded" });
      }

      const userData = await UserSchema.find({ telegramId: telegramId });

      if (userData.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(userData);
    } catch (e) {
      console.log(e);
      res.status(500).json({ error: e, message: e.message });
    }
  };
  static updateSelectCity = async (req, res) => {
    try {
      const setCitySearch = req.body.setCitySearch;
      const telegramId = req.body.telegramId;

      if (!setCitySearch) {
        return res
          .status(404)
          .json({ message: "setCitySearch is not defined" });
      }

      const userData = await UserSchema.findOne({ telegramId: telegramId });

      if (!userData) {
        return res.status(404).json({ message: "User not found" });
      }

      userData.setCitySearch = setCitySearch;

      await userData.save();

      return res.status(200).json(userData);
    } catch (e) {
      console.log(e);
      res.status(500).json({ error: e, message: e.message });
    }
  };

  static updateUser = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      userName,
      phoneNumber,
      telegramId,
      role,
      email
    } = req.body;

    // Логирование для проверки данных

    // Находим пользователя по telegramId
    const user = await UserSchema.findOne({ telegramId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Проверяем уникальность email
    if (email) {
      const emailLower = email.toLowerCase();
      const emailExists = await UserSchema.findOne({
        email: emailLower,
        _id: { $ne: user._id },
      });
      if (emailExists) {
        return res
          .status(400)
          .json({ error: "Email already in use" });
      }
      user.email = emailLower;
    }

    // Обновляем информацию о пользователе
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (role) user.role = role;
    if (userName) user.userName = userName;

    await user.save();


    return res.status(200).json({ user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Возникла ошибка",
      details: err.message,
    });
  }
};


}

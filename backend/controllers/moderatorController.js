import ModeratorSchema from "../models/moderator.js";

export default class moderatorController {
  static addModerator = async (req, res) => {
    try {
      const { telegramId } = req.body;

      if (!telegramId) {
        return res.status(400).json({ message: "TelegramId is not defined" });
      }

      const moderator = new ModeratorSchema({ telegramId: telegramId });

      await moderator.save();

      res.status(201).json(moderator);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  };

  static getModerator = async (req, res) => {
    try {
      const { telegramId } = req.query;

      if (!telegramId) {
        return res.status(400).json({ message: "TelegramId is not defined" });
      }

      const moderator = await ModeratorSchema.findOne({ telegramId: telegramId });

      if (!moderator) {
        return res.status(404).json({ message: "Moderator not found" });
      }

      res.json(moderator);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  };

  static deleteModerator = async (req, res) => {
    try {
      const { telegramId } = req.query;

      if (!telegramId) {
        return res.status(400).json({ message: "TelegramId is not defined" });
      }

      const moderator = await ModeratorSchema.findOneAndDelete({ telegramId: telegramId });

      if (!moderator) {
        return res.status(404).json({ message: "Moderator not found" });
      }

      res.json({ message: "Moderator deleted successfully" });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  };
}

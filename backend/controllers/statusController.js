import StatusSchema from "../models/status.js";

export default class statusController {
  static addStatus = async (req, res) => {
    try {
      const { name, roleStatus } = req.query;

      if (!name) {
        return res.status(400).json({ message: "Status name is not defined" });
      }

      const status = new StatusSchema({ name: name, roleStatus: roleStatus });

      await status.save();

      res.status(201).json(status);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  };

  static getStatus = async (req, res) => {
    try {
      const { statusId } = req.query;

      if (!statusId) {
        const status = await StatusSchema.find();
        return res.status(200).json(status); // возвращаем статус 200
      }

      const status = await StatusSchema.findOne({ _id: statusId });

      if (!status) {
        return res.status(404).json({ message: "status not found" });
      }

      return res.json(status);
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: e.message });
    }
  };

  static deleteStatus = async (req, res) => {
    try {
      const { statusId } = req.query;

      if (!statusId) {
        return res.status(400).json({ message: "statusId is not defined" });
      }

      const status = await ModeratorSchema.findOneAndDelete({ _id: statusId });

      if (!status) {
        return res.status(404).json({ message: "status not found" });
      }

      res.json({ message: "status deleted successfully" });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  };
}

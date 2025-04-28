import CategorySсhema from "../models/category.js";

export default class categoryController {
  static addCategory = async (req, res) => {
    try {
      const { name, svgName, color } = req.query;
        console.log(name, svgName, color);
      if (!name) {
        return res.status(400).json({ message: "Error, check name" });
      }

      const category = new CategorySсhema({
        name: name,
        svgName: svgName,
        color: color,
      });

      await category.save();

      return res.status(201).json(category);
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: e.message });
    }
  };

  static getCategory = async (req, res) => {
    try {
      const { categoryId, city } = req.query;
  
      if (!categoryId) {
        const categories = await CategorySсhema.aggregate([
          {
            $lookup: {
              from: "artistrequests",
              let: { categoryId: "$_id" },
              pipeline: [
                {
                  $lookup: {
                    from: "users", // используем коллекцию "users"
                    localField: "artistId",
                    foreignField: "_id",
                    as: "artist",
                  },
                },
                { $unwind: "$artist" }, // развернем массив artist, чтобы упростить фильтрацию
                { $match: { $expr: { $in: ["$$categoryId", "$categoryId"] } } },
                { $match: { approved: true, isRejected: false } },
                { $match: { "artist.setCitySearch": city } }, // фильтрация по городу
              ],
              as: "artistRequests",
            },
          },
          {
            $lookup: {
              from: "customerrequests",
              let: { categoryId: "$_id" },
              pipeline: [
                {
                  $lookup: {
                    from: "users", // используем коллекцию "users"
                    localField: "customerId",
                    foreignField: "_id",
                    as: "customer",
                  },
                },
                { $unwind: "$customer" }, // развернем массив customer
                { $match: { $expr: { $eq: ["$categoryId", "$$categoryId"] } } },
                { $match: { approved: true, isReject: false } },
                { $match: { "customer.setCitySearch": city } }, // фильтрация по городу
              ],
              as: "customerRequests",
            },
          },
        ]);
        return res.json(categories);
      }
  
      const category = await CategorySсhema.aggregate([
        { $match: { _id: new mongoose.Types.ObjectId(categoryId) } },
        {
          $lookup: {
            from: "artistrequests",
            let: { categoryId: "$_id" },
            pipeline: [
              {
                $lookup: {
                  from: "users",
                  localField: "artistId",
                  foreignField: "_id",
                  as: "artist",
                },
              },
              { $unwind: "$artist" },
              { $match: { $expr: { $in: ["$$categoryId", "$categoryId"] } } },
              { $match: { approved: true, isRejected: false } },
              { $match: { "artist.setCitySearch": city } },
            ],
            as: "artistRequests",
          },
        },
        {
          $lookup: {
            from: "customerrequests",
            let: { categoryId: "$_id" },
            pipeline: [
              {
                $lookup: {
                  from: "users",
                  localField: "customerId",
                  foreignField: "_id",
                  as: "customer",
                },
              },
              { $unwind: "$customer" },
              { $match: { $expr: { $eq: ["$categoryId", "$$categoryId"] } } },
              { $match: { approved: true, isReject: false } },
              { $match: { "customer.setCitySearch": city } },
            ],
            as: "customerRequests",
          },
        },
        {
          $addFields: {
            countArtist: { $size: "$artistRequests" },
            countCustomer: { $size: "$customerRequests" },
          },
        },
        {
          $project: {
            artistRequests: 0, // Исключаем массив artistRequests из результата
            customerRequests: 0, // Исключаем массив customerRequests из результата
          },
        },
      ]);
  
      if (!category.length) {
        return res.status(404).json({ message: "Category not found" });
      }
  
      return res.json(category[0]);
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: e.message });
    }
  };
  

  static deleteCategory = async (req, res) => {
    try {
      const { categoryId, active } = req.query;

      if (!categoryId) {
        return res.status(400).json({ message: "categoryId is not defined" });
      }

      const category = await CategorySсhema.findOne({ _id: categoryId });

      if (!category) {
        return res.status(404).json({ message: "category not found" });
      }

      category.active = active;

      await category.save();

      return res.json({ message: "category deleted successfully" });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  };
}

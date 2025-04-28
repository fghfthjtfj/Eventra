import TarifSchema from "../models/tarif.js";
import SubscriptionSchema from "../models/subscription.js";

export default class tarifController {
  static addTarif = async (req, res) => {
    try {
      const { name, term, price } = req.body;

      const tarif = new TarifSchema({
        name: name,
        term: term,
        price: price
      });

      await tarif.save();

      return res.status(200).json(tarif)
    } catch (e) {
      console.log(e);
      res.status(500).json({ error: e, message: e.message });
    }
  };

static getTarif = async (req, res) => {
    try {
        const { id, userId } = req.query;

        if (id) {
            // Если есть id, возвращаем ОДИН тариф (объект)
            const tarif = await TarifSchema.findOne({ _id: id });
            return res.status(200).json(tarif);
        }

        let tarifs;
        if (!userId) {
            tarifs = await TarifSchema.find(); // Возвращаем массив тарифов
        } else {
            const hasSubscription = await SubscriptionSchema.exists({ userId });
            tarifs = hasSubscription
                ? await TarifSchema.find({ name: { $ne: "Пробный период" } })
                : await TarifSchema.find();
        }

        return res.status(200).json(tarifs);
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: e, message: e.message });
    }
};

}

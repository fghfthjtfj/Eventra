import SubscriptionSchema from "../models/subscription.js";

export default class subscriptionController {
  static addSubscription = async (req, res) => {
    try {
      const { userId, dateNow, dateExpression, nameSubscription } = req.body;
        console.log(userId, 'userId');
      const subCheck = await SubscriptionSchema.findOne({ userId: userId });

      if (subCheck) {
        subCheck.nameSubscription = nameSubscription;
        subCheck.dateNow = dateNow;
        subCheck.dateExpression = dateExpression;

        await subCheck.save();

        return res.status(200).json(subCheck.toObject());
      }

      const sub = new SubscriptionSchema({
        userId: userId,
        dateNow: dateNow,
        dateExpression: dateExpression,
        nameSubscription: nameSubscription,
      });

      await sub.save(); 

      return res.status(200).json(sub.toObject());
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: e.message });
    }
  };

  static getSubscription = async (req, res) => {
    try {
      const { userId } = req.query;
      

      const subscription = await SubscriptionSchema.findOne({ userId: userId });

      return res.json(subscription);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  };
}

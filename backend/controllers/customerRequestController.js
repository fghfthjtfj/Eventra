import CustomerRequestSchema from "../models/customerRequest.js";
import ModeratorSchema from "../models/moderator.js";
import axios from "axios";
import OrderSchema from "../models/order.js";
import ArtistRequestSchema from "../models/artistRequest.js";

export default class customerRequestController {
  static addCustomerRequest = async (req, res) => {
    try {
      const {
        city,
        customerId,
        categoryId,
        description,
        fee,
        date,
        time,
        guestCount,
        eventName,
      } = req.body;

      if (!city || !customerId || !categoryId) {
        return res.status(400).json({
          message:
            "Error, check city, artistId, categoryId, description, fee, startDate, endDate",
        });
      }

      const request = new CustomerRequestSchema({
        eventName,
        city,
        customerId,
        categoryId,
        description,
        fee,
        date,
        time,
        guestCount,
      });

      const moderators = await ModeratorSchema.find({}).select("telegramId");

      await this.sendTelegramNotification(moderators);

      await request.save();

      return res.status(201).json(request);
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: e.message });
    }
  };

  static sendTelegramNotification = async (moderators, isEditing = false) => {
    try {
      const { unapproved_count } = await this.getUnapprovedCustomerRequests();

      for (const moderator of moderators) {
        await axios.post(
          `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
          {
            chat_id: moderator.telegramId,
            text: `Пришла новая заявка от <b>Заказчика.</b>\n\nВсего сейчас непроверенных заявок исполнителей: <b>${
              isEditing ? unapproved_count : unapproved_count + 1
            }</b>`,
            parse_mode: "HTML",
          }
        );
      }
    } catch (e) {
      console.error(e);
      return { error: e.message };
    }
  };

  static getUnapprovedCustomerRequests = async () => {
    try {
      const data = await CustomerRequestSchema.countDocuments({
        approved: false,
      });

      return { unapproved_count: data };
    } catch (e) {
      console.error(e);
      return { error: e.message };
    }
  };

  static getCustomerRequest = async (req, res) => {
    try {
      const { requestId, customerId, categoryId } = req.query;

      if (categoryId) {
        const request = await CustomerRequestSchema.find({
          categoryId: categoryId,
          approved: true,
          order: false,
        })
          .populate("categoryId")
          .populate("customerId");
        return res.json(request);
      }

      if (requestId) {
        const request = await CustomerRequestSchema.findOne({ _id: requestId })
          .populate("categoryId")
          .populate("customerId");
        return res.json(request);
      }

      if (customerId) {
        const request = await CustomerRequestSchema.find({
          customerId: customerId,
          order: false,
        })
          .populate("categoryId")
          .populate("customerId");
        return res.json(request);
      }
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  };

  static deleteCustomerRequest = async (req, res) => {
    try {
      const { requestId } = req.query;

      if (!requestId) {
        return res.status(400).json({ message: "requestId is not defined" });
      }

      const order = await OrderSchema.findOne({ customerRequestId: requestId });

      if (order) {
        await OrderSchema.findOneAndDelete({ customerRequestId: requestId });

        const { artistRequestId } = order;

        const customerId = await CustomerRequestSchema.findOne({
          _id: requestId,
        })
          .select("customerId eventName")
          .populate("customerId");

        const artistId = await ArtistRequestSchema.findOne({
          _id: artistRequestId,
        })
          .select("artistId")
          .populate("artistId");

        try {
          await axios.post(
            `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
            {
              chat_id: artistId.artistId.telegramId,
              text: `Заказчик <a href="https://t.me/${
                customerId.customerId.userName
              }">${customerId.customerId.firstName} ${
                customerId.customerId.lastName
              }</a> отменил заявку ${customerId.eventName}\nВозможно, событие больше неактуально😢`,
              parse_mode: "HTML",
            }
          );
        } catch (e) {
          console.error(e);
          return { error: e.message };
        }
      }

      const request = await CustomerRequestSchema.findOneAndDelete({
        _id: requestId,
      });

      if (!request) {
        return res.status(404).json({ message: "request not found" });
      }

      res.json({ message: "request deleted successfully" });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  };

  static updateCustomerRequest = async (req, res) => {
    try {
      const {
        eventName,
        requestId,
        city,
        categoryId,
        description,
        fee,
        date,
        time,
        guestCount,
        approved,
        isReject,
      } = req.body;

      const request = await CustomerRequestSchema.findOne({ _id: requestId });

      if (!request) {
        return res.status(404).json({ error: "request not found" });
      }
      if (isReject !== null && isReject !== undefined)
        request.isReject = isReject;
      if (approved !== null && isReject !== undefined)
        request.approved = approved;
      if (categoryId) request.categoryId = categoryId;
      if (description) request.description = description;
      if (city) request.city = city;
      if (fee) request.fee = fee;
      if (date) request.date = date;
      if (time) request.time = time;
      if (guestCount) request.guestCount = guestCount;
      if (eventName) request.eventName = eventName;

      const moderators = await ModeratorSchema.find({}).select("telegramId");

      await request.save();

      await this.sendTelegramNotification(moderators, true);

      return res.status(200).json({ request });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Возникла ошибка" });
    }
  };
}

import ReviewShema from "../models/review.js";
import ModeratorSchema from "../models/moderator.js";
import axios from "axios";
import OrderSchema from "../models/order.js";

export default class reviewController {
  static addReview = async (req, res) => {
    try {
      const { customerId, artistId, reviewText, grade, reviewTitle, orderId } = req.body;

      if (!customerId || !artistId || !grade || !reviewTitle || !orderId) {
        return res
          .status(400)
          .json({
            message: "Error, check  customerId, artistId, reviewText, grade",
          });
      }

      const review = new ReviewShema({
        customerId: customerId,
        artistId: artistId,
        reviewText: reviewText,
        grade: grade,
        reviewTitle: reviewTitle
      });

      const order = await OrderSchema.findOne({_id: orderId})

      order.review = true

      await order.save()

      const moderators = await ModeratorSchema.find({}).select('telegramId')

      await this.sendTelegramNotification(moderators);

      await review.save();

      return res.status(201).json(review);
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: e.message });
    }
  };

  static sendTelegramNotification = async (moderators) => {
    try {
      const { unapproved_count } = await this.getUnapprovedArtistRequests();

      for (const moderator of moderators) {
        await axios.post(
          `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
          {
            chat_id: moderator.telegramId,
            text: `Пришел новый <b>отзыв</b> от <b>Заказчика.</b>\n\nВсего сейчас непроверенных отзывов: <b>${unapproved_count + 1}</b>`,
            parse_mode: "HTML",
          }
        );
      }
    } catch (e) {
      console.error(e);
      return { error: e.message };
    }
  };

  static getUnapprovedArtistRequests = async () => {
    try {
      const data = await ReviewShema.countDocuments({
        approved: false,
      });

      return { unapproved_count: data };
    } catch (e) {
      console.error(e);
      return { error: e.message };
    }
  };

  static getReview = async (req, res) => {
    try {
      const { reviewId, artistId } = req.query;

      if (!reviewId && !artistId) {
        const reviews = await ReviewShema.find()
          .populate("customerId")
          .populate("artistId");
        return res.json(reviews);
      }

      if (artistId) {
        const reviews = await ReviewShema.find({ artistId: artistId })
          .populate("customerId")
          .populate("artistId");
        return res.json(reviews);
      }

      const review = await ReviewShema.findOne({ _id: reviewId })
        .populate("customerId")
        .populate("artistId");

      if (!review) {
        return res.status(404).json({ message: "Review not found" });
      }

      return res.json(review);
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  };

  static deleteReview = async (req, res) => {
    try {
      const { reviewId } = req.query;

      if (!reviewId) {
        return res.status(400).json({ message: "reviewId is not defined" });
      }

      const review = await ReviewShema.findOneAndDelete({ _id: reviewId });

      if (!review) {
        return res.status(404).json({ message: "review not found" });
      }

      return res.json({ message: "review deleted successfully" });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: e.message });
    }
  };

  static updateReview = async (req, res) => {
    try {
      const { reviewId } = req.body;

      const review = await ReviewShema.findOne({ _id: reviewId });

      if (!review) {
        return res.status(404).json({ error: "review not found" });
      }

      review.approved = true;

      await review.save();

      return res.status(200).json({ review });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Возникла ошибка" });
    }
  };
}

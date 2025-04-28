import ArtistRequestSchema from "../models/artistRequest.js";
import UserSchema from "../models/user.js";
import ModeratorSchema from "../models/moderator.js";
import axios from "axios";

export default class artistRequestController {
static addArtistRequest = async (req, res) => {
  try {
    const {
      city,
      artistId,
      categoryId,
      description,
      priceFrom,
      priceTo, // Диапазон цен из запроса
      approved,
      mainPhoto,
      backGroundPhoto,
      photo,
      link_video,
      vk,
      instagram,
      youtube,
      tiktok,
    } = req.body;

    // Проверка обязательных полей
    if (!city || !artistId || !categoryId) {
      return res.status(400).json({
        message: "Error, check city, artistId, categoryId, description",
      });
    }

    // Обработка цен
    let writePrice = null;

    if (priceFrom) {
      const cleanPriceFrom = priceFrom.replace(/\D/g, "");
      const from = parseInt(cleanPriceFrom, 10);

      if (isNaN(from)) {
        return res.status(400).json({
          error: "Invalid price format",
          message: "PriceFrom must be a valid number.",
        });
      }

      if (priceTo) {
        const cleanPriceTo = priceTo.replace(/\D/g, "");
        const to = parseInt(cleanPriceTo, 10);

        if (isNaN(to)) {
          return res.status(400).json({
            error: "Invalid price format",
            message: "PriceTo must be a valid number.",
          });
        }

        if (from >= to) {
          return res.status(400).json({
            error: "Invalid price range",
            message: "PriceFrom must be less than PriceTo.",
          });
        }

        writePrice = `${from} - ${to}`;
      } else {
        writePrice = `${from}`; // ← Исправление: сохраняем нижнюю границу, если верхней нет
      }
    }


    // Создание нового запроса
    const request = new ArtistRequestSchema({
      city,
      artistId,
      categoryId,
      description: description.replace(/\n/g, '<br>'), // Заменяем \n на <br>
      price: writePrice,
      approved,
      mainPhoto,
      backGroundPhoto,
      photo,
      link_video,
      vk,
      instagram,
      youtube,
      tiktok,
    });

    // Поиск модераторов для уведомлений
    const moderators = await ModeratorSchema.find({}).select("telegramId");

    if (moderators.length > 0) {
      // Проверяем, есть ли модераторы, и отправляем уведомление
      await this.sendTelegramNotification(moderators.map((mod) => mod.telegramId));
    }

    // Сохраняем запрос в базу
    await request.save();

    return res.status(201).json(request);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e.message });
  }
};


  static sendTelegramNotification = async (moderators, isEditing=false) => {
    try {
      const { unapproved_count } = await this.getUnapprovedArtistRequests();

      for (const moderator of moderators) {
        await axios.post(
          `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
          {
            chat_id: moderator.telegramId,
            text: `Пришла новая заявка от <b>Исполнителя.</b>\n\nВсего сейчас непроверенных заявок исполнителей: <b>${isEditing ? unapproved_count : unapproved_count + 1}</b>`,
            parse_mode: "HTML",
          }
        );
      }
    } catch (e) {
      console.error(e);
      return { error: e.message };
    }
  };

  static deleteArtistRequest = async (req, res) => {
    try {
      const { requestId } = req.query;

      if (!requestId) {
        return res.status(400).json({ message: "requestId is not defined" });
      }

      const request = await ArtistRequestSchema.findOneAndDelete({
        _id: requestId,
      });

      if (!request) {
        return res.status(404).json({ message: "request not found" });
      }

      res.json({ message: "request deleted successfully" });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: e.message });
    }
  };

    static updateArtistRequest = async (req, res) => {
      try {
        const {
          requestId,
          city,
          categoryId,
          description,
          priceFrom,
          priceTo, // Добавляем диапазон цен
          approved,
          mainPhoto,
          backGroundPhoto,
          photo,
          link_video,
          vk,
          instagram,
          youtube,
          tiktok,
        } = req.body;

        const request = await ArtistRequestSchema.findOne({ _id: requestId });

        if (!request) {
          return res.status(404).json({ error: "Request not found" });
        }

        // Обнуляем статусы одобрения
        request.approved = false;
        request.isRejected = false;

        // Обработка цен
        // Обработка цен
        if (priceFrom) {
          const cleanPriceFrom = priceFrom.replace(/\D/g, "");
          const from = parseInt(cleanPriceFrom, 10);

          if (isNaN(from)) {
            return res.status(400).json({
              error: "Invalid price format",
              message: "PriceFrom must be a valid number.",
            });
          }

          if (priceTo) {
            const cleanPriceTo = priceTo.replace(/\D/g, "");
            const to = parseInt(cleanPriceTo, 10);

            if (isNaN(to)) {
              return res.status(400).json({
                error: "Invalid price format",
                message: "PriceTo must be a valid number.",
              });
            }

            if (from >= to) {
              return res.status(400).json({
                error: "Invalid price range",
                message: "PriceFrom must be less than PriceTo.",
              });
            }

            request.price = `${from} - ${to}`;
          } else {
            request.price = `${from}`;
          }
        }


        // Обновляем остальные поля
        if (categoryId) request.categoryId = categoryId;
        if (description) request.description = description;
        if (mainPhoto) request.mainPhoto = mainPhoto;
        if (backGroundPhoto) request.backGroundPhoto = backGroundPhoto;
        if (photo) request.photo = photo;
        if (link_video) request.link_video = link_video;
        if (vk) request.vk = vk;
        if (instagram) request.instagram = instagram;
        if (youtube) request.youtube = youtube;
        if (tiktok) request.tiktok = tiktok;
        if (city) request.city = city;

        // Отправляем уведомление модераторам
        const moderators = await ModeratorSchema.find({}).select("telegramId");
        if (moderators.length > 0) {
          try {
            await this.sendTelegramNotification(moderators, true);
          } catch (notificationError) {
            // Логируем ошибку и продолжаем выполнение
            console.error("Error sending notification:", notificationError.message || notificationError);
          }
        }

        // Сохраняем обновленный запрос
        await request.save();

        return res.status(200).json({ request });
      } catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Возникла ошибка" });
      }
    };


  static getArtistRequest = async (req, res) => {
    try {
      const { requestId, artistId, categoryId } = req.query;

      if (categoryId) {
        const request = await ArtistRequestSchema.find({
          categoryId: categoryId,
          approved: true,
          isRejected: false
        })
          .populate("categoryId")
          .populate("artistId");
        return res.json(request);
      }

      if (requestId) {
        const request = await ArtistRequestSchema.findOne({ _id: requestId })
          .populate("categoryId")
          .populate("artistId");
        return res.json(request);
      }

      if (artistId) {
        const request = await ArtistRequestSchema.find({ artistId: artistId })
          .populate("categoryId")
          .populate("artistId");
        return res.json(request);
      }
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: e.message });
    }
  };

  static getUnapprovedArtistRequests = async () => {
    try {
      const data = await ArtistRequestSchema.countDocuments({
        approved: false,
      });

      return { unapproved_count: data };
    } catch (e) {
      console.error(e);
      return { error: e.message };
    }
  };
}

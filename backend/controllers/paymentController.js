import crypto from "crypto";
import PaymentSchema from "../models/payment_data.js"; // Убедитесь, что путь к модели правильный
import UserSchema from "../models/user.js"; // Убедитесь, что путь к модели правильный
import SubscriptionSchema from "../models/subscription.js"; // Убедитесь, что путь к модели правильный

export default class paymentController {
  // Метод для создания платежной записи
  static createPaymentNote = async (req, res) => {
    try {
      const { user_email, price, tarif_name } = req.body; // Используем req.body, если данные отправляются в теле запроса
      console.log(user_email, price);

      // Проверка обязательных полей
      if (!user_email || price == null || !tarif_name) {
        console.error("Missing required fields in payment note request", { user_email, price, tarif_name });
        return res.status(400).send("Missing required fields");
      }
      const normalizedEmail = user_email.toLowerCase();

      if (tarif_name == 'Пробный период'){
          await addSubscription(normalizedEmail, tarif_name);
      }
        const newPayment = new PaymentSchema({
          user_email: normalizedEmail,
          price,
          date: new Date(),
          tarif_name,
        });
        await newPayment.save();

      console.log("Payment note created successfully:", newPayment);
      res.status(201).send({ message: "Payment note created", payment: newPayment });
    } catch (err) {
      console.error("Error creating payment note:", err);
      res.status(500).send("Internal server error");
    }
  };

  // Метод для обработки вебхуков
  static handleWebhook = async (req, res) => {
    try {
        console.log(req);
      const secretKey = process.env.PAYMENT_SECRET_KEY; // Секретный ключ из .env
      const { id, hash, timestamp, event_name, payload } = req.body; // Обычно вебхуки отправляют данные в теле запроса


      // Преобразуем payload из строки в объект
      const email = payload.user_email;

        console.log(email);
      // Проверка обязательных полей
      if (!id || !hash || !timestamp || !event_name || !payload || !email) {
        console.error("Missing required fields in webhook request", { id, hash, timestamp, event_name, payload });
        return res.status(400).send("Missing required fields");
      }

      // Соединение полей для вычисления подписи
      const concatenatedString = `${secretKey}&${id}&${timestamp}`;

      // Вычисление подписи (sha1)
      const computedHash = crypto.createHash("sha1").update(concatenatedString).digest("hex");

      // Сравнение подписи
      if (hash !== computedHash) {
        console.error("Invalid webhook signature");
        console.error("Expected Hash:", computedHash);
        console.error("Received Hash:", hash);
        return res.status(400).send("Invalid signature");
      }

      // Рассчитываем временной диапазон в 1 час
      const timestampStart = new Date((timestamp - 3600) * 1000); // Начало диапазона (-1 час)
      const timestampEnd = new Date(timestamp * 1000); // Конец диапазона

      // Поиск записей по email и диапазону времени
      const record = await PaymentSchema.findOne({
        user_email: email,
        date: { $gte: timestampStart, $lte: timestampEnd }, // Диапазон времени
      }).sort({ date: -1 }); // Получаем последнюю запись по времени
        const subscription_name = record.tarif_name

      if (!record) {
        console.error("No matching record found");
        return res.status(404).send("No matching record found");
      }

      console.log("Found record:", record);

      // Обработка событий
      switch (event_name) {
        case "payment_accepted":
          console.log(`Payment accepted: ${record._id}`);
          await PaymentSchema.findByIdAndUpdate(record._id, { status: "accepted" });
          await addSubscription(email, subscription_name);
          console.log('завершение оплаты');
          break;
        case "payment_failed":
          console.log(`Payment failed: ${record._id}`);
          await PaymentSchema.findByIdAndUpdate(record._id, { status: "failed" });
          break;
        default:
          console.log(`Unhandled event: ${event_name}`);
      }

      res.status(200).send("Webhook processed successfully");
    } catch (err) {
      console.error("Error processing webhook:", err);
      res.status(500).send("Internal server error");
    }
  };
}


const addSubscription = async (user_email, nameSubscription) => {
    console.log('создание подписки')
    console.log(user_email);
  try {
    let dateExpression = new Date();
    if (nameSubscription === 'Пробный период') {
      dateExpression.setDate(dateExpression.getDate() + 3);
    } else if (nameSubscription === 'Премиум 1 месяц') {
      dateExpression.setMonth(dateExpression.getMonth() + 1);
    } else if (nameSubscription === 'Премиум 3 месяца') {
      dateExpression.setMonth(dateExpression.getMonth() + 3);
    } else if (nameSubscription === 'Премиум 12 месяцев') {
      dateExpression.setMonth(dateExpression.getMonth() + 12);
    }

    const dateNow = new Date().toISOString();
    dateExpression = dateExpression.toISOString();

    const user = await UserSchema.findOne({ email: user_email });
    console.log(user);
    if (!user) throw new Error("User not found");

    const subCheck = await SubscriptionSchema.findOne({ userId: user._id });
    if (subCheck) {
        console.log('подписка уже есть')
      subCheck.nameSubscription = nameSubscription;
      subCheck.dateNow = dateNow;
      subCheck.dateExpression = dateExpression;
      await subCheck.save();
      return subCheck.toObject();
    }

    const sub = new SubscriptionSchema({
      userId: user._id,
      dateNow: dateNow,
      dateExpression: dateExpression,
      nameSubscription: nameSubscription,
    });
    console.log('создано');
    await sub.save();
    return sub.toObject();
  } catch (err) {
    console.error("Error in addSubscription:", err);
    throw err;
  }
};

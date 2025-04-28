import PromoSchema from "../models/promo.js";
import mongoose from "mongoose";

export default class promoController {
  static addPromo = async (req, res) => {
    try {
      const { promo, count, tarifs } = req.body;

      const promocode = new PromoSchema({
        promo: promo,
        count: count,
        tarifs: tarifs,
      });

      await promocode.save();

      return res.status(200).json(promocode);
    } catch (e) {
      console.log(e);
      return res.status(500).json({ error: e, message: e.message });
    }
  };

  static updatePromo = async (req, res) => {
    try {
      const id = req.body.id;
      const promo = await PromoSchema.findOne({ _id: id });

      promo.count -= 1;

      await promo.save();

      return res.status(200).json(promo);
    } catch (e) {
      console.log(e);
      return res.status(500).json({ error: e, message: e.message });
    }
  };

  static getPromo = async (req, res) => {
    try {
      const { promo, tarif } = req.query;
  
      const promocode = await PromoSchema.findOne({ promo });
  
      if (!promocode || promocode.count < 1 || !promocode.tarifs.some(tarifId => tarifId.equals(new mongoose.Types.ObjectId(tarif)))) {
        return res.status(404).json({ error: "Promo not valid or tarif not included" });
      }
  
      await promocode.save();
  
      return res.status(200).json(promocode);
      
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: e.message });
    }
  };
  
}

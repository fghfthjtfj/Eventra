import logging

from core.databases.mongodb.base import BaseDb

from core.databases.mongodb.user.model import User

from bson import ObjectId
import pprint


class PromosController():
    def __init__(self, db_ins):
        self.db = db_ins.db
        self.collection = self.db["promos"]

    async def add_promo(self, promo_name, count, tarifs, discount_value, discount_type) -> bool:
        if discount_type == "Процент":
            await self.collection.insert_one({'promo': promo_name, 'count': count, 'tarifs': tarifs, 'percentPrice': discount_value})
        else:
            await self.collection.insert_one({'promo': promo_name, 'count': count, 'tarifs': tarifs, 'fixPrice': discount_value})
        
        logging.info(f"Promo {promo_name} added successfully!")

    async def get_promos(self):
        promos = await self.collection.find({"count": {"$gt": 0}}).to_list(length=None)
        
        all_tarifs = await self.db['tarifs'].find({"name": {"$ne": "Пробный период"}}).to_list(length=None)

        tarif_dict = {str(tarif['_id']): tarif for tarif in all_tarifs}

        for promo in promos:
            promo['associated_tarifs'] = [tarif_dict.get(str(tarif_id)) 
                                        for tarif_id in promo.get('tarifs', []) 
                                        if str(tarif_id) in tarif_dict]
            
        return promos

        

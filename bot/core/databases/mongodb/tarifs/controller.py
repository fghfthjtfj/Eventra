import logging

from core.databases.mongodb.base import BaseDb

from core.databases.mongodb.user.model import User


class TarifsController():
    def __init__(self, db_ins):
        self.db = db_ins.db
        self.collection = self.db["tarifs"]

    async def get_all_tarifs(self):
        return await self.collection.find({"name": {"$ne": "Пробный период"}}).to_list(length=None)

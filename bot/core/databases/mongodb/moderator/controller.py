import logging

from core.databases.mongodb.base import BaseDb

from core.databases.mongodb.moderator.model import Moderator

import pprint

class ModeratorController():
    def __init__(self, db_ins):
        self.db = db_ins.db
        self.collection = self.db["moderators"]

    async def is_moderator(self, telegramId: int) -> bool:
        logging.info('request to db to find out if the user is a moderator')

        return bool(await self.collection.find_one({'telegramId': str(telegramId)}))
    
    async def get_moderators(self):
        logging.info('request to db to get all moderators')

        moderators = self.collection.find({})
        
        populated_requests = []

        for moderator in await moderators.to_list(length=None):
            telegram_id = moderator.get("telegramId")

            if telegram_id:
                details = await self.db["users"].find_one({"telegramId": telegram_id}, {"userName": 1, 'firstName': 1, 'lastName': 1})

                if details:
                    moderator["moderatorDetails"] = details


            populated_requests.append(moderator)
        
        return populated_requests

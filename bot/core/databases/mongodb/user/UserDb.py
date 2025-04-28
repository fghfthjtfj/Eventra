import logging

from core.databases.mongodb.base import BaseDb

from core.databases.mongodb.user.model import User


class UserController():
    def __init__(self, db_ins):
        self.db = db_ins.db
        self.collection = self.db["users"]

    async def add_user(self, telegramId: int, username: str) -> bool:
        new_user = User(userName=username, telegramId=telegramId)
        
        await self.collection.insert_one(new_user.dict())
        
        logging.info(f"User {username} added successfully!")

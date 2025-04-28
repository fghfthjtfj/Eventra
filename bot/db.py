import logging

from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import DuplicateKeyError

class Db:
    def __init__(self, db_url, db_name):
        self.client = AsyncIOMotorClient(db_url)
        self.db = self.client[db_name]

    async def initialize(self):
        try:
            await self.client.admin.command('ping')
            print("Pinged your deployment. You successfully connected to MongoDB!")
        except Exception as e:
            print(e)

    async def add_user(self, telegramId: int, phoneNumber: str, username: str) -> bool:
        user_collection = self.db['users']
        new_user = {
            'telegramId': telegramId,
            'phoneNumber': phoneNumber,
            'username': username
        }
        try:
            await user_collection.insert_one(new_user)
            logging.info(f"User {username} added successfully!")
            return True
        except DuplicateKeyError as e:
            logging.error(f"Duplicate key error: {e.details}")
            return False
        except Exception as e:
            logging.error(f"An error occurred while adding the user: {e}")
            return False
    
    async def get_all_users(self):
        user_collection = self.db['users']
        try:
            all_users = await user_collection.find({}).to_list(length=None)
            logging.info(f"Loaded all users")
            return all_users
        except Exception as e:
            logging.error(f"An error occurred while fetching users: {e}")
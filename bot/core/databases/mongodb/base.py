import logging

from motor.motor_asyncio import AsyncIOMotorClient


class BaseDb:
    _instance = None

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super().__new__(cls)
        return cls._instance

    def __init__(self, db_url=None):
        if not hasattr(self, "initialized"):
            if db_url is None:
                raise ValueError("db_url must be provided for the first initialization")
            self.client = AsyncIOMotorClient(db_url)
            self.db = self.client.test
            self.initialized = True

    async def initialize(self):
        try:
            await self.db.command("ping")
            logging.info(
                "Pinged your deployment. You successfully connected to MongoDB!"
            )
        except Exception as e:
            logging.error(f"An error occurred: {e}")

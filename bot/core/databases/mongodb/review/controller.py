import logging
from bson import ObjectId

from core.databases.mongodb.base import BaseDb

from core.databases.mongodb.moderator.model import Moderator

class ReviewController():
    def __init__(self, db_ins):
        self.db = db_ins.db
        self.collection = self.db["reviews"]


    async def accept_review(self, review_id):
        logging.info('request to db to change approved review\'s status')

        result = await self.collection.find_one_and_update(
            {'_id': review_id},
            {'$set': {'approved': True}},
            return_document=True
        )

        if result:
            logging.info(f'{review_id} has been approved.')
        else:
            logging.warning(f'{review_id} not found.')

    async def reject_review(self, review_id):
        logging.info('request to db to change reject review\'s status')

        result = await self.collection.delete_one({'_id': review_id})

        if result:
            logging.info(f'{review_id} has been deleted.')
        else:
            logging.warning(f'{review_id} not found.')

    async def get_unapproved_reviews(self):
        logging.info('request to db to get all unapproved reviews')

        reviews = self.collection.find({"approved": False})

        populated_requests = []
        for review in await reviews.to_list(length=None):
            customer_id = review.get("customerId")
            artist_id = review.get('artistId')

            if artist_id:
                artist = await self.db["users"].find_one({"_id": ObjectId(artist_id)})

                if artist:
                    review["artistDetails"] = artist

            if customer_id:
                customer = await self.db["users"].find_one({"_id": ObjectId(customer_id)})

                if customer:
                    review["customerDetails"] = customer


            populated_requests.append(review)

        return populated_requests

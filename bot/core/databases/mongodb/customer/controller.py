import logging
from bson import ObjectId

from core.databases.mongodb.base import BaseDb

from core.databases.mongodb.moderator.model import Moderator

import pprint

class CustomerController():
    def __init__(self, db_ins):
        self.db = db_ins.db
        self.collection = self.db["customerrequests"]


    async def accept_customer_request(self, request_id):
        logging.info('request to db to change approved customer\'s status')

        result = await self.collection.find_one_and_update(
            {'_id': request_id},
            {'$set': {'approved': True}},
            return_document=True
        )

        if result:
            logging.info(f'{request_id} has been approved.')
        else:
            logging.warning(f'{request_id} not found.')

    async def reject_customer_request(self, request_id):
        logging.info('request to db to change reject customer\'s status')

        result = await self.collection.find_one_and_update(
            {'_id': request_id},
            {'$set': {'isReject': True}},
            return_document=True
        )

        if result:
            logging.info(f'{request_id} has been rejected.')
        else:
            logging.warning(f'{request_id} not found.')

    async def get_unapproved_customer_requests(self):
        logging.info('request to db to get all unapproved customer requests')

        customer_requests = self.collection.find({"approved": False, "isReject": False})

        populated_requests = []
        for request in await customer_requests.to_list(length=None):
            customer_id = request.get("customerId")
            if customer_id:
                user = await self.db["users"].find_one({"_id": ObjectId(customer_id)})
                
                categories = []

                for categoryId in request.get('categoryId'):
                    category = await self.db['categories'].find_one(ObjectId(categoryId), {"name": 1, "_id": 0})
                    categories.append(category)

                if category:
                    request['categoriesName'] = categories

                if user:
                    request["artistDetails"] = user
            populated_requests.append(request)

        return populated_requests

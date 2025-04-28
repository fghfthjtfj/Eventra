import logging
from bson import ObjectId

from core.databases.mongodb.base import BaseDb

from core.databases.mongodb.moderator.model import Moderator

class ArtistController():
    def __init__(self, db_ins):
        self.db = db_ins.db
        self.collection = self.db["artistrequests"]


    async def accept_artist_request(self, request_id):
        logging.info('request to db to change approved artist\'s status')

        result = await self.collection.find_one_and_update(
            {'_id': request_id},
            {'$set': {'approved': True}},
            return_document=True
        )

        if result:
            logging.info(f'{request_id} has been approved.')
        else:
            logging.warning(f'{request_id} not found.')

    async def reject_artist_request(self, request_id):
        logging.info('request to db to change reject artist\'s status')

        result = await self.collection.find_one_and_update(
            {'_id': request_id},
            {'$set': {'isRejected': True}},
            return_document=True
        )

        if result:
            logging.info(f'{request_id} has been rejected.')
        else:
            logging.warning(f'{request_id} not found.')

    async def get_unapproved_artist_requests(self):
        logging.info('request to db to get all unapproved artist requests')

        artist_requests = self.collection.find({"approved": False, "isRejected": False})

        populated_requests = []
        for request in await artist_requests.to_list(length=None):
            artist_id = request.get("artistId")
            if artist_id:
                user = await self.db["users"].find_one({"_id": ObjectId(artist_id)})
                
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

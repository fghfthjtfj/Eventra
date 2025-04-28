from typing import Any
from aiogram.filters import Filter
from aiogram.types import Message

from core.databases.mongodb.moderator.controller import ModeratorController 

class AdminFilter(Filter):
    async def __call__(self, message: Message, _moderator_controller: ModeratorController):
        return await _moderator_controller.is_moderator(message.from_user.id)
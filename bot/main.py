import asyncio
import logging
import sys

from aiogram import Bot, Dispatcher, html
from aiogram.client.default import DefaultBotProperties
from aiogram.enums import ParseMode

from core.handlers.user_handler import user_router
from core.handlers.admin_handler import admin_router

from core.databases.mongodb.base import BaseDb
from core.databases.mongodb.user.UserDb import UserController
from core.databases.mongodb.moderator.controller import ModeratorController
from core.databases.mongodb.artist.controller import ArtistController
from core.databases.mongodb.customer.controller import CustomerController
from core.databases.mongodb.review.controller import ReviewController
from core.databases.mongodb.promos.controller import PromosController
from core.databases.mongodb.tarifs.controller import TarifsController

from config import BOT_TOKEN, DB_CONNECTION_STRING


async def main() -> None:
    dp = Dispatcher()

    base_db = BaseDb(db_url=DB_CONNECTION_STRING)

    try:
        await base_db.initialize()
    except Exception as e:
        print(f"Failed to initialize database: {e}")
        return

    # CONTROLLERS
    user_controller = UserController(base_db)
    moderator_controller = ModeratorController(base_db)
    artist_controller = ArtistController(base_db)
    customer_controller = CustomerController(base_db)
    review_controller = ReviewController(base_db)
    promos_controller = PromosController(base_db)
    tarifs_controller = TarifsController(base_db)

    bot = Bot(token=BOT_TOKEN, default=DefaultBotProperties(parse_mode=ParseMode.HTML))

    dp.include_routers(user_router, admin_router)

    await dp.start_polling(
        bot,
        _user_controller=user_controller,
        _moderator_controller=moderator_controller,
        _artist_controller=artist_controller,
        _customer_controller=customer_controller,
        _review_controller=review_controller,
        _promos_controller=promos_controller,
        _tarifs_controller = tarifs_controller
    )


if __name__ == "__main__":
    logging.basicConfig(level=logging.ERROR, stream=sys.stdout)

    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("Exited")
    except Exception as e:
        print(e)

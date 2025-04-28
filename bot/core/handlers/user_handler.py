import logging

from aiogram import Router, F
from aiogram.filters import CommandStart, Command
from aiogram.types import Message
from aiogram.enums import ChatAction

from pymongo.errors import DuplicateKeyError

import core.keyboards.user_keyboard as kb
from core.databases.mongodb.moderator.controller import ModeratorController

user_router = Router()


@user_router.message(CommandStart())
@user_router.message(F.text == "Открыть приложение")
async def message_handler(message: Message, _user_controller) -> None:
    try:
        await message.bot.send_chat_action(
            chat_id=message.from_user.id, action=ChatAction.TYPING
        )
        await _user_controller.add_user(
            message.from_user.id,
            message.from_user.username
        )

        await message.answer(
            text=f"""
Здравствуйте, <b>{message.from_user.full_name}!</b>
Вы присоединились к приложению <b>EVENTRA</b>
Нажмите \"Открыть\" для запуска
            """,
            reply_markup=kb.web_app_keyboard_inline,
        )

        if not message.text == "Открыть приложение":
            await message.answer(
                text="Если у Вас будут какие-то вопросы, то можете написать в тех.поддержку",
                reply_markup=kb.tech_keyboard,
            )
    except DuplicateKeyError as dke:
        logging.info(dke)
        await message.answer(
            text=f"""
Вы присоединились к приложению <b>EVENTRA</b>
Нажмите \"Открыть\" для запуска
            """,
            reply_markup=kb.web_app_keyboard_inline,
        )

        if not message.text == "Открыть приложение":
            await message.answer(
                text="Если у Вас будут какие-то вопросы, то можете написать в тех.поддержку",
                reply_markup=kb.tech_keyboard,
            )
    except Exception as e:
        logging.info(e)
        await message.answer(
            "Здравствуйте. Произошла ошибка при попытке первичной регистрации.\n\nПопробуйте позже."
        )


@user_router.message(F.text == "Тех. Поддержка")
async def print_moderators(message, _moderator_controller: ModeratorController):
    await message.bot.send_chat_action(
        chat_id=message.from_user.id, action=ChatAction.TYPING
    )

    text = "Выберите тип обращения"

    await message.answer(text=text, reply_markup=kb.moderator_keyboard)

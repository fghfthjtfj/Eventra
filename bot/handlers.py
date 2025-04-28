import logging

from typing import Any
from aiogram import Router, html, F
from aiogram.types import (
    Message,
    InlineKeyboardMarkup,
    InlineKeyboardButton,
    ReplyKeyboardMarkup,
    ReplyKeyboardRemove,
    KeyboardButton,
    WebAppInfo,
)
from aiogram.filters import CommandStart, Command
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup

my_router = Router()


class UserData(StatesGroup):
    role = State()
    phoneNumber = State()


def setup_routers(db, bot, WEB_APP_URl) -> Router:
        await send_registration_buttons_handler(message, state)

    async def send_registration_buttons_handler(
        message: Message, state: FSMContext
    ) -> None:
        await state.set_state(UserData.phoneNumber)

        markup = ReplyKeyboardMarkup(
            keyboard=[
                [
                    KeyboardButton(
                        text="Поделиться номером телефона", request_contact=True
                    ),
                ],
            ],
            is_persistent=False,
            resize_keyboard=True,
        )

        await message.answer(
            "Для начала работы зарегистрируйтесь в системе, пожалуйста",
            reply_markup=markup,
        )

    class NotificationStates(StatesGroup):
        waiting_for_message = State()
        waiting_for_confirmation = State()

    @my_router.message(Command("global-notification"))
    async def start_global_notification(message: Message, state: FSMContext) -> None:
        await state.set_state(NotificationStates.waiting_for_message)
        await message.answer("Введите сообщение для глобальной рассылки:")

    @my_router.message(NotificationStates.waiting_for_message)
    async def receive_notification_message(message: Message, state: FSMContext) -> None:
        await state.update_data(notification_message=message.text)
        markup = InlineKeyboardMarkup(
            inline_keyboard=[
                [
                    InlineKeyboardButton(
                        text="Отправить всем", callback_data="send_notification"
                    )
                ],
                [
                    InlineKeyboardButton(
                        text="Отменить", callback_data="cancel_notification"
                    )
                ],
            ]
        )
        await state.set_state(NotificationStates.waiting_for_confirmation)
        await message.answer(
            "Вы уверены, что хотите отправить это сообщение всем пользователям?",
            reply_markup=markup,
        )
        # await bot.delete_message(
        #     message_id=message.message_id, chat_id=message.chat.id
        # )

    @my_router.callback_query(F.data == "send_notification")
    async def send_notification(
        callback_query: F.CallbackQuery, state: FSMContext
    ) -> None:
        data = await state.get_data()
        notification_message = data.get("notification_message")
        users = db.get_all_users()
        for user in users:
            telegram_id = user.get("telegramId")
            if telegram_id:
                try:
                    await callback_query.message.bot.send_message(
                        chat_id=telegram_id, text=notification_message
                    )
                except Exception as e:
                    logging.error(f"Failed to send message to user {telegram_id}: {e}")
        await callback_query.message.answer(
            "Сообщение успешно отправлено всем пользователям!"
        )
        await state.clear()
        await callback_query.message.delete()

    @my_router.callback_query(F.data == "cancel_notification")
    async def cancel_notification(
        callback_query: F.CallbackQuery, state: FSMContext
    ) -> None:
        await callback_query.message.answer("Глобальная рассылка отменена.")
        await state.clear()
        await callback_query.message.delete()

    @my_router.message(F.contact)
    async def show_list_of_roles(message: Message, state: FSMContext) -> None:
        await state.update_data(phoneNumber=message.contact.phone_number)
        await state.set_state(UserData.role)

        markup = ReplyKeyboardMarkup(
            keyboard=[
                [
                    KeyboardButton(
                        text="Артист",
                    ),
                    KeyboardButton(
                        text="Заказчик",
                    ),
                ],
            ],
            is_persistent=False,
            resize_keyboard=True,
        )

        await message.answer(
            "Выберите свою роль в системе",
            reply_markup=markup,
        )

    @my_router.message(UserData.role, F.text.contains("Артист"))
    async def register_as_artist(msg: Message, state: FSMContext) -> None:
        data = await state.update_data(role=msg.text)
        username = msg.from_user.username or f"user_{msg.from_user.id}"

        if db.add_user(
            telegramId=msg.from_user.id,
            phoneNumber=data["phoneNumber"],
            username=username,
        ):
            await msg.answer(
                "Вы успешно зарегистрировались, как <b>Артист</b>",
                reply_markup=ReplyKeyboardRemove(),
            )
            await state.clear()
            await send_web_app_handler(msg)
        else:
            await send_error_handler(msg, "Артист")

    @my_router.message(UserData.role, F.text.contains("Заказчик"))
    async def register_as_customer(msg: Message, state: FSMContext) -> None:
        data = await state.update_data(role=msg.text)
        username = msg.from_user.username or f"user_{msg.from_user.id}"

        if db.add_user(
            telegramId=msg.from_user.id,
            phoneNumber=data["phoneNumber"],
            username=username,
        ):
            await msg.answer(
                "Вы успешно зарегистрировались, как <b>Заказчик</b>",
                reply_markup=ReplyKeyboardRemove(),
            )
            await state.clear()
            await send_web_app_handler(msg)
        else:
            await send_error_handler(msg, "Заказчик")

    async def send_error_handler(message: Message, user_role: str) -> None:
        markup = ReplyKeyboardMarkup(
            keyboard=[
                [
                    KeyboardButton(text="Поделиться контактом", request_contact=True),
                ],
            ],
            resize_keyboard=True,
        )

        await message.answer(
            "Произошла ошибка при добавлении пользователя. Попробуйте еще раз.",
            reply_markup=markup,
        )

    async def send_web_app_handler(message: Message) -> None:
        await message.answer(
            "Теперь вы можете перейти в веб-приложение.",
            reply_markup=InlineKeyboardMarkup(
                inline_keyboard=[
                    [
                        InlineKeyboardButton(
                            text="Перейти к приложению",
                            web_app=WebAppInfo(url=WEB_APP_URl),
                        ),
                    ],
                ],
            ),
        )

    return my_router

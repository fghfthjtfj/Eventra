from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo, KeyboardButton, ReplyKeyboardMarkup

from config import WEB_APP_URL

web_app_keyboard_inline = InlineKeyboardMarkup(
    inline_keyboard=[
        [
            InlineKeyboardButton(text="Открыть", web_app=WebAppInfo(url=WEB_APP_URL)),
        ],
    ]
)

tech_keyboard = ReplyKeyboardMarkup(
    keyboard=[
        [KeyboardButton(text="Открыть приложение")],
        [KeyboardButton(text='Тех. Поддержка')],
    ],
    resize_keyboard=True,
    input_field_placeholder='Перейдите в приложение, либо напишите в тех.поддержку'
)

moderator_keyboard = InlineKeyboardMarkup(
    inline_keyboard=[
        [
            InlineKeyboardButton(text="Вопрос модератору заявок и анкет", url='https://t.me/konstbel'),
        ],
        [
            InlineKeyboardButton(text="Техническая ошибка", url='https://t.me/elenhello'),
        ],
        [
            InlineKeyboardButton(text="Отзыв или предложение", url='https://t.me/konstbel'),
        ],
    ]
)
from aiogram.types import (
    ReplyKeyboardMarkup,
    KeyboardButton,
    InlineKeyboardMarkup,
    InlineKeyboardButton,
)
from aiogram.utils.keyboard import InlineKeyboardBuilder

main_keyboard = ReplyKeyboardMarkup(
    keyboard=[
        [
            KeyboardButton(text="Исполнители"),
            KeyboardButton(text="Заказы"),
            KeyboardButton(text="Отзывы"),
        ],
        [
            KeyboardButton(text="Действующие промокоды"),
            KeyboardButton(text="Добавить промокод"),
        ],
        [
            KeyboardButton(text="Открыть приложение"),
        ],
    ],
    resize_keyboard=True,
    input_field_placeholder="Выберите раздел, к которому желаете перейти.",
)


def build_artist_request_keyboard(page, total_pages, request_id, telegram_id):
    builder = InlineKeyboardBuilder()

    # Add pagination buttons
    if page > 0:
        builder.button(text="⬅️ Предыдущая", callback_data=f"artists_page_{page-1}")
    if page < total_pages - 1:
        builder.button(text="Следующая ➡️", callback_data=f"artists_page_{page+1}")

    builder.row(
        InlineKeyboardButton(
            text="Принять", callback_data=f"accept_artist_{request_id}_{telegram_id}"
        ),
        InlineKeyboardButton(
            text="Отклонить", callback_data=f"reject_artist_{request_id}_{telegram_id}"
        ),
    )

    return builder.as_markup()


def build_customer_request_keyboard(page, total_pages, request_id, telegram_id):
    builder = InlineKeyboardBuilder()

    if page > 0:
        builder.button(text="⬅️ Предыдущая", callback_data=f"customer_page_{page-1}")
    if page < total_pages - 1:
        builder.button(text="Следующая ➡️", callback_data=f"customer_page_{page+1}")

    builder.row(
        InlineKeyboardButton(
            text="Принять", callback_data=f"accept_customer_{request_id}_{telegram_id}"
        ),
        InlineKeyboardButton(
            text="Отклонить",
            callback_data=f"reject_customer_{request_id}_{telegram_id}",
        ),
    )

    return builder.as_markup()


def build_reviews_keyboard(
    page, total_pages, review_id, customer_telegram_id, artist_telegram_id
):
    builder = InlineKeyboardBuilder()

    if page > 0:
        builder.button(text="⬅️ Предыдущая", callback_data=f"review_page_{page-1}")
    if page < total_pages - 1:
        builder.button(text="Следующая ➡️", callback_data=f"review_page_{page+1}")

    builder.row(
        InlineKeyboardButton(
            text="Принять",
            callback_data=f"accept_review_{review_id}_{customer_telegram_id}_{artist_telegram_id}",
        ),
        InlineKeyboardButton(
            text="Отклонить",
            callback_data=f"reject_review_{review_id}_{customer_telegram_id}",
        ),
    )

    return builder.as_markup()

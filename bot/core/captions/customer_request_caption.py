import datetime


def generate_customer_request_caption(request, page, total_pages):
    try:
        caption = f"""
ID: {request.get('_id', 'нет информации')}

Имя фамилия <b>Заказчика</b>: {request.get('artistDetails', {}).get('firstName', 'нет информации')} {request.get('artistDetails', {}).get('lastName', 'нет информации')}
Номер телефона: {request.get('artistDetails', {}).get('phoneNumber', 'нет информации')}

Telegram: {f"<a href='https://t.me/{request.get('artistDetails', {}).get('userName', '')}'>Ссылка</a>" if request.get('artistDetails', {}).get('userName') else 'нет информации'}

Город: {request.get('city', 'нет информации')}
Название МП: {request.get('eventName', 'нет информации')}
Дата: {request.get('date').strftime("%B %d, %Y") if isinstance(request.get('date'), datetime.date) else 'нет информации'}
Время: {request.get('time', 'нет информации')}
Описание:
{f"<b>{request.get('description')}</b>" if request.get('description') else "нет информации"}

Цены: {request.get('fee', 'нет информации')}
Количество гостей: {request.get('guestCount', 'нет информации')}

Категории:
"""

        for category in request.get("categoriesName", []):
            if category and isinstance(category, dict):
                caption += f"<b>{category.get('name', 'нет информации')}</b>\n"

        caption += f"\nСтраница {page + 1}/{total_pages}"

        return caption
    except Exception as e:
        return f"Ошибка при генерации описания: {e}"

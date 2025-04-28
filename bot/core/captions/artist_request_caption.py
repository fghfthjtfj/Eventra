def generate_artist_request_caption(person):
    # Проверка на наличие данных о человеке
    if not isinstance(person, dict):
        return "Нет информации о человеке."

    # Формирование ссылок или сообщения об их отсутствии
    inst_info = f'<a href="https://instagram.com/{person.get("instagram", "").strip()}">Ссылка</a>' if person.get(
        "instagram") else "нет информации"
    vk_info = f'<a href="{person.get("vk", "").strip()}">Ссылка</a>' if person.get("vk", "").startswith(
        'https://') else "нет информации"
    youtube_info = f'<a href="{person.get("youtube", "").strip()}">Ссылка</a>' if person.get("youtube", "").startswith(
        'https://') else "нет информации"
    tiktok_info = f'<a href="{person.get("tiktok", "").strip()}">Ссылка</a>' if person.get("tiktok", "").startswith(
        'https://') else "нет информации"

    artist_details = person.get('artistDetails', {})
    first_name = artist_details.get('firstName', 'нет информации')
    last_name = artist_details.get('lastName', 'нет информации')
    phone_number = artist_details.get('phoneNumber', 'нет информации')
    user_name = artist_details.get('userName', None)

    # Telegram ссылка, если username существует
    telegram_info = f'<a href="https://t.me/{user_name.strip()}">Ссылка</a>' if user_name else "нет информации"

    # Формирование основной части текста
    caption = f"""
ID: {person.get('_id', 'нет информации')}

Имя Фамилия: {first_name} {last_name}
Номер телефона: {phone_number}
Город: {person.get('city', 'нет информации')}

Telegram: {telegram_info}

Instagram: {inst_info}
Вконтакте: {vk_info}
Youtube: {youtube_info}
Tiktok: {tiktok_info}
Цены: {person.get('price', 'нет информации')}
Описание:
{f"<b>{person.get('description', '').strip()}</b>" if person.get('description') else "нет информации"}

Видео на Youtube:
"""

    # Добавление ссылок на видео, если они есть
    links = person.get('link_video', [])
    if links and isinstance(links, list) and any(link.strip() for link in links):
        caption += 'нет информации\n'
    else:
        caption += 'нет информации\n'

    # Добавление категорий, если они есть
    caption += "\nКатегории:\n"
    categories = person.get("categoriesName", [])
    if categories and isinstance(categories, list):
        for category in categories:
            name = category.get('name', 'нет информации')
            if name:
                caption += f"<b>{name.strip()}</b>\n"

    return caption

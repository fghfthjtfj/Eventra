def generate_promos_caption(promos_data):
    caption = ""

    for promo_data in promos_data:
        promo_name = promo_data.get('promo', 'No Promo')
        count = promo_data.get('count', 0)
        fix_price = promo_data.get('fixPrice', 0)
        percent_price = promo_data.get('percentPrice', 0)
        tarifs = promo_data.get('associated_tarifs', [])

        caption += f"Название: {promo_name}\n"
        caption += f"Осталось использований: {count}\n"
        caption += f"Скидка в рублях: {fix_price}₽\n"
        caption += f"Скидка в процентах: {percent_price}%\n"

        caption += "Тарифы:\n"
        for tarif in tarifs:
            tarif_name = tarif.get('name', 'Неизвестный тариф')
            tarif_term = tarif.get('term', 'Неизвестный срок')
            caption += f"- {tarif_name} ({tarif_term})\n"
        
        caption += "\n" + "-"*40 + "\n\n"

    return caption
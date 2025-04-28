def generate_review_caption(review, page, total_pages):
    caption = f"""
Отзыв оставил: {review.get('customerDetails', {}).get('firstName', '')} {review.get('customerDetails', {}).get('lastName', "")}
Исполнитель: {review.get('artistDetails', {}).get('firstName', '')} {review.get('artistDetails', {}).get('lastName', "")}

Оценка: {review.get('grade')}/5

Заголовок: {review.get('reviewTitle')}
Описание:
{review.get('reviewText')}

Страница: {page + 1}/{total_pages}
"""
    
    return caption
import done from "../../images/donereview.png"

const ReviewDone = () => {

    return (
        <div className="h-screen flex flex-col items-center justify-center px-[16px]">
            <img src={done} alt="done" className="mb-[25px]" />
            <div className="text-[24px] font-bold text-center mb-[16px]">
                Спасибо, ваш отзыв на модерации
            </div>
            <div className="text-[18px] font-bold text-center">Ваш отзыв поможет артисту с продвижением и пригодится будущим заказчикам</div>
        </div>
    );
}
 
export default ReviewDone;
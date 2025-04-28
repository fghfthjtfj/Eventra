import { Link } from "react-router-dom";
import mmm from "../../../images/mmm.svg";
import { useSubscription } from "../../../context/subscriptionContext";

const CatalogBanner = () => {

    const { subscription } = useSubscription()

    const handleGo = () => {
        if (subscription === null || new Date(subscription.dateExpression) < new Date()) {
            window.location.href = '/subscription'
            return
        }
        window.location.href = "/add-artist-request"
    }
    return (
        <div onClick={() => handleGo()} className="border-2 bg-main mb-6 border-black rounded-[15px] px-[27px] py-[25px] flex gap-[18px] items-center mx-[16px]">
            <img src={mmm} className="h-[60px]" alt="1" />
            <div className="text-[18px] font-bold leading-6">
                Создайте свою анкету,
                <br />
                чтобы начать получать <br />
                заявки
            </div>
        </div>
    );
}

export default CatalogBanner;
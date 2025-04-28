import { LightButton2 } from "../UI/Button/button";
import coins from "../../images/Coins.svg"
import shareabout from "../../images/shareabout.svg"
import { Link } from "react-router-dom";
import { useUser } from "../../context/userContext";

const About = () => {
    const {user} = useUser()
    const onClick = () => {
        window.location.href = 'https://docs.google.com/document/d/11YR410x_fE9a1YNpFkf77elSpNqEq8TG/edit';
    }

    const handleGoSupport = () => {
        window.location.href='https://t.me/EventsApp_bot'
    }

    return ( 
        <div className="min-h-screen bg-back px-[16px]">
            <div className="pt-[82px] font-bold text-[36px] text-center">
                О приложении
            </div>
            <div className="mt-[72px] flex flex-col gap-[16px]">
                {user?.role!=='customer' && <Link to={"/subscription"}><LightButton2 text={<div className="flex gap-[32px] items-center justify-center"><img src={coins} alt="" className="h-[29px] w-[29px]" />Подписка/Тарифы</div>} /></Link>}
                <Link to={"/share"}><LightButton2 text={<div className="flex gap-[32px] items-center justify-center"><img src={shareabout} alt="" className="h-[29px] w-[29px]" />Рассказать другу</div>} /></Link>
                <LightButton2 onClick={handleGoSupport} text={"Поддержка"} />
                <LightButton2 onClick={onClick} text={"Оферта"} />
            </div>
        </div>
     );
}
 
export default About;
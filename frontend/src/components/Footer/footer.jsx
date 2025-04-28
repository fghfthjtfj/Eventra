import { Link, useNavigate } from "react-router-dom";
import Share from "../../images/share btn.svg";
import logo from "../../images/logo.svg";
import { useSubscription } from "../../context/subscriptionContext";

const Footer = () => {
    const navigate = useNavigate();
    const { subscription } = useSubscription();

    const handleGoSupport = () => {
        window.location.href = 'https://t.me/EventsApp_bot';
    };

    const handleGoCatalogApplications = (e) => {
        e.preventDefault();

        if (!subscription || new Date(subscription.dateExpression) < new Date()) {
            navigate("/subscription");
        } else {
            navigate("/catalog-applications");
        }
    };

    return (
        <div className=" bg-black px-[52px] py-[40px] text-white">
            <div>
                <img src={logo} alt="logo" />
            </div>
            <div className="flex text-[12px] mt-[21px]">
                <div className="flex flex-col gap-[23px] justify-start items-start w-1/2">
                    {/* ✅ Проверяем подписку перед переходом */}
                    <Link to="#" onClick={handleGoCatalogApplications}>Каталог заявок</Link>
                    <Link to="/category-artist">Каталог артистов</Link>
                    <Link to={"/share"} className="flex gap-[4px] items-start text-[12px]">
                        <img src={Share} alt="share" /> <span>Рассказать другу</span>
                    </Link>
                </div>
                <div className="flex flex-col gap-[23px] justify-start items-start w-1/2 pl-[30px]">
                    <Link to="/about"> О приложении </Link>
                    <div onClick={handleGoSupport}> Поддержка </div>
                </div>
            </div>
        </div>
    );
};

export default Footer;

import backgroundshare from "../../images/backgroundshare.png";
import Link from "../../images/Link.svg"
import { LightButton2 } from "../UI/Button/button";

const Share = () => {
    const link = 'https://t.me/EventsApp_bot';

    const handleCopyLink = () => {
        navigator.clipboard.writeText(link).then(() => {
            alert('Ссылка скопирована в буфер обмена');
        }).catch(err => {
            console.error('Ошибка при копировании ссылки: ', err);
        });
    };

    return (
        <div className=" flex justify-center min-h-screen flex-col px-[16px]">
            <img src={backgroundshare} className="h-full" alt="backgroundshare" />
            <div className="text-center leading-7 font-bold text-[24px]">Спасибо за поддержку<br/>Eventra</div>
            <div className="mt-[170px]">
                <LightButton2 onClick={handleCopyLink} text={<div className="relative w-full flex items-center justify-center ">Скопировать ссылку <img className="absolute right-[16px] top-0 h-[28px]" src={Link} alt="Link" /></div>} />
            </div>
        </div>
    );
};

export default Share;

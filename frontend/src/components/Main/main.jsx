import React, { useState } from 'react';
import bg from "../../images/bg.png"
import { Link } from 'react-router-dom';
import { DarkButton, LightButton, LightButton2 } from '../UI/Button/button';
import axios from "../../axios"
import { useNavigate } from 'react-router-dom';
import mainsvgt from "../../images/mainsvgt.svg"

const Main = () => {

    const navigate = useNavigate();
    let tg = window.Telegram.WebApp;

    let userId = ''

    if (!tg.initDataUnsafe.user) {
        userId = '1073631065'
    }
    else {
        userId = tg.initDataUnsafe.user?.id
    }

    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState('')
    const [roleCurrent, setRoleCurrent] = useState('')

    const handleOk = (role) => {
        setRoleCurrent(role)
        setPopupMessage(` Вы выбираете роль ${role} Подтвердить выбор?  
            В случае ошибки, смена роли будет возможна только через тех.поддержку `)
        setShowPopup(true)
    }

    const handleCancelChange = () => {
        setShowPopup(false)
    }

    const handleGoArtistCatalog = () => {
        axios.patch("/user", { telegramId: userId, role: 'artist' })
            .then(() => {
                window.location.href = "/catalog-applications";
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const handleGoCustomerCatalog = () => {
        axios.patch("/user", { telegramId: userId, role: 'customer' })
            .then(() => {
                window.location.href = "/category-artist";
            })
            .catch((err) => {
                console.log(err)
            })
    }

    return (
        <div className='relative h-max'>
            {showPopup &&
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-md shadow-lg max-w-xs text-center">
                        <p className="text-lg font-semibold">{popupMessage}</p>
                        <div className="mt-4 flex flex-col gap-3 justify-around text-[18px]">
                            <LightButton2 onClick={handleCancelChange} text="Отмена" />
                            <DarkButton onClick={roleCurrent==='артиста' ? handleGoArtistCatalog : handleGoCustomerCatalog} text="Подтвердить" />
                        </div>
                    </div>
                </div>}
            <img src={bg} alt="bg" className='w-full absolute h-full -z-10' />
            <div className='py-[31px] text-white'>
                <div className=' mt-[110px] mb-[85px] flex justify-center items-center'><img src={mainsvgt} alt="mainsvg" /></div>
                <div className=' text-white text-[40px] font-bold text-center w-full leading-[44px] tracking-[0%]'>
                    Создай событие,<br /> которое <br /> запомнится
                </div>
                <div className='mt-[58px] flex flex-col gap-[12px] px-[23px]'>
                    <button onClick={() => handleOk("артиста")}><LightButton text="Я артист" /></button>
                    <button onClick={() => handleOk("организатора")}><LightButton text="Я организатор" /></button>
                </div>
                <div className='mt-[23px] text-[16px] text-center px-[43px] leading-[19px] tracking-[0%] mb-[16px]'>
                    Eventra помогает найти первоклассных артистов для любого случая,
                    а таланты смогут заявить о себе и начать выгодное сотрудничество
                </div>
            </div>
        </div>
    );
};

export default Main;

import axios from "../../axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import donereview from "../../images/donereview.png"
import Loader from "../UI/Loader/loader";
import attention from "../../images/attention.svg"
import { DarkButton, LightButton2 } from "../UI/Button/button";
import confetti from "../../images/Confetti.svg"
import { useUser } from "../../context/userContext";
import CryptoJS from 'crypto-js';

const Tarif = () => {
    const { id } = useParams();
    const [tarif, setTarif] = useState({})
    const [promo, setPromo] = useState(null)
    const [inputPromo, setInputPromo] = useState('')
    const [promoData, setPromoData] = useState({})
    const [price, setPrice] = useState(0);
    const [name, setName] = useState('');
    const { user } = useUser();
    const [payload, setPayload] = useState(false);
    const [inputEmail, setInputEmail] = useState(''); // Новое состояние для email
    const [errorMessage, setErrorMessage] = useState(""); // Для отображения ошибки
    const [promoCode, setPromoCode] = useState(""); // Состояние для сохранения промокода
    const [buttonText, setButtonText] = useState("Подтвердить");

    useEffect(() => {
        axios.get('/tarif', { params: { id: id } })
            .then((res) => {
                setTarif(res.data)
                setPrice(res.data.price)
                setName(res.data.name)
            })
            .catch(err => console.log(err))
    }, [])

    const roundDownToTwoDecimals = (value) => {
        return Math.floor(value * 100) / 100;
    };

    const usePromo = () => {
    axios.get("/promo", { params: { promo: inputPromo, tarif: tarif._id } })
        .then((res) => {
            if (res.status === 200) {
                setPromoCode(inputPromo); // Сохраняем значение промокода
                setPromoData(res.data);
                setPromo(true);

                // Вычисление новой цены
                if (res.data.percentPrice !== null && res.data.percentPrice !== undefined) {
                    const discountedPrice = tarif.price * (1 - res.data.percentPrice / 100);
                    setPrice(roundDownToTwoDecimals(Math.max(discountedPrice, 0)));
                } else if (res.data.fixPrice !== null && res.data.fixPrice !== undefined) {
                    const discountedPrice = tarif.price - res.data.fixPrice;
                    setPrice(roundDownToTwoDecimals(Math.max(discountedPrice, 0)));
                }
            }
        })
        .catch((err) => {
            console.log(err);
            setPromoCode(""); // Убираем промокод из состояния, если запрос не успешен
            setPromo(false);
            setPromoData({});
        });
};


    const saveEmail = async () => {
      try {
        await axios.patch('/user', { telegramId: user.telegramId, email: inputEmail });
        setErrorMessage(""); // Сброс ошибки при успешном выполнении
        console.log("Email сохранён успешно");
        return true; // Возвращаем успешный результат
      } catch (err) {
        setErrorMessage("Этот email уже используется."); // Установка ошибки
        console.error("Ошибка при сохранении email:", err);
        return false; // Возвращаем неудачный результат
      }
    };



    const handleSubmit = () => {
        pay();
    };

    const pay = async function () {
        try {
            // Отправляем запрос на сервер для создания подписки
            await axios.post('/subscription', {
                user_email: inputEmail,
                price: price,
                tarif_name: name
            });
            console.log('Создана оплата во фронте');
        } catch (err) {
            console.error('Ошибка создания оплаты во фронте:', err);
            return; // Останавливаем выполнение при ошибке
        }

        // Определяем product_id на основе названия подписки
        let product_id;
        if (name === 'Пробный период') {
            product_id = '70389b1a-af14-4912-90ba-ec6a96ec100a';
        } else if (name === 'Премиум 1 месяц') {
            product_id = '7928f4ee-c40e-49ae-891f-e90c688beb65';
            //product_id = '1173d80b-0048-4aa5-af42-81e2249427cd' // Тестовый
        } else if (name === 'Премиум 3 месяца') {
            product_id = '12e7a5ac-273a-4f20-b622-9e7b47164551';
        } else if (name === 'Премиум 12 месяцев') {
            product_id = 'ef160e34-56f5-442d-8a67-d6bf6189aba0';
        } else {
            console.error('Не удалось определить product_id для подписки.');
            return;
        }
        if (price != 0){
            // Формируем URL для редиректа
            let url = `https://eventra.zenclass.ru/create-payment?email=${encodeURIComponent(inputEmail)}&ppam_id=${product_id}`;
            if (promoCode) {
                url += `&code=${encodeURIComponent(promoCode)}`; // Добавляем промокод, если он есть
            }
            console.log("Редирект на URL:", url);

        // Выполняем редирект
        window.location.href = url;
        console.log('Редирект на URL:', url);
        }
        else {
            window.location.href = '/';

        }

    };




    const handleErrorPayment = () => {
        console.log('ошибка оплаты');
    };

    const handleExit = () => {
        window.location.href = '/subscription'
    };

    const handleGoHome = () => {
        window.location.href = '/';
    };

    if (!tarif) {
        return <Loader />
    }

    return (
        <div className="px-[16px] pt-[60px]">
            <div className="text-center">
                <div className="flex justify-center items-center"><img src={donereview} alt="done" /></div>
                <div className="mt-[18px] font-bold text-[24px]">Вы подключаете<br /> «{tarif?.name}»</div>
            </div>
            <div className="mt-[16px] ">
                {tarif.price > 0 && <>
                    <div className="text-[16px] opacity-55">Введите промокод</div>
                    <div className="flex gap-1 mt-1 text-[12px] opacity-55 items-center">
                        <img src={attention} alt="attention" />Нажмите «Применить» после введения промокода
                    </div>
                    <div className="mt-[8px] h-[59px] py-[20px] px-[24px] flex justify-between items-center border-[2px] border-black border-solid">
                        <input value={inputPromo} onChange={(e) => setInputPromo(e.target.value)} type="text" placeholder="PROMOCODE" />
                        <div onClick={usePromo}>Применить</div>
                    </div></>}
            <div className="mt-[16px] ">
              <div className="text-[16px] opacity-55">Введите email</div>
              <div className="mt-[8px] h-[59px] py-[20px] px-[24px] flex justify-between items-center border-[2px] border-black border-solid">
                <input value={inputEmail} onChange={(e) => setInputEmail(e.target.value)} type="email" placeholder="Введите email" />
              </div>
              {/* Вывод сообщения об ошибке */}
              {errorMessage && <div className="text-red-500 mt-[8px]">{errorMessage}</div>}
            </div>
                {promo === true && <div className="mt-[20px] px-[23px] py-[17px] bg-back">
                    <div className="flex gap-7 justify-between]">
                        <div className="flex justify-between items-center">
                            <img src={confetti} alt="confetti" />
                        </div>
                        <div className="leading-5">
                            Поздравляем, ваш промокод дарит вам {promoData.fixPrice !== null && promoData.fixPrice !== undefined ? `скидку ${promoData.fixPrice}₽ ` : promoData.percentPrice !== null && promoData.percentPrice !== undefined ? promoData.percentPrice === 100 ? `бесплатную подписку ` : `скидку ${promoData.percentPrice}% ` : ""} на указанный период
                        </div>
                    </div>
                </div>}
                {promo === false && <div className="mt-[20px]">Промокод не найден</div>}
                <div className="mt-[20px]">
                    По истечению срока действия мы напомним вам о продлении тарифа
                </div>
                <div className="mt-[46px]">
                    <div className="opacity-55 ">Ваша подписка</div>
                    <div className="mt-[18px] flex justify-between">
                        <div className="text-[18px] font-bold">{tarif.name}</div>
                        <div className="text-[18px]">
                            {promo && (promoData.percentPrice || promoData.fixPrice) ? (
                                <>
                                    <span className="line-through mr-2">{tarif.price} ₽</span>
                                </>
                                ) : (
                                    <span>{price} ₽</span>
                            )}

                        </div>
                    </div>
                    <div className="mt-[18px] flex justify-between">
                        <div className="text-[24px] font-bold">Итого</div>
                        <div className="text-[24px] font-bold">{price} ₽</div>
                    </div>
                    <div className="my-[46px] flex flex-col gap-3" >
                    <DarkButton
                      text={buttonText} // Используем состояние buttonText
                      onClick={async () => {
                        const isSaved = await saveEmail(); // Получаем результат сохранения
                        if (isSaved) {
                          setButtonText("Загружаем страницу оплаты"); // Меняем текст кнопки
                          handleSubmit(); // Выполняем только если сохранение успешно
                        }
                      }}
                    />

                        <LightButton2 text={"Отмена"} onClick={handleExit} />
                    </div>
                </div>
            </div>
        </div >
    );
}

export default Tarif;

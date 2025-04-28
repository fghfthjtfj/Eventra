import { Link, useNavigate } from "react-router-dom";
import axios from '../../axios';
import FrameAdd from "../../images/FrameAdd.png";
import zvezda from "../../images/zvezda.svg";
import attention from "../../images/attention.svg";
import { useCategories } from "../../context/categoryContext";
import { DarkButton } from "../UI/Button/button";
import { useUser } from '../../context/userContext';
import { useCities } from '../../context/citiesContext';
import { useState, useEffect, useRef } from "react";

const AddApplication = () => {
    const { categories } = useCategories();
    const navigate = useNavigate();
    const { user } = useUser();
    const [disabled, setDisabled] = useState(false)
    const [cityInput, setCityInput] = useState("");
    const [filteredCities, setFilteredCities] = useState([]);
    const [showCityDropdown, setShowCityDropdown] = useState(false);
    const cityInputRef = useRef(null);

    const [formData, setFormData] = useState({
        name: '',
        telegramNick: '',
        phoneNumber: '',
        eventName: '',
        category: [],
        city: '',
        feeFrom: '',
        feeTo: '',
        eventDetails: '',
        date: '',
        timeInterval: '',
        guestCount: '50-100',
    });

    const [personAccept, setPersonAccept] = useState(false);

    const { cities } = useCities()
    const handleCityInputChange = (e) => {
      const value = e.target.value;
      setFormData(prevData => ({
        ...prevData,
        city: value, // <-- именно city, а не setCitySearch
      }));

      // Далее можно делать фильтрацию:
      if (value.length > 0) {
        const filtered = cities.filter(city =>
          city.toLowerCase().startsWith(value.toLowerCase())
        );
        setFilteredCities(filtered);
        setShowCityDropdown(filtered.length > 0);
      } else {
        setFilteredCities([]);
        setShowCityDropdown(false);
      }
    };

    const handleCitySelect = (city) => {
        setCityInput(city);
        setFormData(prevData => ({
            ...prevData,
            city: city,
        }));
        setFilteredCities([]);
        setShowCityDropdown(false);
    };
    const handleChange = (e) => {
        const { name, value, options } = e.target;
        if (name === 'category') {
            const selectedOptions = Array.from(options).filter(option => option.selected).map(option => option.value);
            setFormData({ ...formData, [name]: selectedOptions });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    useEffect(() => {
        if (user && categories) {
            let namePerson = ''
            if (user.firstName && user.lastName) {
                namePerson = user.firstName + ' ' + user.lastName
            }
            setFormData(prevData => ({
                ...prevData,
                name: namePerson,
                telegramNick: user.userName,
                phoneNumber: user.phoneNumber,
                city: user.setCitySearch,
                category: [categories?.[0]?._id]
            }));
        }
    }, [user, categories]);

    const validateFullName = (fullName) => {
        const words = fullName.trim().split(" ");
        return words.length === 2 && words[0] && words[1];
    };

    const handleSubmit = async (e) => {
        setDisabled(true);
        e.preventDefault();

        if (!validateFullName(formData.name)) {
            setDisabled(false);
            alert("Поле 'Имя Фамилия' должно содержать два слова, разделённых пробелом.");
            return;
        }

        try {
            const response = await axios.post('/customer-request', {
                fee: formData.feeFrom + ' - ' + formData.feeTo,
                eventName: formData.eventName,
                description: formData.eventDetails,
                city: formData.city,
                customerId: user._id,
                categoryId: formData.category,
                date: formData.date,
                time: formData.timeInterval,
                guestCount: formData.guestCount
            });
            const response2 = await axios.patch('/user', {
                telegramId: user.telegramId,
                firstName: formData.name.split(" ")[0],
                lastName: formData.name.split(" ")[1],
                userName: formData.telegramNick
            });
            if (response.status === 201) {
                window.location.href = "/application-done";
            }
        } catch (error) {
            console.error('Error submitting form', error);
        }
    };

    return (
        <div>
            <div className="flex flex-col items-center justify-center mt-[81px]">
                <img src={FrameAdd} alt="FrameAdd" />
                <div className="text-[24px] font-bold leading-[29px] text-center">
                    Создайте свою заявку,<br />чтобы получать отклики
                </div>
                <div className="mt-[18px] text-[16px]">
                    Или посмотрите <Link className="underline" to={"/catalog-artist"}>каталог артистов</Link>
                </div>
            </div>
            <form className="mt-[78px] px-[16px]" onSubmit={handleSubmit}>
                <div>
                    <div className="text-[20px] font-bold">Контактная информация</div>
                </div>
                <div className="mt-[27px] flex flex-col gap-[24px]">
                    <div className="flex flex-col gap-[8px]">
                        <div className="flex text-[14px] opacity-70 gap-[8px]">
                            <div>Имя Фамилия</div>
                            <div><img src={zvezda} alt="zvezda" /></div>
                        </div>
                        <div className="flex gap-2 text-[12px] items-center">
                            <img src={attention} alt="attention" />Так ваше имя увидит заказчик
                        </div>
                        <div>
                            <input
                                type="text"
                                name="name"
                                placeholder="Иван Иванов"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="px-[24px] py-[16px] border-black border-solid border-2 w-full"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-[8px]">
                        <div className="flex text-[14px] opacity-70 gap-[8px]">
                            <div>Ваш ник Telegram</div>
                            <div><img src={zvezda} alt="zvezda" /></div>
                        </div>
                        <div className="flex gap-2 text-[12px] items-center">
                            <img src={attention} alt="attention" />Проверьте, что у вас открыты личные сообщения в Telegram
                        </div>
                        <div>
                            <input
                                type="text"
                                name="telegramNick"
                                placeholder="@yournick"
                                value={formData.telegramNick}
                                onChange={handleChange}
                                required
                                className="px-[24px] py-[16px] border-black border-solid border-2 w-full"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-[8px]">
                        <div className="flex text-[14px] opacity-70 gap-[8px]">
                            <div>Ваш номер телефона</div>
                            <div><img src={zvezda} alt="zvezda" /></div>
                        </div>
                        <div>
                            <input
                                type="text"
                                name="phoneNumber"
                                placeholder="+7 999 000 00 00"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                required
                                className="px-[24px] py-[16px] border-black border-solid border-2 w-full"
                            />
                        </div>
                    </div>
                </div>
                <div className="mt-[48px]">
                    <div className="text-[20px] font-bold">Ваша заявка</div>
                </div>
                <div className="mt-[27px] flex flex-col gap-[24px]">
                    <div className="flex flex-col gap-[8px]">
                        <div className="flex text-[14px] opacity-70 gap-[8px]">
                            <div>Названия вашего мероприятия</div>
                            <div><img src={zvezda} alt="zvezda" /></div>
                        </div>
                        <div>
                            <input
                                type="text"
                                name="eventName"
                                placeholder="Детский праздник"
                                value={formData.eventName}
                                onChange={handleChange}
                                required
                                className="px-[24px] py-[16px] border-black border-solid border-2 w-full"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-[8px]">
                        <div className="flex text-[14px] opacity-70 gap-[8px]">
                            <div>Категория</div>
                            <div><img src={zvezda} alt="zvezda" /></div>
                        </div>
                        <div className="select-wrapper">
                            <select
                                className="custom-select"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                            >
                                {categories.map((el) => (
                                    <option key={el._id} value={el._id}>{el.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    {/* Город с автозаполнением */}
                    <div className="flex flex-col gap-[8px]" ref={cityInputRef}>
                        <div className="flex text-[14px] opacity-70 gap-[8px]">
                            <div>Город</div>
                            <div><img src={zvezda} alt="zvezda" /></div>
                        </div>
                        <input
                            type="text"
                            placeholder="Начните вводить город..."
                            value={formData.city}
                            onChange={handleCityInputChange}
                            className="px-[24px] py-[16px] border-black border-solid border-2 w-full"
                        />
                        {showCityDropdown && (
                            <ul className="absolute bg-white border border-gray-300 w-full max-h-60 overflow-y-auto z-20">
                                {filteredCities.map((city, index) => (
                                    <li
                                        key={index}
                                        onClick={() => handleCitySelect(city)}
                                        className="px-4 py-2 hover:bg-gray-200 cursor-pointer"
                                    >
                                        {city}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                    <div className="flex flex-col gap-[8px]">
                        <div className="flex text-[14px] opacity-70 gap-[8px]">
                            <div>Гонорар</div>
                            <div><img src={zvezda} alt="zvezda" /></div>
                        </div>
                        <div className="flex gap-2 text-[12px] items-center">
                            <img src={attention} alt="attention" />Укажите диапазон цен
                        </div>
                        <div className="flex items-center gap-[8px]">
                            <input
                                type="text"
                                name="feeFrom"
                                placeholder="От 1 000 ₽"
                                value={formData.feeFrom}
                                onChange={handleChange}
                                required
                                className="px-[24px] py-[16px] border-black border-solid border-2 w-full"
                            />
                            <input
                                type="text"
                                name="feeTo"
                                placeholder="До 10 000 ₽"
                                value={formData.feeTo}
                                onChange={handleChange}
                                required
                                className="px-[24px] py-[16px] border-black border-solid border-2 w-full"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-[8px]">
                        <div className="flex text-[14px] opacity-70 gap-[8px]">
                            <div>О вашем мероприятии</div>
                        </div>
                        <div className="flex items-center gap-[8px]">
                            <textarea
                                className="h-[132px] px-[24px] py-[16px] border-black border-solid border-2 w-full"
                                name="eventDetails"
                                placeholder="Добавьте больше деталей о вашем событии, чтобы привлечь артистов. Яркое описание увеличивает шансы на получение откликов!"
                                value={formData.eventDetails}
                                onChange={handleChange}
                            ></textarea>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="flex flex-col gap-[8px] w-1/2">
                            <div className="flex text-[14px] opacity-70 gap-[8px]">
                                <div>Дата</div>
                                <div><img src={zvezda} alt="zvezda" /></div>
                            </div>
                            <div>
                                <input
                                    type="date"
                                    name="date"
                                    value={formData.date}
                                    onChange={handleChange}
                                    required
                                    className="h-[59px] px-[24px] py-[16px] border-black border-solid border-2 w-full"
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-[8px]">
                            <div className="flex text-[14px] opacity-70 gap-[8px]">
                                <div>Временной интервал</div>
                            </div>
                            <div>
                                <input
                                    type="text"
                                    name="timeInterval"
                                    placeholder="9:00-12:00"
                                    value={formData.timeInterval}
                                    onChange={handleChange}
                                    className="px-[24px] py-[16px] border-black border-solid border-2 w-full"
                                />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-[8px]">
                        <div className="flex text-[14px] opacity-70 gap-[8px]">
                            <div>Количество гостей</div>
                        </div>
                        <div className="select-wrapper">
                            <select
                                className="custom-select"
                                name="guestCount"
                                value={formData.guestCount}
                                onChange={handleChange}
                                required
                            >
                                <option value="0-50">0-50</option>
                                <option value="50-100">50-100</option>
                                <option value="100-200">100-200</option>
                                <option value="200+">более 200</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <input type="checkbox" required value={personAccept} onChange={(e) => setPersonAccept(e.target.checked)} id="accept_pers_data" /> <label htmlFor="accept_pers_data" className="text-[12px]"><Link className='text-black underline' to="https://docs.google.com/document/d/1ZeJG7cl2raszu6VWoclo38WSxZKl_qRt/edit">Согласен</Link> на обработку моих персональных данных согласно <Link className='text-black underline' to={"https://docs.google.com/document/d/13SBC6s4-XB9GCrZEUbNjqsj-_SBw5nvE/edit"}>Политике</Link></label>
                    </div>
                    <div className={`mb-6 ${disabled ? "opacity-50" : ""}`}>
                        <DarkButton text={"Отправить"} disabled={disabled} />
                    </div>
                </div>
            </form>
        </div>
    );
}

export default AddApplication;

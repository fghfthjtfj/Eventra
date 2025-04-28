import { Link, useNavigate } from "react-router-dom";
import createArtistRequest from "../../images/createArtistRequest.png"
import zvezda from "../../images/zvezda.svg"
import attention from "../../images/attention.svg"
import { useCategories } from "../../context/categoryContext";
import { DarkButton } from "../UI/Button/button";
import { useUser } from "../../context/userContext";
import axios from "../../axios"
import Loader from "../UI/Loader/loader";
import { useCities } from "../../context/citiesContext";
import { CSSTransition } from 'react-transition-group';
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";

const AddArtistRequest = () => {

    const { user } = useUser()
    const [disabled, setDisabled] = useState(false)
    const { categories } = useCategories()
    const { cities } = useCities()
    const [message, setMessage] = useState(null);
    const [messageOn, setMessageOn] = useState(false)

    const [personAccept, setPersonAccept] = useState(false);
const [cityInput, setCityInput] = useState("");
const [filteredCities, setFilteredCities] = useState([]);
const [showCityDropdown, setShowCityDropdown] = useState(false);
const cityInputRef = useRef(null);


    const validateFullName = (fullName) => {
        const words = fullName.trim().split(" ");
        return words.length === 2 && words[0] && words[1];
    };
const handleCityInputChange = (e) => {
    const value = e.target.value;
    setCityInput(value);
    setFormData(prevData => ({
        ...prevData,
        setCitySearch: value,
    }));

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
        setCitySearch: city,
    }));
    setFilteredCities([]);
    setShowCityDropdown(false);
};
useEffect(() => {
    const handleClickOutside = (event) => {
        if (cityInputRef.current && !cityInputRef.current.contains(event.target)) {
            setShowCityDropdown(false);
        }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    };
}, []);

    const handleGoForm = async (e) => {
        if (!personAccept) return;
        e.preventDefault();
        setDisabled(true);

        if (!validateFullName(formData.fullName)) {
            setDisabled(false);
            alert("Поле 'Имя Фамилия' должно содержать два слова, разделённых пробелом.");
            return;
        }

        let formDataToSend = new FormData();

        if (formData.mainPhotoFile) {
            formDataToSend.append('files', formData.mainPhotoFile);
        }

        if (formData.backGroundPhotoFile) {
            formDataToSend.append('files', formData.backGroundPhotoFile);
        }

        if (formData.galleryFiles && formData.galleryFiles.length > 0) {
            formData.galleryFiles.forEach(file => formDataToSend.append('files', file));
        }

        axios.post('/upload', formDataToSend, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
            .then((res) => {
                setFormData(prevData => ({
                    ...prevData,
                    mainPhoto: res.data.filenames[0],
                    backGroundPhoto: res.data.filenames[1],
                    gallery: res.data.filenames.slice(2),

                }));

                axios.post("/artist-request", {
                city: formData.setCitySearch,
                artistId: user._id,
                categoryId: formData.category,
                description: JSON.parse(JSON.stringify(formData.description)),
                priceFrom: formData.priceFrom,
                priceTo: formData.priceTo.trim() ? formData.priceTo : null, // ← исправление здесь
                mainPhoto: res.data.filenames[0],
                backGroundPhoto: res.data.filenames[1],
                photo: res.data.filenames.slice(2),
                link_video: formData.videoLinks,
                vk: formData.vk,
                instagram: formData.instagram,
                youtube: formData.youtube,
                tiktok: formData.tiktok
            });


                axios.patch("/user", {
                    lastName: formData.fullName.split(' ')[0],
                    firstName: formData.fullName.split(' ')[1],
                    userName: formData.userName,
                    phoneNumber: formData.phoneNumber,
                    telegramId: user.telegramId
                })
                    .then((res) => {
                        window.location.href = "/artist-request-done";
                    })
            })
    };


    const [formData, setFormData] = useState({
        fullName: '',
        userName: '',
        phoneNumber: '',
        category: [],
        setCitySearch: "",
        priceFrom: '',
        priceTo: '',
        description: '',
        instagram: '',
        vk: '',
        youtube: '',
        tiktok: '',
        mainPhoto: null,
        mainPhotoFile: null,
        backGroundPhoto: null,
        backGroundPhotoFile: null,
        gallery: [],
        galleryFiles: [],
        videoLinks: ['', '', ''],
    });


    const handleFileChange = (e) => {
        const { name, files } = e.target;
        const file = files[0];

        const maxSize = 10 * 1024 * 1024;
        const validFormats = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/heic'];

        if (file?.size > maxSize) {
            showMessage("Размер фото больше 10 мб");
            return;
        }

        if (!validFormats.includes(file?.type)) {
            showMessage("Загрузите фото формата .jpeg/.jpg/.png");
            return;
        }

        if (name === 'mainPhoto') {
            setFormData((prevData) => ({
                ...prevData,
                mainPhotoFile: file,
            }));
        } else if (name === 'backGroundPhoto') {
            setFormData((prevData) => ({
                ...prevData,
                backGroundPhotoFile: file,
            }));
        } else {
            const index = parseInt(name.replace('gallery', ''), 10) - 1;

            setFormData((prevData) => {
                const updatedGalleryFiles = [...prevData.galleryFiles];
                updatedGalleryFiles[index] = file;
                return {
                    ...prevData,
                    galleryFiles: updatedGalleryFiles,
                };
            });
        }
    };

    const showMessage = (message) => {
        setMessage(message);
        setMessageOn(true)
        setTimeout(() => {
            setMessage(null);
            setMessageOn(false)
        }, 3000);
    };
    const handleSingleGalleryChange = (e, indexClicked) => {
        const newFiles = Array.from(e.target.files);
        // Текущее состояние уже загруженных файлов
        const existingFiles = [...formData.galleryFiles];

        const MAX_FILES = 4;  // Для галереи
        const currentCount = existingFiles.filter(Boolean).length;
        const freeSlots = MAX_FILES - currentCount;

        // Проверка форматов и размера
        const maxSize = 10 * 1024 * 1024; // 5 MB
        const validFormats = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/heic'];
        for (let file of newFiles) {
            if (file.size > maxSize) {
                showMessage("Размер фото больше 10 МБ.");
                return;
            }
            if (!validFormats.includes(file.type)) {
                showMessage("Загрузите фото формата .jpeg/.jpg/.png.");
                return;
            }
        }

        // Если у нас уже 4 изображения (максимум),
        // то заменяем то, по которому кликнули
        if (currentCount === MAX_FILES) {
            if (newFiles.length > 1) {
                showMessage("Можно заменить только одно фото (все слоты заполнены).");
                return;
            }
            // Заменяем фото в текущем indexClicked
            existingFiles[indexClicked] = newFiles[0];
        } else {
            // Ещё есть свободные слоты
            // Проверим, достаточно ли свободных слотов для выбранных файлов
            if (newFiles.length > freeSlots) {
                showMessage(`Вы выбрали ${newFiles.length} файлов, а доступно только ${freeSlots} слотов.`);
                return;
            }

            // Если пользователь кликнул на пустую ячейку — добавляем в следующие свободные ячейки
            // Если ячейка занята, но есть ещё свободные, по ТЗ нужно «в первый свободный квадрат».
            // Рассмотрим логику добавления:
            let fileIndex = 0;
            // Проходимся по массиву с 0 по 3, ищем свободные места
            for (let i = 0; i < MAX_FILES; i++) {
                if (!existingFiles[i]) {
                    existingFiles[i] = newFiles[fileIndex];
                    fileIndex++;
                    if (fileIndex >= newFiles.length) break;
                }
            }
        }

        setFormData((prev) => ({
            ...prev,
            galleryFiles: existingFiles
        }));
    };

    const handleSingleProfileChange = (e, indexClicked) => {
        const newFiles = Array.from(e.target.files);

        const MAX_PROFILE_FILES = 2;
        // Собираем уже загруженные файлы (если есть)
        const existingProfileFiles = [];
        if (formData.mainPhotoFile) existingProfileFiles[0] = formData.mainPhotoFile;
        if (formData.backGroundPhotoFile) existingProfileFiles[1] = formData.backGroundPhotoFile;

        const currentCount = existingProfileFiles.filter(Boolean).length;
        const freeSlots = MAX_PROFILE_FILES - currentCount;

        // Проверка формата и размера
        const maxSize = 10 * 1024 * 1024; // 5 MB
        const validFormats = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/heic'];
        for (let file of newFiles) {
            if (file.size > maxSize) {
                showMessage("Размер фото больше 10 МБ.");
                return;
            }
            if (!validFormats.includes(file.type)) {
                showMessage("Загрузите фото формата .jpeg/.jpg/.png.");
                return;
            }
        }

        // Если уже 2 файла, значит заменяем фото, соответствующее indexClicked
        if (currentCount === MAX_PROFILE_FILES) {
            if (newFiles.length > 1) {
                showMessage("Можно заменить только одно фото (все слоты заполнены).");
                return;
            }
            // Заменяем конкретно по indexClicked
            existingProfileFiles[indexClicked] = newFiles[0];
        } else {
            // Есть свободные слоты
            // Проверим, достаточно ли слотов
            if (newFiles.length > freeSlots) {
                showMessage(`Вы выбрали ${newFiles.length} файлов, а свободно только ${freeSlots} слотов.`);
                return;
            }
            // Добавляем файлы в "первые свободные" позиции
            let fileIndex = 0;
            for (let i = 0; i < MAX_PROFILE_FILES; i++) {
                if (!existingProfileFiles[i]) {
                    existingProfileFiles[i] = newFiles[fileIndex];
                    fileIndex++;
                    if (fileIndex >= newFiles.length) break;
                }
            }
        }

        // Сохраняем результат обратно в formData
        setFormData((prev) => ({
            ...prev,
            mainPhotoFile: existingProfileFiles[0] || null,
            backGroundPhotoFile: existingProfileFiles[1] || null,
        }));
    };




    const handleUpdateVideoLink = (event) => {
        const parts = event.target.name.split('_');
        const index = parts.length > 1 ? parseInt(parts[1]) : NaN;
        let links = formData.videoLinks
        links[index - 1] = event.target.value
        setFormData({ ...formData, videoLinks: links })
    }

    useEffect(() => {
        if (user && categories) {
            let namePerson = ''
            if (user?.firstName && user?.lastName) {
                namePerson = user?.firstName + ' ' + user?.lastName
            }
            setFormData({
                ...formData,
                fullName: namePerson,
                userName: user?.userName || '',
                phoneNumber: user?.phoneNumber || '',
                category: categories?.length > 0 ? [categories?.[0]?._id] : [],
                setCitySearch: user?.setCitySearch || '',
            });
        }
    }, [user, categories]);

    const handleChange = (e) => {
        const { name, options } = e.target;
        const selectedOptions = Array.from(options).filter(option => option.selected).map(option => option.value);
        setFormData({ ...formData, [name]: selectedOptions });
    };

    if (!cities) {
        return <Loader />
    }


    return (
        <div className="relative">
            {
                messageOn && <CSSTransition timeout={300} classNames="popup">
                    <motion.div
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 1, y: -20 }}
                        transition={{ duration: 0.5 }}
                        className="fixed top-0 w-full"
                    >
                        <div className="flex justify-center mt-[24px]">
                            <div className="opacity-100 text-center py-[8px] w-[300px] z-10 rounded-3xl text-black border-black border-[2px] bg-white flex justify-center items-center">
                                {message}
                            </div>
                        </div>
                    </motion.div>
                </CSSTransition>
            }
            <div className="flex flex-col items-center justify-center mt-[68px]">
                <img src={createArtistRequest} alt="createArtistRequest" />
                <div className="text-[24px] font-bold leading-[29px] text-center">Создайте анкету артиста,<br />чтобы получать заявки</div>
                <div className="mt-[18px] text-[16px]">Или посмотрите <Link className="underline" to={"/catalog-applications"}>каталог заявок</Link></div>
            </div>
            <form className="mt-[78px] px-[16px]" onSubmit={handleGoForm}>
                <div>
                    <div className="text-[20px] font-bold">Контактная информация</div>
                </div>
                <div className="mt-[27px] flex flex-col gap-[24px]">
                    <div className="flex flex-col gap-[8px]">
                        <div className="flex text-[14px] opacity-70 gap-[8px]"><div>Имя Фамилия</div><div><img src={zvezda} alt="zvezda" /></div></div>
                        <div className="flex gap-2 text-[12px] items-center opacity-70"><img src={attention} alt="attention" />Так ваше имя увидит заказчик </div>
                        <div><input required value={formData.fullName} onChange={(event) => setFormData({ ...formData, fullName: event.target.value })} type="text" placeholder="Иван Иванов" className=" px-[24px] py-[16px] border-black border-solid border-2 w-full" /></div>
                    </div>
                    <div className="flex flex-col gap-[8px]">
                        <div className="flex text-[14px] opacity-70 gap-[8px]"><div>Ваш ник Telegram</div><div><img src={zvezda} alt="zvezda" /></div></div>
                        <div className="flex gap-2 text-[12px] items-center  opacity-70"><img src={attention} alt="attention" />Проверьте, что у вас открыты личные сообщения в Telegram</div>
                        <div><input required type="text" placeholder="@yournick"
                              value={'@' + formData.userName.replace(/^@+/, '')} // Убираем все лишние символы @
                              onChange={(event) =>
                                setFormData({
                                  ...formData,
                                  userName: event.target.value.replace(/^@*/, ''), // Убираем все начальные @, чтобы добавить один
                                })
                              }className="px-[24px] py-[16px] border-black border-solid border-2 w-full"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-[8px]">
                        <div className="flex text-[14px] opacity-70 gap-[8px]"><div>Ваш номер телефона</div><div><img src={zvezda} alt="zvezda" /></div></div>
                        <div><input value={formData.phoneNumber} required onChange={(event) => setFormData({ ...formData, phoneNumber: event.target.value })} type="text" placeholder="+7 999 000 00 00" className="px-[24px] py-[16px] border-black border-solid border-2 w-full" /></div>
                    </div>
                </div>
                <div className="mt-[48px]">
                    <div className="text-[20px] font-bold">Ваша анкета</div>
                </div>
                <div className="mt-[27px] flex flex-col gap-[24px]">
                    <div className="flex flex-col gap-[8px]">
                        <div className="flex text-[14px] opacity-70 gap-[8px]"><div>Категория</div><div><img src={zvezda} alt="zvezda" /></div></div>
                        <div className="select-wrapper">
                            <select required value={formData.category} name="category" onChange={handleChange} className="custom-select" id="1">
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
                            value={cityInput}
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
                        <div className="flex text-[14px] opacity-70 gap-[8px]"><div>Укажите диапазон цен</div><div><img src={zvezda} alt="zvezda" /></div></div>
                        <div className="flex items-center gap-[8px]">
                            <input required value={formData.priceFrom} onChange={(event) => setFormData({ ...formData, priceFrom: event.target.value })} type="text" placeholder="От 1 000 ₽" className=" px-[24px] py-[16px] border-black border-solid border-2 w-full" />
                            <input value={formData.priceTo} onChange={(event) => setFormData({ ...formData, priceTo: event.target.value })} type="text" placeholder="До 10 000 ₽" className=" px-[24px] py-[16px] border-black border-solid border-2 w-full" />
                        </div>
                    </div>
                    <div className="flex flex-col gap-[8px]">
                        <div className="flex text-[14px] opacity-70 gap-[8px]"><div>Обо мне. Услуги и стоимость</div></div>
                        <div className="flex gap-2 text-[12px] items-center opacity-70"><img src={attention} alt="attention" />Здесь можете расписать ваш прайс-лист</div>
                        <div className="flex items-center gap-[8px]">
                            <textarea value={formData.description} onChange={(event) => setFormData({ ...formData, description: event.target.value })} className="h-[132px] px-[24px] py-[16px] border-black border-solid border-2 w-full" name="2" id="2" placeholder="Ваши сильные стороны, опыт и стоимость работ. Яркое описание увеличивает шансы  на получение заявки!"></textarea>
                        </div>
                    </div>
                    <div className="flex flex-col gap-[8px]">
                        <div className="flex text-[14px] opacity-70 gap-[8px]"><div>Instagram</div></div>
                        <div><input value={formData.instagram} onChange={(event) => setFormData({ ...formData, instagram: event.target.value })} type="text" placeholder="@yournick" className="px-[24px] py-[16px] border-black border-solid border-2 w-full" /></div>
                    </div>
                    <div className="flex flex-col gap-[8px]">
                        <div className="flex text-[14px] opacity-70 gap-[8px]"><div>Vkontakte</div></div>
                        <div><input value={formData.vk} onChange={(event) => setFormData({ ...formData, vk: event.target.value })} type="text" placeholder="https://" className="px-[24px] py-[16px] border-black border-solid border-2 w-full" /></div>
                    </div>
                    <div className="flex flex-col gap-[8px]">
                        <div className="flex text-[14px] opacity-70 gap-[8px]"><div>YouTube</div></div>
                        <div><input value={formData.youtube} onChange={(event) => setFormData({ ...formData, youtube: event.target.value })} type="text" placeholder="https://" className="px-[24px] py-[16px] border-black border-solid border-2 w-full" /></div>
                    </div>
                    <div className="flex flex-col gap-[8px]">
                        <div className="flex text-[14px] opacity-70 gap-[8px]"><div>TikTok</div></div>
                        <div><input value={formData.tiktok} onChange={(event) => setFormData({ ...formData, tiktok: event.target.value })} type="text" placeholder="@yournick" className="px-[24px] py-[16px] border-black border-solid border-2 w-full" /></div>
                    </div>
                    <div className="flex flex-col gap-[8px]">
                        <div>Максимальный размер фото 10 мб</div>

                        <div className="flex text-[14px] opacity-70 gap-[8px]">
                            <div>Добавьте аватарку и фото фона</div>
                            <div><img src={zvezda} alt="zvezda" /></div>
                        </div>
                        <div className="flex gap-2 text-[12px] items-center opacity-70">
                            <img src={attention} alt="attention" />
                            Первое окно – аватарка, второе – фото фона вашего профиля
                        </div>
                        <div className="flex w-full gap-[16px]">
                            {Array.from({ length: 2 }).map((_, index) => (
                                <div key={index} className="relative w-full h-[60px]">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        id={`profileImages_${index}`}
                                        name={`profileImages_${index}`}
                                        className="hidden"
                                        //multiple
                                        onChange={(e) => handleSingleProfileChange(e, index)}
                                    />
                                    <label
                                        htmlFor={`profileImages_${index}`}
                                        className="border-black border-solid border-2 w-full h-full flex items-center justify-center text-[40px]"
                                    >
                                        {index === 0 && formData.mainPhotoFile ? (
                                            <img
                                                src={URL.createObjectURL(formData.mainPhotoFile)}
                                                alt="mainPhoto"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : index === 1 && formData.backGroundPhotoFile ? (
                                            <img
                                                src={URL.createObjectURL(formData.backGroundPhotoFile)}
                                                alt="backGroundPhoto"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            '+'
                                        )}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col gap-[8px]">
                        <div className="flex text-[14px] opacity-70 gap-[8px]">
                            <div>Добавьте фото в галерею</div>
                        </div>
                        <div className="flex w-full gap-[16px]">
                            {Array.from({ length: 4 }).map((_, index) => (
                                <div key={index} className="relative w-full h-[60px]">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        id={`galleryImages_${index}`}
                                        name={`galleryImages_${index}`}
                                        className="hidden"
                                        //multiple
                                        onChange={(e) => handleSingleGalleryChange(e, index)}
                                    />
                                    <label
                                        htmlFor={`galleryImages_${index}`}
                                        className="border-black border-solid border-2 w-full h-full flex items-center justify-center text-[40px]"
                                    >
                                        {formData.galleryFiles[index] ? (
                                            <img
                                                src={URL.createObjectURL(formData.galleryFiles[index])}
                                                alt={`gallery${index}`}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            '+'
                                        )}
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex flex-col gap-[8px]">
                        <div className="flex text-[14px] opacity-70 gap-[8px]"><div>Добавьте видео</div></div>
                        <div className="flex gap-2 text-[12px] items-center opacity-70"><img src={attention} alt="attention" />Ссылка на Vk-видео</div>
                        <div><input name="link_1" value={formData.videoLinks[0]} onChange={(event) => handleUpdateVideoLink(event)} type="text" placeholder="https://" className="px-[24px] py-[16px] border-black border-solid border-2 w-full" /></div>
                        {formData.videoLinks[0] !== '' && <div><input name="link_2" value={formData.videoLinks[1]} onChange={(event) => handleUpdateVideoLink(event)} type="text" placeholder="https://" className="px-[24px] py-[16px] border-black border-solid border-2 w-full" /></div>}
                        {formData.videoLinks[0] !== '' && formData.videoLinks[1] !== '' && <div><input name="link_3" value={formData.videoLinks[2]} onChange={(event) => handleUpdateVideoLink(event)} type="text" placeholder="https://" className="px-[24px] py-[16px] border-black border-solid border-2 w-full" /></div>}
                    </div>
                    <div className="flex gap-3">
                        <input type="checkbox" required value={personAccept} onChange={(e) => setPersonAccept(e.target.checked)} id="accept_pers_data" /> <label htmlFor="accept_pers_data" className="text-[12px]"><Link className='text-black underline' to="https://docs.google.com/document/d/1ZeJG7cl2raszu6VWoclo38WSxZKl_qRt/edit">Согласен</Link> на обработку моих персональных данных согласно <Link className='text-black underline' to={"https://docs.google.com/document/d/13SBC6s4-XB9GCrZEUbNjqsj-_SBw5nvE/edit"}>Политике</Link></label>
                    </div>
                    <div className={`mb-6 ${disabled ? "opacity-50" : ""}`} >
                        <DarkButton text={"Отправить"} disabled={disabled} />
                    </div>
                </div>
            </form>
        </div>
    );
}

export default AddArtistRequest;
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useCategories } from '../../context/categoryContext';
import Loader from '../UI/Loader/loader';
import axios from "../../axios";
import { useUser } from '../../context/userContext';
import { useArtist } from "../../context/artistContext";
import { useCities } from '../../context/citiesContext';
import { useSubscription } from '../../context/subscriptionContext';

const Header = () => {
  let tg = window.Telegram.WebApp;
  let userId = tg.initDataUnsafe.user ? tg.initDataUnsafe.user.id : "";

  const { categories, setCategories } = useCategories();
  const { user, setUser } = useUser();
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingArtist, setLoadingArtist] = useState(true);
  const { artist, setArtist } = useArtist();
  const { subscription, setSubscription } = useSubscription();

  const { cities } = useCities();

  const [cityInput, setCityInput] = useState('');
  const [filteredCities, setFilteredCities] = useState([]);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const cityInputRef = useRef(null);

  const handleCityInputChange = (e) => {
    const value = e.target.value;
    setCityInput(value);

    if (value.length > 0) {
      const filtered = cities.filter((city) =>
        city.toLowerCase().startsWith(value.toLowerCase())
      );
      setFilteredCities(filtered);
      setShowCityDropdown(filtered.length > 0);
    } else {
      setFilteredCities([]);
      setShowCityDropdown(false);
    }
  };

  const handleCitySelect = (selectedCity) => {
    setCityInput(selectedCity);
    if (user && user.telegramId) {
      axios
        .patch("/selectcity", { telegramId: user.telegramId, setCitySearch: selectedCity })
        .then(() => {
          setUser((prevUser) => ({ ...prevUser, setCitySearch: selectedCity }));
          window.location.reload();
        })
        .catch((err) => {
          console.log(err);
        });
    }
    setShowCityDropdown(false);
  };

  // Закрытие списка при клике вне поля ввода
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cityInputRef.current && !cityInputRef.current.contains(event.target)) {
        setShowCityDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // При старте — установить в инпут город, если он есть у пользователя
  useEffect(() => {
    if (user && user.setCitySearch) {
      setCityInput(user.setCitySearch);
    }
  }, [user]);

  // Проверка подписки пользователя
  useEffect(() => {
    if (user && user.telegramId) {
      axios
        .get('/subscription', { params: { userId: user._id } })
        .then((res) => {
          setSubscription(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [user, setSubscription]);

  // Загрузка категорий
  useEffect(() => {
    if (categories.length === 0 && user) {
      axios
        .get("/category", { params: { city: user.setCitySearch } })
        .then((res) => {
          setCategories(res.data);
          setLoadingCategories(false);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setLoadingCategories(false);
    }
  }, [categories, setCategories, user]);

  // Загрузка пользователя
  useEffect(() => {
    if (!user) {
      axios
        .get(`/user?telegramId=${userId}`)
        .then((res) => {
          setUser(res.data[0]);
          setLoadingUser(false);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setLoadingUser(false);
    }
  }, [user, setUser, userId]);

  // Загрузка артиста, если роль "artist"
  useEffect(() => {
    if (user?.role === 'artist') {
      axios
        .get(`/artist-request?artistId=${user._id}`)
        .then((res) => {
          setArtist(res.data[0]);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setLoadingArtist(false);
    }
  }, [user, setArtist]);

  if (loadingCategories || loadingUser || loadingArtist) {
    return <Loader />;
  }

  return (
    <div className='relative'>
      <div className="h-[48px] shadow-custom flex justify-between items-center px-[16px] bg-white relative">
        {/* Блок ввода города с автодополнением */}
        <div className="current_city flex justify-start w-1/3">
      <div className="text-[16px] font-bold mr-2">Город:</div>
            <div className="relative" ref={cityInputRef}>
            <input
              type="text"
              value={cityInput}
              onChange={handleCityInputChange}
              className="text-[12px] underline w-[110px]"
            />
            {showCityDropdown && (
              <ul className="absolute bg-white border border-gray-300 w-full max-h-60 overflow-y-auto z-20 text-[12px]">
                {filteredCities.map((city, index) => (
                  <li
                    key={city + index}
                    onClick={() => handleCitySelect(city)}
                    className="px-2 py-1 hover:bg-gray-100 cursor-pointer"
                  >
                    {city}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Лого EVENTRA */}
        <div className='absolute left-[50%] ml-[-38px] text-center'>
          <Link to="/" className="text-[16px] font-bold w-max">
            EVENTRA
          </Link>
        </div>

        {/* Ссылка на профиль */}
        {user.role && user.role !== "" && (
          <Link
            to={`${
              user.role === 'customer'
                ? "/my-applications"
                : subscription !== null && new Date(subscription.dateExpression) > new Date()
                ? "/my-requests"
                : "/subscription"
            }`}
            className="text-[14px] flex justify-end font-bold w-1/3"
          >
            Мой профиль
          </Link>
        )}
      </div>
    </div>
  );
};

export default Header;

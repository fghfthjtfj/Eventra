import { useEffect, useState, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "../../axios";
import Loader from "../UI/Loader/loader";
import createArtistRequest from "../../images/createArtistRequest.png";
import star from "../../images/Star.svg";
import coins from "../../images/Coins.svg";
import inst from "../../images/Instagram.svg";
import vk from "../../images/VK.svg";
import tiktok from "../../images/Tiktok.svg";
import youtube from "../../images/Youtube.svg";
import arrow from "../../images/arrow.svg";
import CategoriesButton from "../UI/Categories/categoryButton";
import { useUser } from "../../context/userContext";
import crossIcon from "../../images/close.svg";

const AddMyRequest = () => {
  const [showMore, setShowMore] = useState(false);
  const [visiblePhotos, setVisiblePhotos] = useState(8);
  const [reviews, setReviews] = useState([]);
  const { user } = useUser();

  // Отслеживание загрузки и наличия анкеты
  const [loading, setLoading] = useState(true);
  const [loading2, setLoading2] = useState(true);
  const [request, setRequest] = useState({});
  const [added, setAdded] = useState(false);

  // Заказы (для счётчика "Мои заказы")
  const [orders, setOrders] = useState([]);

  // Параметры из URL
  const { idCategory } = useParams();

  // Эффект для загрузки заказов
  useEffect(() => {
    if (user) {
      axios
        .get("/order", { params: { artistId: user._id } })
        .then((res) => {
          setOrders(res.data);
          setLoading(false);
        })
        .catch((err) => console.log(err));
    }
  }, [user]);

  // Эффект для загрузки анкеты
  useEffect(() => {
    if (user) {
      axios
        .get(`/artist-request?artistId=${user._id}`)
        .then((res) => {
          if (res.data.length > 0) {
            setRequest(res.data[0]);
            setAdded(true);
          }
          setLoading2(false);
        })
        .catch((err) => console.log(err));
    }
  }, [user]);

  // Функция для расчёта среднего рейтинга из массива отзывов
  function ratingCalculate(reviewsArr) {
    if (!reviewsArr.length) return 0;
    let total = 0;
    reviewsArr.forEach((r) => {
      total += r.grade;
    });
    return parseFloat((total / reviewsArr.length).toFixed(1));
  }

  // Функция для скролла к отзывам (если бы был блок c ref={reviewsRef})
  const reviewsRef = useRef(null);
  const handleScrollToReviews = () => {
    if (reviewsRef.current) {
      reviewsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Функция для раскладки ссылки на Vk-видео во фрейм
  function getVKVideoEmbedUrl(url) {
    if (!url || typeof url !== "string") return null;
    try {
      const parts = url.split("/");
      const videoId = parts[parts.length - 1];
      const oid = videoId.split("-")[1].split("_")[0];
      const id = videoId.split("-")[1].split("_")[1];
      return `https://vk.com/video_ext.php?oid=-${oid}&id=${id}&hd=2&autoplay=0`;
    } catch (error) {
      console.error("Error processing URL:", url, error);
      return null;
    }
  }

  // Показ галереи — кнопка «Показать ещё»
  const toggleShowMore = () => {
    if (showMore) {
      setVisiblePhotos(8);
    } else {
      setVisiblePhotos(visiblePhotos + 8);
    }
    setShowMore(!showMore);
  };

  // Если данные ещё грузятся — показать лоадер
  if (loading || loading2) {
    return <Loader />;
  }

  // Если анкета не найдена (added === false) — показываем приглашение создать
  if (!added) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen mt-[-80px] mb-[80px]">
        <img src={createArtistRequest} alt="createArtistRequest" />
        <Link
          to={"/add-artist-request"}
          className="underline text-[24px] font-bold leading-[29px] text-center"
        >
          Создайте анкету артиста,
          <br />
          чтобы получать заявки
        </Link>
      </div>
    );
  }

  // Иначе рендерим саму анкету
  return (
    <div>
      <div className="py-[44px] flex gap-[33px] justify-center">
        <div className="underline font-bold text-[20px]">Моя анкета</div>
        <Link to={"/my-requests"} className="text-[20px] opacity-60">
          Мои заказы ({orders.length})
        </Link>
      </div>

      {/* Фоновое изображение + кнопка закрытия (пока без иконки) */}
        <div className="w-full h-[160px] relative">
          <img
            src={process.env.REACT_APP_API_URL + request.backGroundPhoto}
            className="absolute top-0 left-0 w-full h-full object-cover -z-10"
            alt="bgartist"
          />
          <Link
            to={`/catalog-artist?id=${idCategory}`}
            className="absolute top-[16px] right-[16px]"
          >
            <img className="w-[16px]" src={crossIcon} alt="close" />
          </Link>
      </div>

      {/* Аватарка */}
      <div className="rounded-full flex justify-center w-full -mt-[80px]">
        <div className="w-[160px] h-[160px] rounded-full overflow-hidden flex items-center justify-center bg-gray-200">
            <img
              className="w-full h-full object-cover"
              src={process.env.REACT_APP_API_URL + request.mainPhoto}
              alt="picture"
            />
        </div>
      </div>


      <div className="px-[16px]">
        <div className="text-center text-[30px] font-bold mt-[35px]">
          {request.artistId.lastName + " " + request.artistId.firstName}
        </div>
        <div className="flex items-center flex-wrap gap-3 justify-center mt-[24px]">
          {request.categoryId.map((el) => (
            <CategoriesButton category={el} key={el._id} />
          ))}
        </div>
        <div className="text-center text-[30px] font-bold mt-[35px]">
          <div className="flex flex-wrap items-center justify-center w-full mt-[24px] gap-3">
            <div className="flex gap-1 items-center justify-center mb-2">
              <img src={coins} className="w-[16px]" alt="coins" />
              <div className="text-[18px] font-bold">{request.price} ₽</div>
            </div>
            {reviews.length > 0 && (
              <div
                className="flex items-center justify-center -mt-[8px] cursor-pointer"
                onClick={handleScrollToReviews}
              >
                <img src={star} alt="star" />
                <div className="ml-[1px] mr-[6px] font-bold text-[18px]">
                  {ratingCalculate(reviews)}
                </div>
                <div className="underline text-[18px] font-bold">
                  Отзывы ({reviews.length})
                </div>
              </div>
            )}
          </div>
          <div className="mt-[36px] flex gap-5 justify-center items-center">
            {request.instagram?.trim() && (
              <Link to={`https://instagram.com/${request.instagram}`}>
                <img src={inst} alt="inst" />
              </Link>
            )}
            {request.vk?.trim() && (
              <Link to={`${request.vk}`}>
                <img src={vk} alt="vk" />
              </Link>
            )}
            {request.youtube?.trim() && (
              <Link to={`${request.youtube}`}>
                <img src={youtube} alt="youtube" />
              </Link>
            )}
            {request.tiktok?.trim() && (
              <Link to={`https://tiktok.com/${request.tiktok}`}>
                <img src={tiktok} alt="tiktok" />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Всё, что ниже соц. сетей, с левым отступом и без центрирования */}
      <div className="px-[16px] mt-[64px] text-[16px] leading-5">
        <div className="mb-[21px] font-bold text-[20px]">
          Обо мне. Услуги и стоимость
        </div>
        <div className="mb-[21px] whitespace-pre-wrap">
          {request.description}
        </div>
        <div>г.{request.city}</div>

        {request.photo?.length > 0 && (
          <div className="mt-[39px]">
            <div className="font-bold text-[24px]">Галерея</div>
            <div className="mt-[16px] flex flex-wrap gap-[5px] justify-around">
              {request.photo.slice(0, visiblePhotos).map((photo, index) => (
                <img
                  key={index}
                  src={process.env.REACT_APP_API_URL + photo}
                  className="w-full"
                  alt={`photo ${index + 1}`}
                />
              ))}
            </div>
            <div className="mt-[29px] flex justify-center">
              <img
                src={arrow}
                alt="arrow"
                onClick={toggleShowMore}
                className={`cursor-pointer ${showMore ? "rotate-180" : ""}`}
              />
            </div>
          </div>
        )}

        {Array.isArray(request.link_video) &&
          request.link_video.join("").trim() && (
            <div className="mt-[50px]">
              <div className="mb-[32px] text-[20px] font-bold">Видео</div>
              <div>
                {request.link_video.map((el, index) => {
                  if (el?.trim()) {
                    const embedUrl = getVKVideoEmbedUrl(el);
                    return (
                      <iframe
                        key={index}
                        src={embedUrl}
                        title={`VK video player ${index}`}
                        width="560"
                        height="315"
                        frameBorder="0"
                        allowFullScreen
                        className="w-full h-[200px] border rounded-lg overflow-hidden"
                      />
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          )}
      </div>

      {/* Кнопка "Редактировать" (пример) */}
      <div className="bg-white p-4 shadow-custom mb-6">
        <Link
  to="/edit-my-request"
  className="mt-4 w-full flex justify-center items-center bg-black font-[Inter] text-[20px] font-bold rounded-2xl text-white py-4"
>
  Редактировать
</Link>

      </div>
    </div>
  );
};

export default AddMyRequest;

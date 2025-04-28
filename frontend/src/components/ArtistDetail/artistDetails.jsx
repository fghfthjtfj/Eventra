import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import star from "../../images/Star.svg";
import coins from "../../images/Coins.svg";
import inst from "../../images/Instagram.svg";
import vk from "../../images/VK.svg";
import tiktok from "../../images/Tiktok.svg";
import youtube from "../../images/Youtube.svg";
import arrow from "../../images/arrow.svg";
import Review from "./review";
import crossIcon from "../../images/close.svg";
import { Link } from "react-router-dom";
import { DarkButton, LightButton2 } from "../UI/Button/button";
import axios from "../../axios";
import CategoriesButton from "../UI/Categories/categoryButton";
import Loader from "../UI/Loader/loader";
import { useUser } from "../../context/userContext";

const ArtistDetails = () => {
  const { id, idCategory } = useParams();
  const [showMore, setShowMore] = useState(false);
  const [showMoreReview, setShowMoreReview] = useState(false);
  const [visiblePhotos, setVisiblePhotos] = useState(8);
  const [visibleReview, setVisibleReview] = useState(3);
  const [request, setRequest] = useState({});
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const [reviews, setReviews] = useState([]);
  const [myApplications, setMyApplications] = useState([])
  const [showPopup, setShowPopup] = useState(false)

  // Create a reference for the reviews section
  const reviewsRef = useRef(null);

  useEffect(() => {
    if (user) {
      axios.get('/customer-requests', { params: { customerId: user._id } })
        .then((res) => {
          setMyApplications(res.data.filter((el) => el.order == false && el.approved == true && el.isReject == false))
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }, [user])

  useEffect(() => {
    if (id) {
      axios.get('/review', { params: { artistId: id } })
        .then((res) => {
          setReviews(res.data.filter((el) => el.approved === true));
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [id]);

  const handleOk = (id) => {
    setShowPopup(false)
    axios.post('/order', {
      customerRequestId: id,
      artistId: request.artistId._id
    })
      .then((res) => {
        window.location.href = `https://t.me/${request.artistId.userName}`;
      })
      .catch((err) => {
        console.log(err)
      })
  }

  const handleExit = () => {
    setShowPopup(false)
  }


  const handleContactClick = (event) => {
    event.stopPropagation();
    if (myApplications.length === 0) {
      window.location.href = '/my-add-application'
      return
    }
    else {
      setShowPopup(true)
    }
  };


  useEffect(() => {
    axios.get("/artist-request", { params: { artistId: id } })
      .then((res) => {
        setRequest(res.data[0]);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  const toggleShowMore = () => {
    if (showMore) {
      setVisiblePhotos(8);
    } else {
      setVisiblePhotos(visiblePhotos + 8);
    }
    setShowMore(!showMore);
  };

  const toggleShowMoreReview = () => {
    if (showMoreReview) {
      setVisibleReview(3);
    } else {
      setVisibleReview(visiblePhotos + 3);
    }
    setShowMoreReview(!showMoreReview);
  };

  const handleScrollToReviews = () => {
    if (reviewsRef.current) {
      reviewsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  function ratingCalculate(reviews) {
    let rating = 0;
    for (let i = 0; i < reviews.length; i++) {
      rating += reviews[i].grade;
    }
    return parseFloat((rating / reviews.length).toFixed(1));
  }
    function getVKVideoEmbedUrl(url) {
        if (!url || typeof url !== "string") {
            console.error("Invalid URL:", url);
            return null;
        }

        try {
            const match = url.match(/video(-?\d+)_(\d+)/);
            if (!match) {
                console.error("URL не соответствует формату VK:", url);
                return null;
            }

            const oid = match[1]; // ID пользователя или группы
            const id = match[2];  // ID видео

            return `https://vk.com/video_ext.php?oid=${oid}&id=${id}&hd=2&autoplay=0`;
        } catch (error) {
            console.error("Error processing URL:", url, error);
            return null;
        }
    }



  if (loading) return <Loader />;

  return (
    <div className="w-full font-[Inter] relative">
      {showPopup &&
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md shadow-lg max-w-xs text-center">
            <p className="text-lg font-semibold">Выберите заявку по которой хотите связаться:</p>
            <div className='flex flex-col gap-2 mt-4'>
              {myApplications.map((el) => {
                return (
                  <LightButton2 text={el.eventName} onClick={() => handleOk(el._id)} />
                )
              })}
            </div>
            <div className="mt-4 flex flex-col gap-3 justify-around text-[18px]">
              <LightButton2 onClick={handleExit} text="Отмена" />
            </div>
          </div>
        </div>}
      <div className="w-full h-[160px] relative">
          <img
            src={process.env.REACT_APP_API_URL + request.backGroundPhoto}
            className="absolute top-0 left-0 w-full h-full object-cover -z-10"
            alt="bgartist"
          />
          <Link
            to={`/catalog-artist?id=${idCategory}`}
            className="absolute top-[16px] left-[16px] flex items-center gap-2"
          >
            <img className="w-[14px]" src={crossIcon} alt="close" />
            <span className="text-base text-gray-700">Назад</span>
          </Link>
    </div>


    <div className="rounded-full flex justify-center w-full -mt-[80px]">
      <div className="w-[160px] h-[160px] rounded-full overflow-hidden">
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

      {/* ✅ Добавлено отображение города */}
      <div className="text-center text-[18px] font-medium mt-[12px] opacity-70">
        г. {request.city}
      </div>

      <div className="px-[8px]">
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
            {request.instagram && request.instagram !== " " && request.instagram !== "" && <Link to={`https://instagram.com/${request.instagram}`}><img src={inst} alt="inst" /></Link>}
            {request.vk && request.vk !== " " && request.vk !== "" && <Link to={`${request.vk}`}><img src={vk} alt="vk" /></Link>}
            {request.youtube && request.youtube !== " " && request.youtube !== "" && <Link to={`${request.youtube}`}><img src={youtube} alt="youtube" /></Link>}
            {request.tiktok && request.tiktok !== " " && request.tiktok !== "" && <Link to={`https://tiktok.com/${request.tiktok}`}><img src={tiktok} alt="tiktok" /></Link>}
          </div>
          <div className="mt-[64px] text-[16px] leading-5">
            <div className="mb-[21px] font-bold text-[20px]">
              Услуги и стоимость
            </div>
        <div className="mb-[21px] whitespace-pre-wrap">
          {request.description}
        </div>

            <div>г.{request.city}</div>
          </div>
        </div>
        {request.photo.length > 0 && (
          <>
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
                  className={`cursor-pointer ${showMore ? `rotate-180` : ""}`}
                />
              </div>
            </div>
          </>
        )}
        {(request.link_video[0] + request.link_video[1] + request.link_video[2]) !== " "
          && (request.link_video[0] + request.link_video[1] + request.link_video[2]) !== ""
          && (request.link_video[0] + request.link_video[1] + request.link_video[2]) !== "     " &&
          <div className="mt-[50px]">
            <div>
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

{/*             Код для превью видео */}
{/*             {Array.isArray(request.link_video) && request.link_video.length > 0 && */}
{/*                 request.link_video.map((el, index) => { */}
{/*                     if (el && el !== "") { */}
{/*                         const embedUrl = getVKVideoEmbedUrl(el); */}
{/*                         return ( */}
{/*                             <iframe */}
{/*                                 key={index} */}
{/*                                 src={embedUrl} */}
{/*                                 title={`VK video player ${index}`} */}
{/*                                 width="560" */}
{/*                                 height="315" */}
{/*                                 frameBorder="0" */}
{/*                                 allowFullScreen */}
{/*                                 className="w-full h-[200px] border rounded-lg overflow-hidden" */}
{/*                             /> */}
{/*                         ); */}
{/*                     } */}
{/*                     return null; */}
{/*                 }) */}
{/*             } */}

            </div>
          </div>
        }
        {reviews.length > 0 && (
          <div className="mt-[50px] w-full" ref={reviewsRef}>
            <div className="text-[20px] font-bold">Отзывы ({reviews.length})</div>
            <div className="flex flex-col gap-[23px] mt-[32px] w-full">
              {reviews.slice(0, visibleReview).map((review) => (
                <Review review={review} key={review._id} />
              ))}
            </div>
            <div className="mt-[29px] flex justify-center">
              <img
                src={arrow}
                alt="arrow"
                onClick={toggleShowMoreReview}
                className={`cursor-pointer ${showMoreReview ? `rotate-180` : ""}`}
              />
            </div>
          </div>
        )}
        <div className="mt-[54px] mb-[111px]">
          {user.role === 'customer' && <DarkButton text={"Связаться"} onClick={handleContactClick} />}
        </div>
      </div>
    </div>
  );
};

export default ArtistDetails;

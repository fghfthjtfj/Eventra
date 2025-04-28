import React, { useState, useEffect } from "react";
import calendarIcon from "../../images/Calendar-2.svg";
import moneyIcon from "../../images/Coins.svg";
import mmm from "../../images/mmm.svg";
import { useLocation } from "react-router-dom";
import CategoriesButtons from "../UI/Categories/categoriesButtons";
import axios from "../../axios.js"
import CatalogBanner from "../UI/CatalogBanner/catalogBannerArtist.jsx";
import Loader from "../UI/Loader/loader.jsx";
import { Link } from "react-router-dom";
import { useCategories } from "../../context/categoryContext.js";
import CategoriesButton from "../UI/Categories/categoryButton.jsx";
import { useArtist } from "../../context/artistContext.js";
import { useUser } from "../../context/userContext.js";
import { useSubscription } from "../../context/subscriptionContext.js";

const CatalogApplications = () => {

  const location = useLocation();
  const [category, setCategory] = useState(null);
  const { categories } = useCategories();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get('id');
  const [loading, setLoading] = useState(true)
  const { artist } = useArtist()
  const [applications, setApplications] = useState([])
  const { user } = useUser()
  const {subscription} = useSubscription()

  useEffect(() => {
    if (category) {
      axios.get(`/customer-requests?categoryId=${category}`)
        .then((res) => {
          setApplications(res.data.filter((el) => el.city == user.setCitySearch && !(Date.now() > new Date(el.date))))
        })
        .catch((err) => {
          console.log(err)
        })
        .finally(() => (setLoading(false)))
    }
  }, [category])

  useEffect(() => {
    if (id) {
      setCategory(id);
    }
  }, [id]);

  useEffect(() => {
    setCategory(categories?.[0]?._id);
  }, [categories]);

  const handleChangeCategory = (id) => {
    if (category !== id) {
      setLoading(true)
      setCategory(id);
    }
  };

  function handleContactClick(event, application, customerRequestId) {
    event.stopPropagation();
    const userName = application.customerId.userName;
    if (subscription===null || new Date(subscription.dateExpression) < new Date()){
      window.location.href = '/subscription'
      return
    }

    if (!artist) {
      window.location.href = '/add-artist-request'
      return
    }

    else if (artist.approved === false) {
      window.location.href = "/my-add-request"
      return
    }

    else {

      axios.post('/order', {
        customerRequestId: customerRequestId,
        artistId: user._id
      })
        .then((res) => {
          window.location.href = `https://t.me/${userName}`;

        })
        .catch((err) => {
          console.log(err)
        })
    }

  };

  function normDate(date) {
    let dateNorm = date.split("T")[0].split("-")
    return dateNorm[2] + "." + dateNorm[1] + "." + dateNorm[0]
  }

  return (
    <div className="bg-back min-h-[80vh]">
      <div className="pt-[52px]">
        <div className="flex flex-col gap-[27px] items-center">
          <span className="text-[24px] w-full text-center font-bold">
            Каталог заявок
          </span>
          <CategoriesButtons categories={categories} category={category} handleChangeCategory={handleChangeCategory} />
        </div>
      </div>
      {loading ? <Loader /> :
        <div className="mt-[38px] flex flex-col">
          {applications.length === 0 ? <div className="center font-bold text-center text-2xl mt-[24px]">Нет заявок в этой категории <div className="mt-[24px]">{(artist === undefined || artist === null) && user.role === 'artist' ? <CatalogBanner /> : ""}</div> </div> :
            <>
              {applications.map((application, index) => {
                return (
                  <React.Fragment key={application._id}>
                    {index % 3 === 0 && user.role === 'artist' && index !== 0 && (artist === undefined || artist === null) ? <CatalogBanner /> : ""}

                    <div className="bg-white p-4 shadow-custom mb-6">
                      <Link to={`/application-details/${application._id}`}>
                        <div className="pt-7 pb-[24px] font-[Inter] font-bold text-2xl leading-8">
                          <span className="mb-[24px]">{application.eventName}</span>
                        </div>
                        <div className="flex flex-row gap-4 font-[Inter] text-[12px] font-normal flex-wrap">
                          {application.categoryId.map((el) => (
                            <CategoriesButton key={el._id} category={el} />
                          ))}
                        </div>

                        <div className="mt-[24px] flex justify-between items-center font-[Inter] text-4 font-semibold">
                          <div className="flex items-center">
                            <img className="w-[18px] mr-2" src={calendarIcon} alt="data" />
                            <span>{normDate(application.date)}</span>
                          </div>

                          <div className="flex items-center">
                            <img className="w-[16px] mr-2" src={moneyIcon} alt="money" />
                            <span>{application.fee} ₽</span>
                          </div>
                        </div>

                        <div className="mt-4 font-[Inter] text-[14px] opacity-50 leading-4">
                          {application.description}
                        </div>
                      </Link>

                      <div onClick={(e) => handleContactClick(e, application, application._id)}>
                        <button className="mt-4 w-full flex justify-center items-center bg-black font-[Inter] text-[20px] font-bold rounded-2xl text-white py-4">
                          Откликнуться
                        </button>
                      </div>
                    </div>

                    {applications.length === index + 1 && user.role === 'artist' && (artist === undefined || artist === null) ? <CatalogBanner /> : ""}
                  </React.Fragment>
                );
              })}

            </>
          }
        </div>
      }
    </div>
  );
};

export default CatalogApplications;

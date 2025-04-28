import crossIcon from "../../images/close.svg";
import calendarIcon from "../../images/Calendar-2.svg";
import moneyIcon from "../../images/Coins.svg";
import userIcon from "../../images/User.svg";
import { Link, useParams } from "react-router-dom";
import { DarkButton } from "../UI/Button/button";
import { useEffect, useState } from "react";
import axios from "../../axios";
import Loader from "../UI/Loader/loader";
import CategoriesButton from "../UI/Categories/categoryButton";
import { useUser } from "../../context/userContext"
import { useArtist } from "../../context/artistContext";
import { useSubscription } from "../../context/subscriptionContext";

const ApplicationDetails = () => {
  const { id } = useParams();
  const { user } = useUser()
  const [loading, setLoading] = useState(true)
  const [application, setApplication] = useState({})
  const { artist } = useArtist()
  const {subscription} = useSubscription()

  const handleContactClick = () => {
    const userName = application.customerId.userName;

    if (subscription === null || new Date(subscription.dateExpression) < new Date()) {
      window.location.href = '/subscription'
      return
    }

    if (!artist) {
      window.location.href = '/add-artist-request'
    }

    else if (artist.approved === false) {
      window.location.href = "/my-add-request"
    }

    else {
      axios.post('/order', {

      })
        .then((res) => {
          window.location.href = `https://t.me/${userName}`;

        })
        .catch((err) => {
          console.log(err)
        })

    }

  };

  useEffect(() => {
    if (id) {
      axios.get(`/customer-requests?requestId=${id}`)
        .then((res) => {
          setApplication(res.data)
        })
        .catch((err) => {
          console.log(err)
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [id])

  function normDate(date) {
    let dateNorm = date.split("T")[0].split("-")
    return dateNorm[2] + "." + dateNorm[1] + "." + dateNorm[0]
  }

  if (loading) {
    return <Loader />
  }

  return (
    <div className="font-[Inter] bg-white h-screen">
      <div className="w-full flex justify-end px-[44px] pt-[46px]">
        <Link to={"/catalog-applications"}>
          <img className="w-[16px]" src={crossIcon} alt="close" />
        </Link>
      </div>

      <div className="flex justify-center flex-col w-full px-12 mt-6">
        <span className="text-center text-[30px] font-bold leading-9">
          {application.eventName}
        </span>

        <div className="flex justify-center gap-4 mt-8 text-[12px] leading-3">
          {application.categoryId.map((el) => {
            <CategoriesButton category={el} />
          })}
        </div>
      </div>

      <div className="flex px-9 gap-8 mt-10 justify-between font-semibold text-[16px] leading-5">
        <div className="flex flex-col gap-4">
          <div className="flex items-center">
            <img className="w-[18px] mr-2" src={calendarIcon} alt="calendar" />
            <span>
              {normDate(application.date)},
              <br />
              {application.time}
            </span>
          </div>
          <div className="flex items-center">
            <img className="w-[16px] mr-2" src={userIcon} alt="people" />
            <span>{application.guestCount} человек</span>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center">
            <img className="w-[16px] mr-2" src={moneyIcon} alt="money" />
            <span>{application.fee} ₽</span>
          </div>
          <div>
            <span>
              г. {application.city},
            </span>
          </div>
        </div>
      </div>

      <div className="mt-9 px-4 opacity-70 text-[16px] leading-5">
        {application.description}
      </div>

      {user.role === 'artist' && <div className="px-4 py-10">
        <DarkButton text={"Откликнуться"} onClick={handleContactClick} />
      </div>}
    </div>
  );
};

export default ApplicationDetails;

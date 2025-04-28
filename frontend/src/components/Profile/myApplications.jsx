import { Link } from "react-router-dom";
import calendar from "../../images/Calendar.svg"
import coins from "../../images/Coins.svg"
import zvezda from "../../images/zvezda.svg"
import { DarkButton, LightButton2 } from "../UI/Button/button";
import { useEffect, useState } from "react";
import Loader from "../UI/Loader/loader";
import axios from "../../axios"
import { useUser } from "../../context/userContext";
import CategoriesButton from "../UI/Categories/categoryButton";
import CatalogBanner from "../UI/CatalogBanner/catalogBannerCustomer"

const MyApplications = () => {

    const [applications, setApplications] = useState([])
    const [loading, setLoading] = useState(true)
    const { user } = useUser()
    const [loading2, setLoading2] = useState(true)
    const [orders, setOrders] = useState([])
    const [isDelete, setIdDelete] = useState('')
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState("Вы уверены, что хотите отменить заявку?");

    useEffect(() => {
        if (user) {
            axios.get(`/customer-requests?customerId=${user._id}`)
                .then((res) => {
                    setApplications(res.data);
                    setLoading2(false)
                })
                .catch((err) => {
                    console.log(err);
                })
            axios.get("/order", { params: { customerId: user._id } })
                .then((res) => {
                    setOrders(res.data)
                })
                .catch((err) => {
                    console.log(err)
                })
                .finally(() => {
                    setLoading(false)
                })
        }
    }, [user]);

    function dateNormal(data) {
        const isoDate = data;
        const date = new Date(isoDate);

        const day = date.getUTCDate().toString().padStart(2, '0');
        const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
        const year = date.getUTCFullYear();

        const formattedDate = `${day}.${month}.${year}`;
        return formattedDate
    }

    const handleDeleteApplication = (id) => {
        setIdDelete(id)
        setShowPopup(true)
    }

    if (loading || loading2) {
        return <Loader />
    }

    const getStatusColorClass = (statusName) => {
        const statusColorMap = {
            "Создан": "bg-customgreen",
            "Завершён": "bg-custompurple",
            "Договор": "bg-customyellow",
            "Отменён": "bg-customorange",
        };

        return statusColorMap[statusName] || "";
    };



    const handleConfirmChange = () => {
        axios.delete(`/customer-request?requestId=${isDelete}`)
            .then(() => {
                setApplications(applications.filter((el) => (el._id !== isDelete)))
                setShowPopup(false)
            })
            .catch((err) => {
                console.log(err)
            })
    };

    const handleCancelChange = () => {
        setShowPopup(false);
    };

    const handleContactClick = (userName) => {
        // Redirect to the Telegram bot
        window.location.href = `https://t.me/${userName}`;

        // Check if the Telegram Web App API is available
        if (window.Telegram && window.Telegram.WebApp && typeof window.Telegram.WebApp.close === 'function') {
            // Close the Telegram Web App
            window.Telegram.WebApp.close();
        } else {
            // Fallback for non-Telegram environments
            window.close();
        }
    };



    if (applications.length === 0 && orders === 0) {
        return (
            <div className="px-[16px] bg-back min-h-screen">
                <div className="py-[44px] flex gap-[33px] justify-center">
                    <Link to={"/my-add-application"} className="text-[20px] opacity-60">Создать заявку</Link><div className="underline font-bold text-[20px]">Мои заявки ({applications.length + orders.length})</div>
                </div>
                <div className="min-h-screen flex justify-center items-center mt-[-200px]"><CatalogBanner /></div>
            </div>
        )
    }

    return (
        <div className="px-[16px] bg-back min-h-screen">
            {showPopup &&
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-md shadow-lg max-w-xs text-center">
                        <p className="text-lg font-semibold">{popupMessage}</p>
                        <div className="mt-4 flex flex-col gap-3 justify-around text-[18px]">
                            <LightButton2 onClick={handleCancelChange} text="Отмена" />
                            <DarkButton onClick={handleConfirmChange} text="Подтвердить" />
                        </div>
                    </div>
                </div>}
            <div className="py-[44px] flex gap-[33px] justify-center">
                <Link to={"/my-add-application"} className="text-[20px] opacity-60">Создать заявку</Link><div className="underline font-bold text-[20px]">Мои заявки ({applications.length + orders.length})</div>
            </div>
            <div className="flex flex-col gap-[24px] last:pb-[24px]">
                {applications.map((application) => {
                    const isExpired = Date.now() > new Date(application.date);
                    const isExpiringSoon = (new Date(application.date) - Date.now()) <= 3 * 24 * 60 * 60 * 1000;

                    return (
                        <div className={`flex-col ${isExpired && application.approved === true ? "opacity-50" : ""}`}>
                            <div className={`h-[59px] ${application.isReject ? "bg-customorange" : application.approved ? isExpired ? "bg-customorange" : isExpiringSoon ? "bg-customyellow" : "bg-customgreen" : "bg-custompink"} flex items-center justify-center text-white text-[18px] font-bold`}>
                                {application.isReject ? "Отклонена" : application.approved ? isExpired ? "Срок заявки истек" : isExpiringSoon ? "Истекает срок заявки" : "Активна" : "На модерации"}
                            </div>
                            <div className="py-[24px] px-[19px] bg-main">
                                <div className="text-[24px] font-bold">{application.eventName}</div>
                                <div className="mt-[20px] flex gap-[16px] flex-wrap">
                                    {application.categoryId.map((el) => (
                                        <CategoriesButton category={el} />
                                    ))}
                                </div>
                                <div className="mt-[21px] flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <img className="w-[18px]" src={calendar} alt="calendar" />
                                        <div className="text-[16px] font-bold">{dateNormal(application.date)}</div>
                                    </div>
                                    <div className="flex items-center gap-2" >
                                        <img src={coins} alt="coins" />
                                        <div className="text-[16px] font-bold">{application.fee} P</div>
                                    </div>
                                </div>
                                <>
                                    {!application.isReject || !application.approved && <div className="flex gap-[14px] mt-[20px]">
                                        <div>
                                            <img className="w-[11px]" src={zvezda} alt="zvezda" />
                                        </div>
                                        <div className="text-[16px]">
                                            Если вы редактируете, заявка потребует повторной модерации
                                        </div>
                                    </div>}
                                    <div className="mt-[20px] flex gap-2 w-full">
                                        {application.isReject ? (
                                            <LightButton2 onClick={() => handleContactClick("eventra_app_bot")} text={"Написать в поддержку"} />
                                        ) : (
                                            <>
                                                {!application.approved && <Link className="w-full" to={`/my-edit-application/${application._id}`}>
                                                    {isExpired && application.approved === true ? "" : <LightButton2 text={"Редактировать"} />}
                                                </Link>}
                                                {application.approved && !isExpired && (
                                                    <Link className="w-full" onClick={() => handleDeleteApplication(application._id)}>
                                                        <LightButton2 text={"Отменить"} />
                                                    </Link>
                                                )}
                                            </>
                                        )}

                                    </div>
                                </>
                            </div>
                        </div>
                    );
                })}

                {orders.map((order) => {
                    return (
                        <div key={order._id} className="flex-col">
                            <div className={`h-[59px] ${getStatusColorClass(order.status.statusId.name)} flex items-center justify-center text-white text-[18px] font-bold`}>{order.status.statusId.name}</div>
                            <div className="py-[24px] px-[19px] bg-main">
                                <div className="text-[24px] font-bold">{order.customerRequestId.eventName}</div>
                                <div className="mt-[20px] flex gap-[16px] flex-wrap">
                                    {order.customerRequestId.categoryId.map((el) => (
                                        <CategoriesButton category={el} />
                                    ))}
                                </div>
                                <div className="mt-[21px] flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <img className="w-[18px]" src={calendar} alt="calendar" /> <div className="text-[16px] font-bold">{dateNormal(order.customerRequestId.date)}</div>
                                    </div>
                                    <div className="flex items-center gap-2" >
                                        <img src={coins} alt="coins" /> <div className="text-[16px] font-bold">{order.customerRequestId.fee} P</div>
                                    </div>
                                </div>
                                <div className="mt-[20px] flex gap-2 w-full">
                                    {order.status.statusId.name === "Завершён" && order.review === false && <Link className="w-full" to={`/addReview/${order._id}`} ><DarkButton text={"Написать отзыв"} /></Link>}
                                    {order.status.statusId.name === "Договор" && <LightButton2 onClick={() => handleContactClick(order.artistRequestId.artistId.userName)} text={"Связаться"} />}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
}

export default MyApplications;
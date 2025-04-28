import arrow from "../../images/arrow.svg";
import calendar from "../../images/Calendar.svg";
import coins from "../../images/Coins.svg";
import CategoriesButton from "../UI/Categories/categoryButton";
import { LightButton2 } from "../UI/Button/button";
import { useEffect, useState } from "react";
import axios from "../../axios";
import Loader from "../UI/Loader/loader";
import ConfirmationPopup from "./StatusChangePopup";
import { Link } from "react-router-dom";

const ArtistOrder = ({ el }) => {
    const [statuses, setStatuses] = useState([]);
    const [tap, setTap] = useState(false);
    const [status, setStatus] = useState(el.status.statusId);
    const [showPopup, setShowPopup] = useState(false);
    const [popupMessage, setPopupMessage] = useState("");
    const [nextStatus, setNextStatus] = useState(null);
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        axios.get("/status")
            .then((res) => {
                setStatuses(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    const handleGoTg = (el) => {
        window.location.href = `https://t.me/${el.customerRequestId.customerId.userName}`;
    };

    function normDate(date) {
        let dateNorm = date.split("T")[0].split("-");
        return `${dateNorm[2]}.${dateNorm[1]}.${dateNorm[0]}`;
    }

    const handleToggleTap = () => {
        setTap((prevTap) => !prevTap);
    };

    const getStatusColorClass = (statusName) => {
        const statusColorMap = {
            "Создан": "bg-customgreen",
            "Завершён": "bg-custompurple",
            "Договор": "bg-customyellow",
            "Отменён": "bg-customorange",
        };

        return statusColorMap[statusName] || "";
    };

    const validTransitions = {
        "Создан": ["Договор", "Отменён"],
        "Договор": ["Завершён"],
        "Завершён": [],
        "Отменён": [],
    };

    const handleChangeStatus = (statusNew) => {
        if (validTransitions[status.name].includes(statusNew.name)) {
            setNextStatus(statusNew);

            if (statusNew.name === "Договор") {
                setPopupMessage('Статус "Договор" означает, что вы договорились с заказчиком об исполнении заказа.');
            } else if (statusNew.name === "Отменён") {
                setPopupMessage("Вы уверены, что хотите отменить заказ?");
            } else if (statusNew.name === "Завершён") {
                setPopupMessage("Вы выполнили заказ? Завершите заказ и заказчик сможет оставить отзыв!");
            }

            setShowPopup(true);
        }
    };

    const handleConfirmChange = () => {
        setLoading(true)
        axios.patch("/order", { status: nextStatus, orderId: el._id, customerRequestId: el.customerRequestId._id })
            .then(() => {
                setStatus(nextStatus);
            })
            .catch((err) => {
                console.log(err)
            })
            .finally(() => {
                setLoading(false)
                setShowPopup(false);
                setTap(false);
            })
    };

    const handleCancelChange = () => {
        setShowPopup(false);
    };

    if (!status) {
        return <Loader />
    }

    return (
        <div className={`flex-col relative ${(status.name === "Отменён" || status.name === "Завершён") && "opacity-55"}`}>
            {showPopup && <ConfirmationPopup message={popupMessage} onConfirm={handleConfirmChange} onCancel={handleCancelChange} loading={loading} />}
            <div
                onClick={handleToggleTap}
                className={`h-[59px] ${getStatusColorClass(status.name)} flex items-center justify-center text-white text-[18px] font-bold relative`}
            >
                {status.name}
                {status.name !== "Завершён" && status.name !== "Отменён" && <img
                    className={`absolute right-4 text-white ${tap && "rotate-180"}`}
                    src={arrow}
                    alt="arrow"
                />}

            </div>
            {tap && <div className="absolute w-full">
                {statuses.map((statusItem) => {
                    if (statusItem._id !== status._id &&
                        validTransitions[status.name].includes(statusItem.name)) {
                        return (
                            <div
                                onClick={() => handleChangeStatus(statusItem)}
                                key={statusItem._id}
                                className={`h-[59px] ${getStatusColorClass(statusItem.name)} flex items-center justify-center text-white text-[18px] font-bold relative`}
                            >
                                {statusItem.name}
                            </div>
                        );
                    }
                })}
            </div>}
            <div className="py-[24px] px-[19px] bg-main">
                <div className="text-[24px] font-bold">{el.customerRequestId.eventName}</div>
                <div className="mt-[20px] flex gap-[16px] flex-wrap">
                    {el.customerRequestId.categoryId.map((el) => {
                        return <CategoriesButton key={el._id} category={el} />;
                    })}
                </div>
                <div className="mt-[21px] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <img className="w-[18px]" src={calendar} alt="calendar" />
                        <div className="text-[16px] font-bold">{normDate(el.customerRequestId.date)}</div>
                    </div>
                    <div className="flex items-center gap-2">
                        <img src={coins} alt="coins" />
                        <div className="text-[16px] font-bold">{el.customerRequestId.fee} P</div>
                    </div>
                </div>
                {el.review == true && <div className="mt-[40px]"><Link to={`/artist/${el.artistRequestId.artistId._id}/66a51564e7d6e093d50f969a`} className="font-bold text-[20px] !opacity-100 underline">*Есть отзыв по этому заказу</Link></div>}
                {(status.name === "Создан" || status.name === "Договор") && <div className="mt-[20px]">
                    <LightButton2 onClick={() => handleGoTg(el)} text={"Связаться"} />
                </div>}

            </div>
        </div>
    );
};

export default ArtistOrder;

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import star from "../../images/Star.svg";
import attention from "../../images/attention.svg";
import { DarkButton } from "../UI/Button/button";
import axios from "../../axios";
import Loader from "../UI/Loader/loader";
import { useUser } from "../../context/userContext";

const AddReview = () => {
    const { id } = useParams();

    const [rating, setRating] = useState(0);
    const [order, setOrder] = useState({})
    const [loading, setLoading] = useState(true)
    const { user } = useUser()
    const [reviewData, setReviewData] = useState({
        title: '',
        review: ''
    });

    useEffect(() => {
        if (id) {
            axios.get("/order", { params: { orderId: id } })
                .then((res) => {
                    setOrder(res.data)
                    setLoading(false)
                })
                .catch((err) => {
                    console.log(err)
                })
        }
    }, [id])

    const handleStarClick = (index) => {
        setRating(index + 1);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setReviewData({
            ...reviewData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        axios.post("/review", {
            orderId: order._id, customerId: user._id, artistId: order.artistRequestId.artistId._id, reviewText: reviewData.review, grade: rating, reviewTitle: reviewData.title
        })
            .then(() => {
                window.location.href = `/review-done`
            })
            .catch((err) => {
                console.log(err)
            })
    };

    if (loading) {
        return <Loader />
    }

    return (
        <div className="px-[16px]">
            <div className="mt-[32px] text-center text-[24px] font-bold">
                Расскажите будущим заказчикам, как всё прошло
            </div>
            <form className="mt-[38px]" onSubmit={handleSubmit}>
                <div className="opacity-50 text-[16px]">
                    Оцените работу <span className="underline">{order.artistRequestId.artistId.firstName + ' ' + order.artistRequestId.artistId.lastName}</span>
                </div>
                <div className="mt-[10px] flex gap-2">
                    {[...Array(5)].map((_, index) => (
                        <img
                            key={index}
                            src={star}
                            alt={`star-${index + 1}`}
                            className={index < rating ? "" : "opacity-50"}
                            onClick={() => handleStarClick(index)}
                            style={{ cursor: 'pointer' }}
                        />
                    ))}
                </div>
                <div className="mt-[18px] text-[14px] opacity-50">
                    Общее впечатление
                </div>
                <div className="flex gap-2 text-[12px] items-center opacity-50 mt-1">
                    <img src={attention} alt="attention" />
                    Это будет заголовок отзыва
                </div>
                <input
                    type="text"
                    name="title"
                    value={reviewData.title}
                    onChange={handleInputChange}
                    className="mt-[8px] px-[24px] py-[16px] border-black border-solid border-2 w-full"
                />
                <div className="opacity-50 text-[16px] mt-[18px]">
                    Напишите ваш отзыв
                </div>
                <textarea
                    name="review"
                    value={reviewData.review}
                    onChange={handleInputChange}
                    className="h-[132px] mt-[11px] px-[24px] py-[16px] border-black border-solid border-2 w-full"
                ></textarea>
                <div className="mt-[24px] mb-[48px]">
                    <DarkButton text={"Отправить отзыв"} />
                </div>
            </form>
        </div>
    );
}

export default AddReview;

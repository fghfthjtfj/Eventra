import star from "../../images/Star.svg";
import avatar from "../../images/avatar.png";

const Review = ({ review }) => {
    const stars = Array.from({ length: 5 }, (_, index) => {
        return (
            <img
                key={index}
                src={star}
                alt="star"
                className={index >= review.grade ? "opacity-30" : ""}
            />
        );
    });

    function normDate(date) {
        let dateNorm = date.split("T")[0].split("-")
        return dateNorm[2] + "." + dateNorm[1] + "." + dateNorm[0]
    }

    return (
        <div className="flex w-full">
            <div className="ml-[10px] flex-col flex gap-[6px] flex-nowrap">
                <div className="text-[16px] font-bold">{review.reviewTitle}</div>
                <div className="flex w-full flex-wrap gap-4">
                    <div className="opacity-60">
                        {review.customerId.lastName + ' ' + review.customerId.firstName}
                    </div>
                    <div className="flex items-center gap-[2px]">
                        {stars}
                    </div>
                </div>
                <div className="text-[16px] !flex-nowrap">{review.reviewText}</div>
                <div className="text-[12px] opacity-60">{normDate(review?.createdAt)}</div>
            </div>
        </div>
    );
}

export default Review;

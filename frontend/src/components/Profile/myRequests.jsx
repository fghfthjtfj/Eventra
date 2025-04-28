import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useUser } from "../../context/userContext";
import axios from "../../axios";
import Loader from "../UI/Loader/loader";
import { useArtist } from "../../context/artistContext";
import ArtistOrder from "./artistOrder";


const MyRequest = () => {
    const { user } = useUser()
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const { artist } = useArtist()

    useEffect(() => {
        if (user) {
            axios.get("/order", { params: { artistId: user._id } })
                .then((res) => {
                    setOrders(res.data)
                    setLoading(false)
                })
                .catch((err) => {
                    console.log(err)
                })
        }
    }, [user])

    if (loading) {
        return <Loader />
    }

    return (
        <div className="px-[16px] min-h-screen bg-back">
            <div className="py-[44px] flex gap-[33px] justify-center">
                <Link to={artist === undefined || artist === null ? `/add-artist-request` : `/my-add-request`} className=" text-[20px] opacity-60">Моя анкета</Link><div className="text-[20px]  underline font-bold " >Мои заказы ({orders.length})</div>
            </div>
            <div className="flex flex-col gap-[24px] last:mb-[24px]">
                {orders.length > 0 ?
                    <>
                        {orders.map((el) => (
                            <ArtistOrder key={el._id} el={el} />
                        ))}
                    </> :
                    <div className="text-center font-bold text-[24px] pt-[140px]">
                        У вас пока не было заказов!
                    </div>}
            </div>
        </div>
    );
}

export default MyRequest;
import { useEffect, useState } from "react";
import done from "../../images/done.png"
import { LightButton2 } from "../UI/Button/button";
import { useNavigate } from "react-router-dom";
import axios from "../../axios";
import { useUser } from "../../context/userContext";
import Loader from "../UI/Loader/loader";

const ApplicationDone = () => {

    const navigate = useNavigate()
    const {user} = useUser()
    const [orders, setOrders] = useState([])
    const [applications, setApplications] = useState([])
    const [loading, setLoading] = useState(true)
    const [loading2, setLoading2] = useState(true)
    
    useEffect(() => {
        if (user) {
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
        if (user) {
            axios.get(`/customer-requests?customerId=${user._id}`)
                .then((res) => {
                    setApplications(res.data);
                    setLoading2(false)
                })
                .catch((err) => {
                    console.log(err);
                })
        }
    }, [user]);

    const handleGoArtistCatalog = () => {
        navigate("/catalog-artist")
    }

    const handleGoMyApplications = () => {
        navigate("/my-applications")
    }

    if (loading || loading2){
        return <Loader />
    }


    return (
        <div className="h-screen flex flex-col items-center justify-center px-[16px]">
            <img src={done} alt="done" className="mb-[72px]" />
            <div className="w-full"><LightButton2 onClick={handleGoArtistCatalog} text={"Каталог артистов"} /></div>
            <div className="mt-[12px] w-full"><LightButton2 onClick={handleGoMyApplications} text={`Мои заявки (${applications.length + orders.length})`} /></div>
        </div>
    );
}

export default ApplicationDone;
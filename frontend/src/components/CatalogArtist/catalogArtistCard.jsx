import { DarkButton, LightButton2 } from '../UI/Button/button';
import picture from "../../images/picture.png";
import image from "../../images/photo 1.png";
import star from "../../images/Star.svg";
import coins from "../../images/Coins.svg";
import { Link } from "react-router-dom"
import axios from '../../axios';
import { useState, useEffect } from 'react';
import Loader from '../UI/Loader/loader';
import CategoriesButton from '../UI/Categories/categoryButton';
import { useUser } from '../../context/userContext';

const CatalogArtistCard = ({ info, category }) => {

    const [reviews, setReviews] = useState([])
    const [loading, setLoading] = useState(true)
    const [myApplications, setMyApplications] = useState([])
    const { user } = useUser()
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        axios.get('/review', { params: { artistId: info.artistId._id } })
            .then((res) => {
                setReviews(res.data)
                setLoading(false)
            })
            .catch((err) => {
                console.log(err)
            })
    }, [])

    useEffect(() => {
        if (user) {
            axios.get('/customer-requests', { params: { customerId: user._id } })
                .then((res) => {
                    setMyApplications(
                        res.data
                            .filter(el => el.order === false && el.approved === true && el.isReject === false)
                            .filter(el => new Date(el.date).getTime() > Date.now()) // Filter out past dates
                    );
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, [user]);


    function ratingCalculate(reviews) {
        let rating = 0
        for (let i = 0; i < reviews.length; i++) {
            rating += reviews[i].grade
        }
        return parseFloat((rating / reviews.length).toFixed(1)) || 0;
    }

    if (loading) {
        return <Loader />
    }

    const handleOk = (id) => {
        setShowPopup(false)
        axios.post('/order', {
            customerRequestId: id,
            artistId: info.artistId._id
        })
            .then((res) => {
                window.location.href = `https://t.me/${info.artistId.userName}`;
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

    return (
        <div className='bg-main px-[16px] py-[25px] shadow-custom '>
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
            <Link to={`/artist/${info.artistId._id}/${category}`}>
                <div className='flex items-center gap-[12px]'>
                  <div className='w-[88px] h-[88px] rounded-full overflow-hidden'>
                    <img
                      src={process.env.REACT_APP_API_URL + info.mainPhoto}
                      className='w-full h-full object-cover'
                      alt="1"
                    />
                  </div>
                  <div className='flex flex-col gap-[12px] h-full justify-center'>
                    <span className='font-bold text-[24px]'>
                      {info.artistId.firstName} {info.artistId.lastName}
                    </span>
                    <div className='gap-2 flex flex-wrap'>
                      {info.categoryId.map((el) => (
                        <CategoriesButton key={el._id} category={el} />
                      ))}
                    </div>
                  </div>
                </div>

                <div className='mt-[24px]'>
                    <div className='flex justify-between'>
                        <div className='flex items-center'>
                            <img src={star} alt="2" className='-mt-1' /> <span className='text-[20px] font-bold mr-[8px] ml-[2px]'>{ratingCalculate(reviews)}</span> <span className='text-[16px]'> Отзывы ({reviews.length})</span>
                        </div>
                        <div className='flex items-center gap-1'>
                            <img src={coins} alt="3" /> <span className='text-[16px]'>{info.price} ₽</span>
                        </div>
                    </div>
                </div>
                <div className='my-[17px] opacity-50 text-[14px] whitespace-pre-wrap'>
                    {info.description}
                </div>
                <div className='flex justify-between flex-wrap opacity-50'>
                    {info.photo.map((img) => <img src={process.env.REACT_APP_API_URL + img} className='w-[32%]' alt="1" />)}
                </div>
            </Link>
            {user.role !== 'artist' && (
                <div className='mt-[16px] text-[18px]'>
                    <div onClick={handleContactClick}>
                        <DarkButton text={"Связаться"} />
                    </div>
                </div>
            )}
        </div>
    );
}

export default CatalogArtistCard;

import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "../../axios.js";
import CategoriesButtons from "../UI/Categories/categoriesButtons.jsx";
import CatalogArtistCard from "./catalogArtistCard.jsx";
import CatalogBanner from "../UI/CatalogBanner/catalogBannerCustomer.jsx";
import { useCategories } from "../../context/categoryContext.js";
import Loader from "../UI/Loader/loader.jsx";
import { useUser } from "../../context/userContext.js";

const CatalogArtist = () => {
  const location = useLocation();
  const [category, setCategory] = useState(null);
  const [applications, setApplications] = useState(null);
  const { categories } = useCategories();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get("id");
  const [loading, setLoading] = useState(true)
  const {user} = useUser()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/artist-request", {
          params: { categoryId: category },
        });
        let data;
        if (response.data) {
          data = Array.isArray(response.data) ? response.data : [response.data];
        } else {
          data = null;
        }
        setApplications(data.filter((el)=>el.city==user.setCitySearch));
        setLoading(false)
      } catch (error) {
        console.error("Error fetching data:", error);
        setApplications([]);
      }
    };

    if (category) {
      fetchData();
    }
  }, [category, id, categories]);

  useEffect(() => {
    if (id) {
      setCategory(id);
    }
  }, [id]);

  useEffect(() => {
    if (!id && categories.length > 0) {
      setCategory(categories[0]._id);
    }
  }, [categories, id]);

  const handleChangeCategory = (id) => {
    if (category !== id) {
      setLoading(true)
      setCategory(id);
    }
  };

  return (
    <div className="bg-back min-h-screen">
      <div className="pt-[34px]">
        <div className="flex flex-col gap-[27px] items-center">
          <span className="text-[24px] w-full text-center font-bold">
            Каталог артистов
          </span>
          <CategoriesButtons
            categories={categories}
            category={category}
            handleChangeCategory={handleChangeCategory}
          />
        </div>
        {loading ? <Loader /> :
          <div className="mt-[39px] flex flex-col gap-[24px] last:pb-[27px] relative">
            {applications && applications.length > 0 ? (
              applications.map((app, index) => (
                <>
                  {index % 3 === 0 && index !== 0 && user.role === 'customer' ? <CatalogBanner /> : ""}
                  <CatalogArtistCard key={app._id} info={app} category={category} />
                  {applications.length === index + 1 && user.role === 'customer' ? <CatalogBanner /> : ""}
                </>

              ))
            ) : (
              <>
                <div className="text-center text-2xl font-bold pb-[24px]">Нет артистов в этой категории</div>
                {user.role==='customer' && <CatalogBanner />}
              </>
            )}

          </div>
        }
      </div>
    </div>
  );
};

export default CatalogArtist;

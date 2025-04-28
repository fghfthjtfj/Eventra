import { Link } from "react-router-dom";
import { DarkButton } from "../UI/Button/button";
import Categories from "../UI/Categories/categories.jsx";
import { useCategories } from "../../context/categoryContext.js";
import { useArtist } from "../../context/artistContext.js";
import { useUser } from "../../context/userContext.js";

const CategorySearch = () => {
  const {categories} = useCategories()

  const {user} = useUser()

  return (
    <div className="py-[84px] flex flex-col gap-[34px] items-center">
      {user?.role==='customer' ? <div className="text-[18px] text-center px-[12px]">
        Выберите артиста или создайте <br /> заявку для вашего события
      </div> : ""}
      <div className="flex flex-col items-center w-full px-[12px]">
        <Categories categories={categories} />
        {user?.role==='customer' && <Link to="/add-application" className="w-full"><DarkButton text={"Создать заявку"} /></Link>}
      </div>
    </div>
  );
}

export default CategorySearch;

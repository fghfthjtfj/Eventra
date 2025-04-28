const CategoriesButtons = ({ categories, category, handleChangeCategory }) => {
    return (
        <div className='flex flex-wrap justify-center gap-[12px] px-[16px]'>
            {categories.map((el) => (
                <button
                    key={el._id}
                    className={`px-[16px] py-[4px] text-[12px] rounded-[10px] w-max ${el._id === category ? getClassColor(el.color) : 'bg-buttoncategory opacity-50'}`}
                    onClick={() => handleChangeCategory(el._id)}
                >
                    {el.name}
                </button>
            ))}
        </div>
    );
};

const getClassColor = (color) => {
    switch (color) {
        case 'orange':
            return 'bg-customorange';
        case 'green':
            return 'bg-customgreen';
        case 'yellow':
            return 'bg-customyellow';
        case 'pink':
            return 'bg-custompink';
        case 'purple':
            return 'bg-custompurple';
        default:
            return '';
    }
};

export default CategoriesButtons;

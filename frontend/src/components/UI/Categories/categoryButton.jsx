const CategoriesButton = ({ category }) => {
    return (
        <button
            key={category._id}
            className={`px-[16px] py-[4px] rounded-[10px] text-[12px]  ${getClassColor(category.color)}`}
        >
            {category.name}
        </button>
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

export default CategoriesButton;

const catalogApplicationItem = (item) => {
    return (
        <div className="bg-white p-4 shadow-custom mb-6">
          <div className="pt-7 pb-[24px] font-[Inter] font-bold text-2xl leading-8">
            <span className="mb-[24px]">{item.eventName}</span>
          </div>

          <div className="flex flex-row gap-4 font-[Inter] text-[12px] font-normal ">
            <span
              className={`py-[4.5px] px-4 flex justify-center items-center rounded-xl bg-customyellow`}
            >
              {item.categories[0].name}
            </span>
          </div>

          <div className="mt-[24px] flex justify-between items-center font-[Inter] text-4 font-semibold">
            <div className="flex items-center">
              <img className="w-[18px] mr-2" src={calendarIcon} alt="data" />
              <span>{item.date}</span>
            </div>

            <div className="flex items-center">
              <img className="w-[16px] mr-2" src={moneyIcon} alt="money" />
              <span>{item.fee}</span>
            </div>
          </div>

          <div className="mt-4 font-[Inter] text-[14px] opacity-50 leading-4">
            {item.description}
          </div>

          <button className="mt-4 w-full flex justify-center items-center bg-black font-[Inter] text-[20px] font-bold rounded-2xl text-white py-4">
            Откликнуться
          </button>
        </div>
    )
}
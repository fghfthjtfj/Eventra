const DarkButton = ({ text, ...props }) => {
    return (
      <button className="w-full text-white rounded-2xl bg-black flex h-[56px] justify-center items-center" {...props}>{text}</button>
    );
  };
  
  const LightButton = ({ text, ...props }) => {
    return (
      <button className="w-full text-white rounded-2xl border-2 border-white h-[56px] flex justify-center items-center text-[20px] font-bold" {...props}>{text}</button>
    );
  };

  const LightButton2 = ({ text, ...props }) => {
    return (
      <button className="w-full text-black rounded-2xl border-2 border-black h-[56px] flex justify-center items-center text-[20px] font-bold" {...props}>{text}</button>
    );
  };
  
export { DarkButton, LightButton, LightButton2 };
  
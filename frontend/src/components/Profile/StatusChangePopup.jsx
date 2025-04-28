import React from "react";
import { DarkButton, LightButton2 } from "../UI/Button/button";

const ConfirmationPopup = ({ message, onConfirm, onCancel, loading }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-md shadow-lg max-w-xs text-center">
                <p className="text-lg font-semibold">{message}</p>
                <div className="mt-4 flex flex-col gap-3 justify-around text-[18px]">
                    <LightButton2 disabled={loading} onClick={onCancel} text="Отмена" />
                    <DarkButton disabled={loading} onClick={onConfirm} text="Подтвердить" />
                </div>
            </div>
        </div>
    );
};

export default ConfirmationPopup;
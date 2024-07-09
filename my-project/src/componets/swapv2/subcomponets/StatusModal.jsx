import React, { useEffect } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { MdError } from "react-icons/md";

function StatusModal({ message, setModalMessage }) {
  return (
    <dialog id="my_modal_99" className="modal">
      <div className="modal-box">
        {message?.icon ? (
          <FaCheckCircle className="text-[100px] text-green-500 ms-auto me-auto " />
        ) : (
          <MdError className={`text-[100px] text-red-500 ms-auto me-auto`} />
        )}
        <div className="text-center font-light text-[10px]">
          {message?.message}
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button
          onClick={() => {
            setModalMessage(null);
          }}
        >
          close
        </button>
      </form>
    </dialog>
  );
}

export default StatusModal;

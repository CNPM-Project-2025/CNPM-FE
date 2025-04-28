import React, { useState } from "react";
import "/src/assets/styles/Home.css";
import { FastFoodItem } from "../../types/FastFoodItem";
import "/src/assets/styles/Home.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons/faXmark";

interface CartItem extends FastFoodItem {
  quantity: number;
}

interface PaymentProps {
  cart: CartItem[];
  closePaymentPopup: () => void;
  getTotalPriceInclTax: () => number;
}

const PaymentPopup: React.FC<PaymentProps> = ({
  cart,
  closePaymentPopup,
  getTotalPriceInclTax,
}) => {
  const options = [
    {
      value: 0,
      label: "Phương thức thanh toán",
    },
    {
      value: 1,
      label: "Tiền mặt",
    },
    {
      value: 2,
      label: "Visa",
    },
    {
      value: 3,
      label: "Ngân hàng",
    },
  ];
  const [selectedOption, setSelectedOption] = useState<number>(0);
  return (
    <>
      <div className="popup-overlay" onClick={closePaymentPopup}>
        <div
          className="popupPayment-content"
          style={{ width: "50%" }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="popup-header">
            <span>
              <h2>THÔNG TIN ĐƠN HÀNG</h2>
            </span>
            <span>
              <button
                className="popup-close"
                style={{
                  backgroundColor: "#ececee",
                  fontSize: "20px",
                  color: "#5a5860",
                  padding: "12px 24px",
                }}
                onClick={closePaymentPopup}
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </span>
          </div>
          <div className="payment-popup__body">
            <div className="payment-body">
              <div className="payment-header__body">
                <span>STT</span>
                <span>TÊN</span>
                <span>SỐ LƯỢNG</span>
                <span>ĐƠN GIÁ</span>
                <span>THÀNH TIỀN</span>
              </div>
              <div style={{ overflowY: "auto", height: "200px" }}>
                {cart.map((item, index) => (
                  <div className="payment-row" key={item.id}>
                    <span>{index + 1}</span>
                    <span>{item.name}</span>
                    <span>{item.quantity}</span>
                    <span>{item.price.toLocaleString()} VNĐ</span>
                    <span>
                      {(item.price * item.quantity).toLocaleString()} VNĐ
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="paymentMethod__totaltotal">
              <div>
                <div className="total-payment">
                  <div>
                    <span>Tổng tiền:</span>
                    <span>{getTotalPriceInclTax().toLocaleString()} VNĐ</span>
                  </div>
                  <div>Incl.tax 10%</div>
                </div>
                <div className="paymentMethod">
                  <div>
                    <select
                      id="payment-method"
                      value={selectedOption}
                      onChange={(e) =>
                        setSelectedOption(Number(e.target.value))
                      }
                    >
                      {options.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="payment-popup__footer" style={{ marginTop: "30px" }}>
            <button className="btn-payment">THANH TOÁN</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentPopup;

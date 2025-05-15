import { useState, ChangeEvent, MouseEvent } from 'react';
import { useNotification } from '../../hooks/useNotification';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../assets/styles/Payment.css';
import { CardInfoType } from '../../types/cardInfoType'
import { useNavigate } from 'react-router-dom'; // Thêm useNavigate vào import



const Payment: React.FC = () => {
  const [cardNumber, setCardNumber] = useState<string>('');
  const [expiry, setExpiry] = useState<string>('');
  const [cvc, setCvc] = useState<string>('');
  const [cardHolder, setCardHolder] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const { showNotification } = useNotification();
  const navigate = useNavigate(); // Khởi tạo navigate từ useNavigate

  const formatCardNumber = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    return numbers
      .match(/.{1,4}/g)
      ?.join(' ')
      .slice(0, 19) || '';
  };

  const formatExpiry = (value: string): string => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length > 2) {
      return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}`;
    }
    return numbers;
  };

  // Luhn Algorithm để kiểm tra số thẻ hợp lệ
  const validateCardNumber = (cardNumber: string): boolean => {
    const digits = cardNumber.replace(/\D/g, '').split('').map(Number);
    if (digits.length !== 16) return false;
    let sum = 0;
    let isEven = false;
    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = digits[i];
      if (isEven) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      isEven = !isEven;
    }
    return sum % 10 === 0;
  };

  const validateExpiryDate = (expiry: string): boolean => {
    if (!/^\d{2}\/\d{2}$/.test(expiry)) return false;
    const [month, year] = expiry.split('/').map(Number);
    if (month < 1 || month > 12) return false;
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear() % 100;
    const currentMonth = currentDate.getMonth() + 1;
    const expiryDate = new Date(2000 + year, month - 1, 1);
    const currentDateForComparison = new Date(2000 + currentYear, currentMonth - 1, 1);
    return expiryDate > currentDateForComparison; // Thay đổi từ >= thành >
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
  
    if (!cardNumber || cardNumber.replace(/\D/g, '').length !== 16 || !validateCardNumber(cardNumber)) {
      newErrors.cardNumber = 'Số thẻ không hợp lệ (16 số, phải qua Luhn check)';
    }
    if (!expiry || !validateExpiryDate(expiry)) {
      newErrors.expiry = 'Ngày hết hạn không hợp lệ (MM/YY)';
    }
    if (!cvc || cvc.length !== 3 || !/^\d{3}$/.test(cvc)) {
      newErrors.cvc = 'Mã CVC không hợp lệ (3 số)';
    }
    if (!cardHolder.trim() || !/^[a-zA-Z\s]+$/.test(cardHolder)) {
      newErrors.cardHolder = 'Tên chủ thẻ không hợp lệ (chỉ chứa chữ cái)';
    }
  
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      showNotification('Vui lòng kiểm tra lại thông tin', 'error');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: MouseEvent<HTMLButtonElement>): Promise<void> => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      showNotification('Thanh toán thành công!', 'success');
      // Gọi API thanh toán ở đây
      // Ví dụ: await paymentApi.processPayment({ cardNumber, expiry, cvc, cardHolder });
      console.log("Card Number:", cardNumber);
      console.log("Expiry Date:", expiry);
      console.log("CVC:", cvc);
      console.log("Card Holder:", cardHolder);

      // Nếu thanh toán thành công, reset form và chuyển hướng về trang chủ
      setCardNumber('');
      setExpiry('');
      setCvc('');
      setCardHolder('');
      setErrors({});

      const cardInfo: CardInfoType = {
        cardNumber: cardNumber,
        cardHolderName: cardHolder,
        expirationDate: expiry,
        cvv: cvc,
      }

      navigate('/thanh-toan', {
        state: {
          cardInfo
        },
      });
      
      // chuyen trang
      // navigate('/');
    } catch (error) {
      showNotification('Thanh toán thất bại. Vui lòng thử lại sau.', 'error');
    } finally {
      setIsLoading(false);
    }

  };

  return (
    <div className="container py-5">
      <div className="mb-4">
        <button className="btn btn-outline-dark" onClick={() => window.history.back()}>
          ← Quay lại
        </button>
      </div>

      <div className="row justify-content-center">
        <div className="col-lg-6">
          <h4 className="text-center mb-4 fw-bold">THANH TOÁN</h4>

          <div className="card shadow-lg border-0 p-4">
            <div className="d-flex justify-content-between mb-4">
              <div>
                <strong>Tên sản phẩm</strong>
                <div className="text-muted">1 mục (đã mua)</div>
              </div>
              <div className="text-end">
                <strong>25.00 NOK</strong>
                <div className="text-muted">Đã bao gồm VAT</div>
              </div>
            </div>

            <div className="alert alert-warning small mb-4">
              Thanh toán đang chạy ở chế độ thử nghiệm.{' '}
              <a href="#" className="alert-link">
                Nhấn vào đây để xem dữ liệu thử nghiệm
              </a>
              .
            </div>

            <div className="mb-4">
              <div className="form-check mb-3">
                <input className="form-check-input" type="radio" checked readOnly />
                <label className="form-check-label fw-medium">Thẻ tín dụng</label>
              </div>
              <div className="d-flex gap-2">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg"
                  alt="Visa"
                  width="40"
                />
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/a/a4/Mastercard_2019_logo.svg"
                  alt="Mastercard"
                  width="40"
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label fw-medium">Tên chủ thẻ</label>
              <input
                type="text"
                className={`form-control ${errors.cardHolder ? 'is-invalid' : ''}`}
                placeholder="Nguyen Van A"
                value={cardHolder}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setCardHolder(e.target.value.replace(/[^a-zA-Z\s]/g, ''))
                }
              />
              {errors.cardHolder && <div className="invalid-feedback">{errors.cardHolder}</div>}
            </div>

            <div className="mb-3">
              <label className="form-label fw-medium">Số thẻ</label>
              <input
                type="text"
                className={`form-control ${errors.cardNumber ? 'is-invalid' : ''}`}
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setCardNumber(formatCardNumber(e.target.value))}
                maxLength={19}
              />
              {errors.cardNumber && <div className="invalid-feedback">{errors.cardNumber}</div>}
            </div>

            <div className="row mb-4">
              <div className="col">
                <label className="form-label fw-medium">Ngày hết hạn</label>
                <input
                  type="text"
                  className={`form-control ${errors.expiry ? 'is-invalid' : ''}`}
                  placeholder="MM/YY"
                  value={expiry}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setExpiry(formatExpiry(e.target.value))}
                  maxLength={5}
                />
                {errors.expiry && <div className="invalid-feedback">{errors.expiry}</div>}
              </div>
              <div className="col">
                <label className="form-label fw-medium">CVC</label>
                <input
                  type="text"
                  className={`form-control ${errors.cvc ? 'is-invalid' : ''}`}
                  placeholder="123"
                  value={cvc}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setCvc(e.target.value.replace(/\D/g, '').slice(0, 3))
                  }
                  maxLength={3}
                />
                {errors.cvc && <div className="invalid-feedback">{errors.cvc}</div>}
              </div>
            </div>

            <button
              className="btn btn-success w-100 mb-3"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" />
                  Đang xử lý...
                </>
              ) : (
                'Tiếp tục'
              )}
            </button>

            <button
              className="btn btn-outline-secondary w-100 mb-3"
              onClick={() => {
                setCardNumber('');
                setExpiry('');
                setCvc('');
                setCardHolder('');
                setErrors({});
                showNotification('Đã hủy thanh toán', 'info');
              }}
            >
              Hủy 
            </button>

            <div className="d-flex justify-content-between align-items-center">
              <span className="d-flex align-items-center">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/d/d9/Flag_of_Norway.svg"
                  alt="Cờ Na Uy"
                  width="20"
                  className="me-2"
                />
                Na Uy
              </span>
              <a href="#" className="small text-decoration-none">
                Điều khoản
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;
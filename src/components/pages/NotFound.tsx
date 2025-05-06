import { Container, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import '../../assets/styles/NotFound.css'

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container className="text-center my-5 py-5">
      <FontAwesomeIcon
        icon={faExclamationTriangle}
        size="4x"
        className="text-warning mb-4"
      />
      <h1 className="display-1 fw-bold text-danger">404</h1>
      <h2 className="mb-4">Oops! Trang không tìm thấy</h2>
      <p className="lead mb-4">
        Có vẻ như bạn đã đi lạc. Trang bạn đang tìm không tồn tại hoặc đã bị di chuyển.
      </p>
      <Button
        variant="dark"
        size="lg"
        onClick={() => navigate("/")}
      >
        <FontAwesomeIcon icon="home" className="me-2" />
        Về trang chủ
      </Button>
    </Container>
  );
};

export default NotFound;
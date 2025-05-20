import { useUser } from "../../../context/UserContext";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../../assets/styles/LeftMenu.css';
import AdminSocketListener from './AdminSocketListener';

function Home() {

    const { user } = useUser();


    return (
        <div style={{ height: "1000px", overflowY: "auto" }}>
            <AdminSocketListener />
            <div>Welcome to the Admin Home Page</div>
            <h2>Chào admin: {user?.last_name}</h2>
        </div>

    );
}

export default Home;

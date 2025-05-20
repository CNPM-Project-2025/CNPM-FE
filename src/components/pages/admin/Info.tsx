import { useUser } from "../../../context/UserContext";
import AdminSocketListener from './AdminSocketListener';


function Info() {

    const { user } = useUser();

    return (
        <div>
            <AdminSocketListener />
            <h1>Info</h1>
            <p>This is the info page.</p>
            <p>{user?.first_name}</p>
        </div>
    );
}

export default Info;
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    navigate("/auth");
  };
  return (
    <div>
      <div>Мы в Логине</div>
      <img src="https://cs.pikabu.ru/post_img/2013/06/18/5/1371538554_2017723186.jpeg"></img>
      <div>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Profile;

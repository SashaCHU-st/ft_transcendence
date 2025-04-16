import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    navigate("/auth");
  };
  return (
    <div>
      <div>Мы в Логине</div>
      <img src="https://scontent-hel3-1.xx.fbcdn.net/v/t39.30808-6/488909188_3937861276462128_9017596087234607036_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=0b6b33&_nc_ohc=EuPRvEfrX1kQ7kNvwF_ZqBK&_nc_oc=AdlUKe_CaENgvlV2AaP24IIcY9TQSs2Xw1psksKqxoGQouQOJ8MfXcJeK3bhrygHYtk&_nc_zt=23&_nc_ht=scontent-hel3-1.xx&_nc_gid=qw8UQsswLX1WvqLQtKYsEw&oh=00_AfEStPCHZpWM3yFDbDW22o0t9fZaTfBZdsKZoEm1w5IJ1Q&oe=67FEC7C2"></img>
      <div>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
};

export default Profile;

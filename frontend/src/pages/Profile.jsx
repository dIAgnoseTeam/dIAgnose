import { useAuth } from "../contexts/AuthContext";

const Profile = () => {
  const { user: _user, logout: _logout } = useAuth();

  return <div className="min-w-max min-h-max bg-black">s</div>;
};

export default Profile;

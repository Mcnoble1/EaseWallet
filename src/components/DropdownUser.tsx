import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from "../utils/AppContext";

const DropdownUser = () => {
  const { signOut, email } = useContext( AppContext );
  const navigate = useNavigate();

  const SignOut = () => {
    (signOut().then(() => 
      navigate("/")
    ))
  }

  return (
    <div className="relative">
        <span className="hidden text-right lg:block">
          <span className="block text-sm font-medium text-white">
            {email}
          </span>
          <button onClick={SignOut} className="cursor-pointer text-xs p-1 bg-secondary rounded-lg">Logout</button>
        </span>
    </div>
  );
};

export default DropdownUser;

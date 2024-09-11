import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthActions } from "@convex-dev/auth/react";
import { useNavigate } from 'react-router-dom';
const DropdownUser = () => {
  const { signOut } = useAuthActions();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const trigger = useRef<any>(null);
  const dropdown = useRef<any>(null);
  const [user, setUser] = useState('');
  const navigate = useNavigate();

  const SignOut = () => {
    () => void signOut();
    navigate("/signin");
  }

  // const fetchUser = useQuery(api.users.getUser, { _id: userId });
  const updateUser = useMutation(api.users.updateUser);
  const deleteUser = useMutation(api.users.deleteUser);

  useEffect(() => {
    // Retrieve the email from local storage
    const storedEmail = localStorage.getItem('user');
    if (storedEmail) {
      setUser(storedEmail);
    }
  }, []);

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!dropdown.current) return;
      if (
        !dropdownOpen ||
        dropdown.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setDropdownOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  return (
    <div className="relative">
        <span className="hidden text-right lg:block">
          <span className="block text-sm font-medium text-white">
            {user}
          </span>
          <button onClick={SignOut} className="cursor-pointer text-xs p-1 bg-secondary rounded-lg">Logout</button>
        </span>
    </div>
  );
};

export default DropdownUser;

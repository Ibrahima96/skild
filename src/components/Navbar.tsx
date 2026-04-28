import { Show, UserButton, useUser } from "@clerk/tanstack-react-start";
import { Link } from "@tanstack/react-router";
import { LogIn } from "lucide-react";

const Navbar = () => {
  const { isSignedIn, user, isLoaded } = useUser();
  if (!isLoaded || !isSignedIn) {
    return null;
  }
  return (
    <nav className="navbar">
      <div className="brand">
        <div className="mark">
          <div className="glyph" />
        </div>
        <Link to="/">
          <span>Skild</span>
        </Link>
      </div>

      <div className="actions">
        <Show when="signed-in">
          <span className="font-semibold">{user?.fullName}</span>
          <UserButton />
        </Show>
        <Show when="signed-out">
          <Link to="/sign-in/$" className="btn-primary">
            <LogIn size={16} />
            Sign in
          </Link>
        </Show>
      </div>
    </nav>
  );
};

export default Navbar;

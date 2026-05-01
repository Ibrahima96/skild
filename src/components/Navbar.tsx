import { Show, UserButton, useUser } from "@clerk/tanstack-react-start";
import { Link } from "@tanstack/react-router";
import { LogIn } from "lucide-react";
import { useEffect, useRef } from "react";
import { syncCurrentUserToDb } from "#/server/users/sync-current-user";

const Navbar = () => {
  const {  user } = useUser();
  const syncedUserRef = useRef<string | null>(null);

  useEffect(() => {
    const primaryEmail = user?.primaryEmailAddress?.emailAddress;
    const userId = user?.id;

    if (!userId || !primaryEmail) {
      return;
    }

    if (syncedUserRef.current === userId) {
      return;
    }

    syncCurrentUserToDb({
      data: {
        clerkId: userId,
        email: primaryEmail,
        username: user.username,
        name: user.fullName,
        imageUrl: user.imageUrl,
      },
    })
      .then(() => {
        syncedUserRef.current = userId;
      })
      .catch((error: Error) => {
        console.error("Failed to sync Clerk user to MongoDB:", error);
      });
  }, [user]);
 
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

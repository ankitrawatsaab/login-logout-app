
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { USER_API_END_POINT } from "../utils/constant";

function Navbar() {
  const navigate = useNavigate();

  const [loggedIn, setLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkLoginStatus = () => {
      setLoggedIn(localStorage.getItem("isLoggedIn") === "true");
    };

    window.addEventListener("authChange", checkLoginStatus);
    window.addEventListener("storage", checkLoginStatus);

    return () => {
      window.removeEventListener("authChange", checkLoginStatus);
      window.removeEventListener("storage", checkLoginStatus);
    };
  }, []);

  const handleLogout = async () => {
    if (loading) return;

    setLoading(true);

    try {
      const res = await axios.get(
        `${USER_API_END_POINT}/logout`,
        { withCredentials: true }
      );

      if (res.data.success) {
        localStorage.removeItem("isLoggedIn");
        window.dispatchEvent(new Event("authChange"));
        setLoggedIn(false);

        toast.success(res.data.message || "Logged out successfully!");
        navigate("/");
      } else {
        toast.error(res.data.message || "Logout failed.");
      }
    } catch (error) {
      console.error("Logout error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Logout failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <Link to="/" className="text-2xl font-bold text-blue-700">
          AuthApp
        </Link>

        <div className="flex items-center gap-3 sm:gap-5">
          <Link
            to="/"
            className="text-sm text-gray-600 hover:text-blue-700"
          >
            Home
          </Link>

          {!loggedIn ? (
            <>
              <Link
                to="/login"
                className="text-sm text-gray-600 hover:text-blue-700"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800"
              >
                Signup
              </Link>
            </>
          ) : (
            <button
              type="button"
              onClick={handleLogout}
              disabled={loading}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-60"
            >
              {loading ? "Logging out..." : "Logout"}
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

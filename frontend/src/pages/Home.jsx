
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { USER_API_END_POINT } from "../utils/constant";

function Home() {
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
      console.error(
        "Logout error:",
        error.response?.data || error.message
      );

      toast.error(
        error.response?.data?.message || "Logout failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-1 items-center justify-center bg-gray-50 px-5 py-20">
      <div className="w-full max-w-2xl rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm sm:p-10">
        <span className="mb-5 inline-block rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
          Simple Authentication App
        </span>

        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Welcome to Home Page
        </h1>

        <p className="mx-auto mt-5 max-w-lg text-base leading-7 text-gray-600">
          {loggedIn
            ? "You are logged in! Welcome back."
            : "Please login to your account or create a new account to continue."}
        </p>

        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
          {!loggedIn ? (
            <>
              <Link
                to="/login"
                className="rounded-lg bg-blue-700 px-6 py-3 font-semibold text-white transition hover:bg-blue-800"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-100"
              >
                Create Account
              </Link>
            </>
          ) : (
            <button
              type="button"
              onClick={handleLogout}
              disabled={loading}
              className="rounded-lg bg-red-600 px-6 py-3 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Logging out..." : "Logout"}
            </button>
          )}
        </div>
      </div>
    </main>
  );
}

export default Home;

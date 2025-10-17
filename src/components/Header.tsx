import "boxicons/css/boxicons.min.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

const Header = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Check authentication status
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      setIsAuthenticated(true);
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
        handleLogout();
      }
    }
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMobileMenu = () => {
    const mobileMenu = document.getElementById("mobileMenu");
    if (mobileMenu?.classList.contains("hidden")) {
      mobileMenu?.classList.remove("hidden");
    } else {
      mobileMenu?.classList.add("hidden");
    }
  };

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    const container = document.getElementById("scrollContainer");

    if (section && container) {
      const left = section.offsetLeft;
      container.style.transition = "transform 0.8s cubic-bezier(0.25, 0.1, 0.25, 1)";
      container.style.transform = `translateX(-${left}px)`;
    }
  };

  const navigateToHome = () => {
    navigate("/");
  };

  const navigateToLogin = () => {
    navigate("/login");
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    setShowUserMenu(false);
    navigate('/');
  };

  const navigateToProfile = () => {
    setShowUserMenu(false);
    navigate('/profile');
  };

  const navigateToOrders = () => {
    setShowUserMenu(false);
    navigate('/orders');
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    if (!user) return '?';
    return user.username.charAt(0).toUpperCase();
  };

  return (
    <header className="flex justify-between items-center py-4 px-4 lg:px-20">
      <button
        onClick={() => navigateToHome()}
        className="text-3xl md:text-4xl lg:text-5xl font-light m-0 z-50 text-white"
      >
        Nutrijour
      </button>

      <nav className="hidden md:flex items-center gap-12 justify-self-center">
        <a
          className="text-white text-base tracking-wider hover:text-gray-300 z-50 hover:scale-[120%] duration-300 transform hover:-translate-y-1 rounded-full px-3 cursor-pointer"
          onClick={() => scrollToSection("history")}
        >
          LỊCH SỬ MUA HÀNG
        </a>
        <a
          onClick={() => scrollToSection("menu")}
          className="text-white text-base tracking-wider hover:text-gray-300 z-50 hover:scale-[120%] duration-300 transform hover:-translate-y-1 rounded-full px-3 cursor-pointer"
        >
          MENU
        </a>
        <a
          onClick={() => scrollToSection("cart")}
          className="text-white text-base tracking-wider hover:text-gray-300 z-50 hover:scale-[120%] duration-300 transform hover:-translate-y-1 rounded-full px-3 cursor-pointer"
        >
          GIỎ HÀNG
        </a>
      </nav>

      {/* Desktop Auth Section */}
      <div className="hidden md:block z-50">
        {isAuthenticated && user ? (
          <div className="relative" ref={userMenuRef}>
            <button
              onClick={toggleUserMenu}
              className="flex items-center gap-2 hover:scale-105 transition-transform"
            >
              <div className="w-full h-8 px-14 rounded-full backdrop-blur-md bg-white/20 border border-white/30 flex items-center justify-center text-xl text-white  shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] hover:shadow-[0_8px_32px_0_rgba(255,255,255,0.2)] transition-all">
                {user.username.toLowerCase()}
              </div>
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <div className="absolute right-[-70px] mt-2 w-64 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] overflow-hidden animate-fadeIn">
                {/* User Info */}
                <div className="backdrop-blur-lg bg-white/20 p-4 text-white border-b border-white/20">
                  <p className="font-semibold text-lg drop-shadow-md">{user.username}</p>
                  <p className="text-sm opacity-90 drop-shadow-sm">{user.email}</p>
                  <span className="inline-block mt-2 px-3 py-1 backdrop-blur-sm bg-white/20 border border-white/30 rounded-full text-xs">
                    {user.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}
                  </span>
                </div>

                {/* Menu Items */}
                <div className="py-2">
                  <button
                    onClick={navigateToProfile}
                    className="w-full text-left px-4 py-3 hover:backdrop-blur-lg hover:bg-white/20 flex items-center gap-3 text-white transition-all"
                  >
                    <i className="bx bx-user text-xl"></i>
                    <span>Thông tin cá nhân</span>
                  </button>

                  <button
                    onClick={navigateToOrders}
                    className="w-full text-left px-4 py-3 hover:backdrop-blur-lg hover:bg-white/20 flex items-center gap-3 text-white transition-all"
                  >
                    <i className="bx bx-shopping-bag text-xl"></i>
                    <span>Đơn hàng của tôi</span>
                  </button>

                  {user.role === 'admin' && (
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        navigate('/admin');
                      }}
                      className="w-full text-left px-4 py-3 hover:backdrop-blur-lg hover:bg-white/20 flex items-center gap-3 text-white transition-all"
                    >
                      <i className="bx bx-cog text-xl"></i>
                      <span>Quản lý hệ thống</span>
                    </button>
                  )}

                  <hr className="my-2 border-white/20" />

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 hover:backdrop-blur-lg hover:bg-red-500/20 flex items-center gap-3 text-red-300 hover:text-red-200 transition-all"
                  >
                    <i className="bx bx-log-out text-xl"></i>
                    <span>Đăng xuất</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={navigateToLogin}
            className="relative border-none px-12 py-4 m-2 text-white uppercase rounded-full shadow-[0_0_20px_#eee] transition-all duration-500 cursor-pointer bg-[linear-gradient(to_right,#1F1C2C_0%,#928DAB_51%,#1F1C2C_100%)] bg-[length:200%_auto] hover:[background-position:right_center]"
          >
            ĐĂNG NHẬP
          </button>
        )}
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className="md:hidden text-4xl text-white p-2 z-50"
      >
        <img className="size-9" src="/image/menu.png" alt="" />
      </button>

      {/* Mobile Menu */}
      <div
        id="mobileMenu"
        className="hidden fixed top-16 bottom-0 right-0 left-0 md:hidden pt-3 z-40 bg-black/15"
      >
        <nav className="flex flex-col gap-6 items-center">
          <a
            className="text-base tracking-wider transition-colors hover:text-gray-300 z-50 cursor-pointer"
            onClick={() => scrollToSection("history")}
          >
            LỊCH SỬ MUA HÀNG
          </a>
          <a
            className="text-base tracking-wider transition-colors hover:text-gray-300 z-50 cursor-pointer"
            onClick={() => scrollToSection("menu")}
          >
            MENU
          </a>
          <a
            className="text-base tracking-wider transition-colors hover:text-gray-300 z-50 cursor-pointer"
            onClick={() => scrollToSection("cart")}
          >
            GIỎ HÀNG
          </a>

          {/* Mobile Auth */}
          {isAuthenticated && user ? (
            <>
              <div className="mt-4 text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl shadow-lg mb-2">
                  {getUserInitials()}
                </div>
                <p className="text-white font-semibold">{user.username}</p>
              </div>
              <button
                onClick={navigateToProfile}
                className="text-base tracking-wider transition-colors hover:text-gray-300 cursor-pointer"
              >
                THÔNG TIN CÁ NHÂN
              </button>
              <button
                onClick={handleLogout}
                className="text-base tracking-wider text-red-400 hover:text-red-300 cursor-pointer"
              >
                ĐĂNG XUẤT
              </button>
            </>
          ) : (
            <button
              onClick={navigateToLogin}
              className="mt-4 px-8 py-3 text-white uppercase rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
            >
              ĐĂNG NHẬP
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
import "boxicons/css/boxicons.min.css";
const Header = () => {
  //tonggle mobile menu
  const toggleMobileMenu = () => {
    const mobileMenu = document.getElementById("mobileMenu");
    if (mobileMenu?.classList.contains("hidden")) {
      mobileMenu?.classList.remove("hidden");
    } else {
      mobileMenu?.classList.add("hidden");
    }
  }


  return (
    <header className=" flex justify-between items-center py-4 px-4 lg:px-20 ">
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-light m-0 z-50 text-white">
        Nutrijour
      </h1>
      <nav className=" hidden md:flex items-center gap-12 ">
        <a
          className="text-base tracking-wider  hover: text-gray-300 z-50 hover:scale-[120%]  duration-300  hover:shadow-xl transform hover:-translate-y-1 rounded-full px-3"
          href="#"
        >
          {" "}
          LỊCH SỬ MUA HÀNG
        </a>
        <a
          className="text-base tracking-wider  hover: text-gray-300 z-50 hover:scale-[120%]  duration-300  hover:shadow-xl transform hover:-translate-y-1 rounded-full px-3"
          href="#"
        >
          {" "}
          MENU
        </a>
        <a
          className="text-base tracking-wider  hover: text-gray-300 z-50 hover:scale-[120%]  duration-300  hover:shadow-xl transform hover:-translate-y-1 rounded-full px-3"
          href="#"
        >
          {" "}
          GIỎ HÀNG
        </a>
      </nav>


      <button
        className=" hidden md:block relative border-none  px-12 py-4 m-2 text-white uppercase rounded-full shadow-[0_0_20px_#eee] transition-all duration-500 cursor-pointer bg-[linear-gradient(to_right,#1F1C2C_0%,#928DAB_51%,#1F1C2C_100%)] bg-[length:200%_auto] hover:[background-position:right_center] z-50"
      >
        ĐĂNG NHẶP
      </button>

      {/* mobile */}
      <button onClick={toggleMobileMenu} className="md:hidden text-4xl text-white p-2 z-50">
        <img className="size-9" src="/image/menu.png" alt="" />
      </button>

      <div id="mobileMenu" className="hidden fixed top-16 bottom-0 right-0 left-0 md:hidden pt-3 z-40 bg-black/15 backdrop-blur-md">
        <nav className="flex flex-col gap-6 items-center">
          <a
            className="text-base tracking-wider transition-colors hover: text-gray-300 z-50"
            href="#"
          >
            {" "}
            LỊCH SỬ MUA HÀNG
          </a>
          <a
            className="text-base tracking-wider transition-colors hover: text-gray-300 z-50"
            href="#"
          >
            {" "}
            MENU
          </a>
          <a
            className="text-base tracking-wider transition-colors hover: text-gray-300 z-50"
            href="#"
          >
            {" "}
            GIỎ HÀNG
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;

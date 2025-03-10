import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Link } from "react-router-dom"; // Import Link and useNavigate
import { useState } from "react";

function Navbar({ isExpanded }) {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious();
    if (latest > previous && latest > 100) {
      setHidden(true);
    } else {
      setHidden(false);
    }
  });

  if (isExpanded) return null; // Hide Navbar when expanded

  return (
    <motion.div
      variants={{
        visible: { y: 0 },
        hidden: { y: "-100%" },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: [0.83, 0, 0.17, 1] }}
      className="backdrop-blur-[2px] fixed z-[999] w-full h-[5vw] px-20 py-8 flex justify-between items-center"
    >
      {/* Logo */}
      <div className="logo text-3xl">Extrochem</div>

      {/* Links */}
      <div className="links flex gap-10">
        {["home", "contact"].map((item, index) => (
          <Link
            key={index}
            to={item === "home" ? "/" : `/${item}`} // Define navigation paths
            className={`text-md capitalize text-white font-light ${
              index === 4 && "ml-32"
            }`}
          >
            {item}
          </Link>
        ))}
      </div>
    </motion.div>
  );
}
export default Navbar;
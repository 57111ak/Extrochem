import { motion } from "framer-motion";
import { GoArrowUpRight } from "react-icons/go";
import { useNavigate } from "react-router-dom"; // Import useNavigate

function LandingPage() {
  const navigate = useNavigate(); // Initialize useNavigate

  return (
    <div data-scroll data-scroll-section data-scroll-speed="-.3" className="relative w-full h-screen backdrop-blur-xl pt-1">
      <video 
        autoPlay 
        loop 
        muted 
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      >
        {/* <source src="https://video.twimg.com/ext_tw_video/1723643643276263425/pu/vid/avc1/1280x720/k_llptL6L-bKhxoA.mp4?tag=12" type="video/mp4" /> */}
        <source src="https://www.shutterstock.com/shutterstock/videos/3519293457/preview/stock-footage-corona-spike-protein-structure-analysis-during-medicine-research-medicine-development-research-by.mp4" type="video/mp4" />
      </video>
      
      {/* Content */}
      <div className="relative z-10 textstructure mt-40 px-20">
        {["Extrochem", " De Novo molecule Generation ", "Get started"].map((item, index) => {
          return (
            <div key={index} className="masker">
              <div className="w-fit flex items-center">
                {index === 2 &&  (
                  <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: "4vw" }} 
                    transition={{ ease: [0.76, 0, 0.24, 1], duration: 1 }} 
                    className="w-[9vw] h-[5vw] bg-cover rounded-xl text-[3vw]"
                  ></motion.div>
                )}
                <h1
                  className={`uppercase anzo1 ${index===0 ? 'text-green-600' :" text-white"}  ${index === 2 ? 'px-10  mt-10 border-[1px] border-zinc-500 rounded-full font-light  uppercase text-white cursor-pointer hover:bg-green-600 hover:text-black transition text-[1vw]' : 'text-[6vw]'} leading-[6vw] tracking-tighter font-[FoundersGrotesk,Roboto,sans-serif] font-semibold `}
                  onClick={() => index === 2 && navigate("/input")} // Navigate to Input page
                >
                  {item}
                </h1>
              </div>
            </div>
          );
        })}
      </div>
      <div className="relative z-10 border-t-[1px] border-zinc-700 mt-28 flex justify-between items-center px-20 py-5">
        {["Extrochem", "Design and optimize small molecules with Generative AI and Physics-based methods"].map((item, index) => (
          <p className="text-md font-light tracking-tight leading-none text-white" key={index}>
            {item}
          </p>
        ))}
        <div className="start flex justify-center gap-5">
          <div
            className="px-10 py-2 border-[1px] border-zinc-500 rounded-full font-light text-md uppercase text-white cursor-pointer hover:bg-green-600 hover:text-black transition"
            onClick={() => navigate("/input")} 
          >
            Start
          </div>
          <div className="w-10 h-10 border-[1px] border-zinc-500 rounded-full flex justify-center items-center cursor-pointer hover:bg-green-600 hover:text-black transition">
            <GoArrowUpRight className="text-white" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
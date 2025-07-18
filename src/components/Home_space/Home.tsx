import './Home_dec.css';
import React from 'react';
import Header from '../Header_space/Header';
import SignUp from '../SignUp_space/SignUp';
import { useNavigate } from 'react-router-dom';

/*type ButtonProps = {
  handleClick: () => void
}*/

const Home: React.FC = (/*props: ButtonProps*/) => {
  const navigate = useNavigate();
    const infoOneUrl = "https://cdn.cgdream.ai/_next/image?url=https%3A%2F%2Fapi.cgdream.ai%2Frails%2Factive_storage%2Fblobs%2Fredirect%2FeyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBOUUyRnc9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ%3D%3D--26c712540287369ed6fd9952c7e66e9e75622a53%2Fe4c4bd12-274f-450c-9f76-e85fa39d9e91_0.png&w=512&q=95"
    const infoTwoUrl = "https://cdn.cgdream.ai/_next/image?url=https%3A%2F%2Fapi.cgdream.ai%2Frails%2Factive_storage%2Fblobs%2Fredirect%2FeyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBeWk2Q3c9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ%3D%3D--7bef2e8bb229bee100524674b8d679849965a36c%2F6955ae1d-eba5-4c1f-8f4a-8247ecfa5347_0.png&w=512&q=90"
    const colOneUrl = "https://cdn.cgdream.ai/_next/image?url=https%3A%2F%2Fapi.cgdream.ai%2Frails%2Factive_storage%2Fblobs%2Fredirect%2FeyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBd3o2RHc9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ%3D%3D--e841dadb0a84741279ef91f43d295a93b7ac8872%2F5b40bece-9d79-404b-95a8-72adb5b7f2b5_0.png&w=512&q=90"
    const colTwoUrl = "https://cdn.cgdream.ai/_next/image?url=https%3A%2F%2Fapi.cgdream.ai%2Frails%2Factive_storage%2Fblobs%2Fredirect%2FeyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBellTSFE9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ%3D%3D--6904d1220f4631d3d2e9eb52c1a3cfd06ca3f5ee%2Fd27b80ff-c651-4559-b212-a93ee354dcc1_0.png&w=512&q=90"
    const colThreeUrl = "https://cdn.cgdream.ai/_next/image?url=https%3A%2F%2Fapi.cgdream.ai%2Frails%2Factive_storage%2Fblobs%2Fredirect%2FeyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBMmt6SlE9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ%3D%3D--c936eb592cade01150d5032353bf6877de2eaf47%2Fd22006f6-d457-4aff-8872-2d094fb7500f_0.png&w=512&q=90"
    
    const handleClick = (): void => {
      navigate('/signup');
    }
    
    return (
      <>
        <Header></Header>
        <section className="intro-pic">
          {/*<div className="search">
            <span className="search-icon material-symbols-outlined">search</span>
            <input
                className="search-input"
                type="search"
                name="search-bar"
                id="search-bar"
                placeholder="Search"
            />
          </div>*/}
        </section>
  
        <main>
          <section>
            <div className="parent-content">
              <div className="second-nav">
                <ul>
                  <li>
                    <a href="#characters">Characters</a>
                  </li>
                  <li>
                    <a href="#architecture">Architecture</a>
                  </li>
                  <li>
                    <a href="#vehicles">Vehicles</a>
                  </li>
                  <li>
                    <a href="#swords">Swords</a>
                  </li>
                </ul>
              </div>
              <div className="info1 container">
                <div className="info1-text">
                  <h1> Where imagination meets reality</h1>
                  <p>
                    CENTURION is an interactive mind-blowing application that
                    utilizes AI to fashion images
                  </p>
                </div>
                <img
                  src={infoOneUrl}
                  alt="Ninja"
                  className="info1-image"
                />
              </div>
              <div className="info2 container">
                <div className="info2-text">
                  <h1>Custom 3D model enthusiast?</h1>
                  <button className="GS-button" id="GS-btn" onClick={handleClick}>
                    Get started
                  </button>
                </div>
                <img
                  src={infoTwoUrl}
                  alt="3D object"
                  className="info2-image"
                />
              </div>
              <div className="info3 container2">
                <div className="info3-text">
                  <h1>3D Model Marketplace</h1>
                  <p>
                    Choose from a variety of 3D models for use in architecture,
                    gaming, VR, advertisement, 3D printing, animation
                  </p>
                </div>
                <div className="info3-content1">
                  <img
                    src={colOneUrl}
                    alt="video game"
                    className="info3-image1"
                  />
                  <p className="info3-p1">Buy 3D models for your video games</p>
                </div>
                <div className="info3-content2">
                  <img
                    src={colTwoUrl}
                    alt="3D model"
                    className="info3-image2"
                  />
                  <p className="info3-p2">Buy 3D models for your 3D printing</p>
                </div>
                <div className="info3-content3">
                  <img
                    src={colThreeUrl}
                    alt="architecture"
                    className="info3-image3"
                  />
                  <p className="info3-p3">Buy 3D models for your architecture</p>
                </div>
              </div>
            </div>
          </section>
        </main>
      </>
    );
  };
  
  export default Home;
  
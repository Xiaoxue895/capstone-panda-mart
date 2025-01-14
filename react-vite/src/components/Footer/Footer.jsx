import { FaGithub } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
import "./Footer.css";

function Footer() {
  return (
    <footer>
      <div className="footer-container">
          {/* <div>
            <a href="">
              <img src="" alt="" />
            </a>
          </div> */}
          <div className="my-info">
               <p>Xiaoxue(Alice) wang</p>
               <div className="my-link">
                    <a href="https://github.com/Xiaoxue895">
                    <FaGithub />
                    </a>
                    <a href="https://github.com/Xiaoxue895">
                    <FaLinkedin />
                    </a>
                </div>

        </div>
        <div className="inspiration">
          <p>
          My English name comes from Alice in Wonderland, and Panda Mart is the online version of a Chinese supermarket. Just as Chinese supermarkets have a broad market and user base on this continent, e-commerce platforms should also have a Chinese e-commerce presence.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
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
          My English name is inspired by Alice in Wonderland, and Panda Mart is  an online Chinese supermarket. Just as Chinese supermarkets are popular here, e-commerce platforms should also embrace a Chinese-style presence.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
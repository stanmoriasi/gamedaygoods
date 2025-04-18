import "./footer.css";

const Footer: React.FC = () => (
  <footer className="footer-gradient">
    <div className="footer-container">
      <div className="footer-text">
        Made with{" "}
        <span
          className="footer-emoji"
          role="img"
          aria-label="heart"
          aria-hidden="false"
        >
          ❤️
        </span>{" "}
        by Group 4.
      </div>
      <div className="footer-tagline">Get all your gear here!</div>
    </div>
  </footer>
);

export default Footer;

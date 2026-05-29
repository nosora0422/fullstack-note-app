import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="md:fixed md:bottom-0 md:left-0 flex flex-row justify-center items-center p-2 w-full text-center bg-white">
      <span>&copy;Sora Noh 2026</span>
      <span className="mx-2">|</span>
      <Link to="/privacy-policy" className="-text--main-font-color underline">
        Privacy Policy
      </Link>
    </footer>
  );
}

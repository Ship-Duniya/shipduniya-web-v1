import Image from "next/image";
import React from "react";
// import Logo from "../../public/shipDuniya.png";

const Footer = () => {
  return (
    <footer className="flex bg-secondary py-[10%]">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-6">
        <Image src="https://storage.googleapis.com/ship-duniya_bucket/Images/shipDuniya.png" alt="shipduniy7a" height={180} width={280} unoptimized />

        <div className="flex flex-col">
          <div className="flex  space-x-6 mt-4 md:mt-0">
            <button
              onClick={() => setCurrentPage("about")}
              className="hover:underline"
            >
              About Us
            </button>
            <button
              onClick={() => setCurrentPage("services")}
              className="hover:underline"
            >
              Services
            </button>
            <button
              onClick={() => setCurrentPage("contact")}
              className="hover:underline"
            >
              Contact
            </button>
            <button
              onClick={() => setCurrentPage("faq")}
              className="hover:underline"
            >
              FAQ
            </button>
          </div>
          <div className="flex flex-col text-center text-sm border-t border-gray-700 mt-6 pt-4">
            <button
              onClick={() => setCurrentPage("terms")}
              className="hover:underline mr-4"
            >
              Terms & Conditions
            </button>
            <button
              onClick={() => setCurrentPage("privacy")}
              className="hover:underline"
            >
              Privacy Policy
            </button>
            <p className="mt-2">
              &copy; {new Date().getFullYear()} ShipDuniya. All rights reserved.
            </p>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="flex space-x-4 mt-4 md:mt-0">
          <a href="#" className="hover:text-white">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="#" className="hover:text-white">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="#" className="hover:text-white">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="#" className="hover:text-white">
            <i className="fab fa-linkedin-in"></i>
          </a>
        </div>
      </div>

      {/* Terms & Copyright */}
    </footer>
  );
};

export default Footer;

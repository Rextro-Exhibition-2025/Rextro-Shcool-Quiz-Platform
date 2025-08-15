import React from "react";
import Image from "next/image";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaYoutube,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="w-full border-t border-gray-200 bg-white py-6 px-4">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Logos */}
          <div className="flex items-center gap-4">
            <Image src="/fe-logo.png" alt="FE Logo" width={80} height={80} />
            <Image src="/fe-logo2.png" alt="FE Logo 2" width={80} height={80} />
          </div>
          {/* Address & Contacts */}
          <div className="flex flex-col md:flex-row items-center gap-8 flex-1 justify-center">
            <div className="flex items-start gap-2">
              <FaMapMarkerAlt className="text-[#4b2e83] mt-1" />
              <div className="text-sm text-gray-800">
                Faculty of Engineering,
                <br />
                University of Ruhuna,
                <br />
                Hapugala, Galle,
                <br />
                Sri Lanka. 80000
              </div>
            </div>
            <div className="flex items-start gap-2">
              <FaPhoneAlt className="text-[#4b2e83] mt-1" />
              <div className="text-sm text-gray-800">
                +94 912245765
                <br />
                +94 912245766
                <br />
                +94 912245767
              </div>
            </div>
            <div className="flex items-start gap-2">
              <FaEnvelope className="text-[#4b2e83] mt-1" />
              <div className="text-sm text-gray-800">
                Fax: +94 912245762
                <br />
                Email: ar@eng.ruh.ac.lk
              </div>
            </div>
          </div>
          {/* Social */}
          <div className="flex flex-col items-center gap-2">
            <span className="font-semibold">Follow us:</span>
            <div className="flex gap-3 text-2xl text-[#4b2e83]">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaLinkedinIn />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaYoutube />
              </a>
            </div>
          </div>
        </div>
        {/* Copyright */}
        <div className="text-center text-sm text-gray-700 mt-4">
          © 2025 Faculty of Engineering, University of Ruhuna. All Rights
          Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;

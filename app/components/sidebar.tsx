"use client";

import { useState, useEffect } from "react";
import { FaClipboardList, FaCheckCircle, FaTachometerAlt, FaSignOutAlt } from "react-icons/fa";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const [isAffectationOpen, setAffectationOpen] = useState(false);
  const pathname = usePathname();
  const [isSoutenanceActive, setSoutenanceActive] = useState(false);

  useEffect(() => {
    setSoutenanceActive(
      pathname === "/pages/PlanifierSoutenance" ||
      pathname === "/GestionJurys" ||
      pathname === "/pages/ListeSoutenances" ||
      pathname === "/suivi-sout"
    );
  }, [pathname]);

  const toggleAffectation = () => {
    setAffectationOpen(!isAffectationOpen);
  };

  return (
    <div className="h-screen w-64 bg-gray-800 text-white p-5">
      <h1 className="text-lg font-bold">📌 EST Safi</h1>
      <ul className="mt-5 space-y-2">
        <Link href="/">
          <li className="flex items-center gap-3 p-3 hover:bg-gray-700 cursor-pointer">
            <FaTachometerAlt /> Dashboard
          </li>
        </Link>

        <li>
          <button
            className="w-full text-left flex items-center gap-3 p-3 hover:bg-gray-700 cursor-pointer"
            onClick={toggleAffectation}
          >
            <FaClipboardList /> Affectation
          </button>

          {isAffectationOpen && (
            <ul className="ml-5 space-y-2">
              <Link href="/suivi">
                <li className="flex items-center gap-3 p-3 hover:bg-gray-700 cursor-pointer">
                  <FaCheckCircle /> Suivi
                </li>
              </Link>

              <li>
                <Link href="/pages/PlanifierSoutenance">
                  <div className="flex items-center gap-3 p-3 hover:bg-gray-700 cursor-pointer">
                    <FaCheckCircle /> Soutenance
                  </div>
                </Link>
                {isSoutenanceActive && (
                  <ul className="ml-5 space-y-2">
                    <Link href="/pages/GestionJurys">
                      <li className="flex items-center gap-3 p-3 hover:bg-gray-700 cursor-pointer">
                        Gestion des Jurys
                      </li>
                    </Link>
                    <Link href="/pages/ListeSoutenances">
                      <li className="flex items-center gap-3 p-3 hover:bg-gray-700 cursor-pointer">
                        Liste des Soutenances
                      </li>
                    </Link>
                    <Link href="/suivi-sout">
                      <li className="flex items-center gap-3 p-3 hover:bg-gray-700 cursor-pointer">
                        Suivi Sout
                      </li>
                    </Link>
                  </ul>
                )}
              </li>
            </ul>
          )}
        </li>

        <Link href="/logout">
          <li className="flex items-center gap-3 p-3 hover:bg-gray-700 cursor-pointer">
            <FaSignOutAlt /> Déconnexion
          </li>
        </Link>
      </ul>
    </div>
  );
};

export default Sidebar;
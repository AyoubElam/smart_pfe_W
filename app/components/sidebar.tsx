"use client";

import { useState, useEffect } from "react";
import { FaClipboardList, FaCheckCircle, FaTachometerAlt, FaSignOutAlt } from "react-icons/fa";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const [isAffectationOpen, setAffectationOpen] = useState(false);
  const pathname = usePathname(); // Use usePathname to get the current route
  const [isSoutenancePage, setIsSoutenancePage] = useState(false);

  useEffect(() => {
    // Check if the current path is "/PlanifierSoutenance"
    setIsSoutenancePage(pathname?.startsWith("/PlanifierSoutenance") ?? false);
  }, [pathname]); // React to path changes

  const toggleAffectation = () => {
    setAffectationOpen(!isAffectationOpen);
  };

  return (
    <div className="h-screen w-64 bg-gray-800 text-white p-5">
      <h1 className="text-lg font-bold">📌 EST Safi</h1>
      <ul className="mt-5 space-y-2">
        {/* Dashboard Link */}
        <Link href="/">
          <li className="flex items-center gap-3 p-3 hover:bg-gray-700 cursor-pointer">
            <FaTachometerAlt /> Dashboard
          </li>
        </Link>

        {/* Affectation Dropdown */}
        <li>
          <button
            className="w-full text-left flex items-center gap-3 p-3 hover:bg-gray-700 cursor-pointer"
            onClick={toggleAffectation}
          >
            <FaClipboardList /> Affectation
          </button>

          {isAffectationOpen && (
            <ul className="ml-5 space-y-2">
              {/* Suivi Link */}
              <Link href="/suivi">
                <li className="flex items-center gap-3 p-3 hover:bg-gray-700 cursor-pointer">
                  <FaCheckCircle /> Suivi
                </li>
              </Link>

              {/* Soutenance Link */}
              <Link href="/PlanifierSoutenance">
                <li className="flex items-center gap-3 p-3 hover:bg-gray-700 cursor-pointer">
                  <FaCheckCircle /> Soutenance
                </li>
              </Link>
            </ul>
          )}
        </li>

        {/* Sub-menu for Soutenance Page */}
        {isSoutenancePage && (
          <ul className="ml-5 space-y-2">
            {/* Gestion des Jurys Link */}
            <Link href="/GestionJurys">
              <li className="flex items-center gap-3 p-3 hover:bg-gray-700 cursor-pointer">
                Gestion des Jurys
              </li>
            </Link>

            {/* Planification Link */}
            <Link href="/ListeSoutenances">
              <li className="flex items-center gap-3 p-3 hover:bg-gray-700 cursor-pointer">
                Liste des Soutenances
              </li>
            </Link>

            {/* Suivi Sout Link */}
            <Link href="/suivi-sout">
              <li className="flex items-center gap-3 p-3 hover:bg-gray-700 cursor-pointer">
                Suivi Sout
              </li>
            </Link>
          </ul>
        )}

        {/* Déconnexion Link (only if not on Soutenance page) */}
        {!isSoutenancePage && (
          <Link href="/logout">
            <li className="flex items-center gap-3 p-3 hover:bg-gray-700 cursor-pointer">
              <FaSignOutAlt /> Déconnexion
            </li>
          </Link>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;
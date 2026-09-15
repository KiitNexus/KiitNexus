"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface Recruitment {
  _id: string;
  name: string;
  email: string;
  whatsapp: string;
  semester: string;
  year: string;
  branch: string;
  domain: string;
  resume?: string;
  appliedAt: string;
}

export default function AdminRecruitments() {
  const [applications, setApplications] = useState<Recruitment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === "Souravgiri@2026") {
      setIsAuthenticated(true);
    } else {
      alert("Incorrect Password!");
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchApplications = async () => {
      try {
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";
        const res = await fetch(`${backendUrl}/api/recruitments`);
        if (!res.ok) {
          throw new Error("Failed to fetch");
        }
        const data = await res.json();
        setApplications(data);
      } catch (err) {
        setError("Error fetching applications.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [isAuthenticated]);

  const exportToCSV = () => {
    if (applications.length === 0) return;

    const headers = ["Name", "Email", "WhatsApp", "Semester", "Year", "Branch", "Domain", "Resume", "Applied At"];
    const csvRows = [headers.join(",")];

    applications.forEach((app) => {
      const row = [
        `"${app.name}"`,
        `"${app.email}"`,
        `"${app.whatsapp}"`,
        `"${app.semester}"`,
        `"${app.year}"`,
        `"${app.branch}"`,
        `"${app.domain}"`,
        `"${app.resume || 'N/A'}"`,
        `"${new Date(app.appliedAt).toLocaleString()}"`,
      ];
      csvRows.push(row.join(","));
    });

    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", `applications_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#111] text-white flex items-center justify-center p-4 selection:bg-pink-600 selection:text-white font-sans">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#1c1c1c] border-[3px] border-yellow-400 p-8 md:p-12 shadow-[8px_8px_0px_#ff0055] w-full max-w-md text-center"
        >
          <h1 className="text-3xl font-black uppercase tracking-tighter text-yellow-400 drop-shadow-[2px_2px_0px_#000] mb-2">
            ADMIN LOGIN
          </h1>
          <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-8">
            Restricted Access
          </p>
          <form onSubmit={handleLogin} className="space-y-6">
            <input
              type="password"
              placeholder="Enter Password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full bg-[#111] border-2 border-gray-700 text-white p-3 focus:outline-none focus:border-pink-500 transition-colors text-center tracking-widest"
              autoFocus
            />
            <button
              type="submit"
              className="w-full bg-pink-600 hover:bg-pink-500 text-white border-2 border-pink-700 p-3 font-black uppercase tracking-widest transition-transform hover:-translate-y-1 active:translate-y-0"
            >
              Access Panel
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111] text-white pt-24 pb-12 px-4 md:px-8 font-sans selection:bg-pink-600 selection:text-white">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-yellow-400 drop-shadow-[2px_2px_0px_#000]">
              Admin Panel
            </h1>
            <p className="text-xl text-pink-500 mt-2 font-bold uppercase tracking-widest">
              Recruitment Applications
            </p>
          </div>
          
          <button
            onClick={exportToCSV}
            disabled={applications.length === 0}
            className="bg-[#1c1c1c] text-white border-2 border-pink-500 hover:bg-pink-600 hover:text-white px-6 py-3 font-bold uppercase tracking-wider transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Export to CSV
          </button>
        </div>

        {error && (
          <div className="p-4 mb-6 text-center font-bold uppercase tracking-wide border-2 border-red-500 bg-red-900/50 text-red-300">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center text-yellow-400 font-bold uppercase text-2xl mt-20 animate-pulse">
            Loading Data...
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center text-gray-500 font-bold uppercase text-xl mt-20">
            No applications found.
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="overflow-x-auto bg-[#1c1c1c] border-[3px] border-yellow-400 shadow-[8px_8px_0px_#ff0055]"
          >
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-yellow-400 text-black uppercase text-sm font-black tracking-wider">
                  <th className="p-4 border-b-2 border-black">Name</th>
                  <th className="p-4 border-b-2 border-black">Email</th>
                  <th className="p-4 border-b-2 border-black">WhatsApp</th>
                  <th className="p-4 border-b-2 border-black">Branch</th>
                  <th className="p-4 border-b-2 border-black">Domain</th>
                  <th className="p-4 border-b-2 border-black">Resume</th>
                  <th className="p-4 border-b-2 border-black">Date</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app, index) => (
                  <tr 
                    key={app._id} 
                    className={`border-b border-gray-800 hover:bg-[#2a2a2a] transition-colors ${index % 2 === 0 ? 'bg-[#1c1c1c]' : 'bg-[#181818]'}`}
                  >
                    <td className="p-4 font-bold text-white">{app.name}</td>
                    <td className="p-4 text-gray-300">{app.email}</td>
                    <td className="p-4 text-gray-300">{app.whatsapp}</td>
                    <td className="p-4 text-pink-400 font-bold uppercase">{app.branch} ({app.semester} / {app.year})</td>
                    <td className="p-4 text-yellow-400 font-black uppercase">{app.domain}</td>
                    <td className="p-4 text-cyan-400 font-bold text-sm">
                      {app.resume ? (
                        <a href={app.resume} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          View Link
                        </a>
                      ) : (
                        <span className="text-gray-600">N/A</span>
                      )}
                    </td>
                    <td className="p-4 text-gray-500 text-sm">{new Date(app.appliedAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}
      </div>
    </div>
  );
}


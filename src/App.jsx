import React, { useState } from "react";
import axios from "axios";
import fileDownload from "js-file-download";
import BASE from "./BaseURL";
import { ClipLoader } from "react-spinners";
import { FaGithub, FaLinkedin } from "react-icons/fa";
const VERSIONURL = "https://registry.npmjs.org/";

function App() {
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [author, setAuthor] = useState("");
  const [folderStructure, setFolderStructure] = useState("");
  const [optionalFiles, setOptionalFiles] = useState([]);
  const [dependencies, setDependencies] = useState([]);
  const [devDependencies, setDevDependencies] = useState([]);
  const [loading, setLoading] = useState(false);
  const commonDependencies = [
    "express",
    "cors",
    "dotenv",
    "mongoose",
    "axios",
    "jsonwebtoken",
    "bcryptjs",
    "joi",
    "passport",
    "passport-jwt",
    "multer",
    "winston",
    "compression",
    "helmet",
    "morgan",
    "cookie-parser",
    "express-session",
    "uuid",
    "dayjs",
    "validator",
    "swagger-ui-express",
    "yamljs",
    "http-errors",
    "express-rate-limit",
    "xss-clean",
    "hpp",
    "qs",
  ];

  const commonDevDependencies = [
    "nodemon",
    "eslint",
    "prettier",
    "jest",
    "supertest",
    "husky",
    "eslint-config-airbnb-base",
    "eslint-plugin-import",
    "cross-env",
    "ts-node",
    "typescript",
    "babel-cli",
    "babel-preset-env",
    "dotenv-cli",
    "lint-staged",
    "mocha",
    "chai",
    "sinon",
  ];

  const handleDependencyChange = (dep) => {
    if (dependencies.includes(dep)) {
      setDependencies(dependencies.filter((d) => d !== dep));
    } else {
      setDependencies([...dependencies, dep]);
    }
  };

  const handleDevDependencyChange = (dep) => {
    if (devDependencies.includes(dep)) {
      setDevDependencies(devDependencies.filter((d) => d !== dep));
    } else {
      setDevDependencies([...devDependencies, dep]);
    }
  };

  const handleOptionalFileChange = (file) => {
    if (optionalFiles.includes(file)) {
      setOptionalFiles(optionalFiles.filter((f) => f !== file));
    } else {
      setOptionalFiles([...optionalFiles, file]);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!projectName) {
      alert("Project name is required");
      setLoading(false);
      return;
    }

    let formData = new FormData();
    formData.append("projectName", projectName);
    formData.append("description", description);
    formData.append("author", author);
    formData.append("folderStructure", folderStructure);
    formData.append("optionalFiles", JSON.stringify(optionalFiles));

    const dependenciesWithVersion = await Promise.all(
      dependencies.map((item) => getDependencyWithVersion(item))
    );
    formData.append(
      "dependencies",
      JSON.stringify([...dependenciesWithVersion])
    );

    const devDependenciesWithVersion = await Promise.all(
      devDependencies.map((item) => getDependencyWithVersion(item))
    );
    formData.append(
      "devDependencies",
      JSON.stringify([...devDependenciesWithVersion])
    );

    const response = await axios.post(`${BASE}/create-project`, formData, {
      responseType: "blob",
    });

    if (response.data != null) {
      fileDownload(response.data, `${projectName}.zip`);
    } else {
      alert("error in creating project");
    }
    setLoading(false);
    setProjectName("");
    setDescription("");
    setAuthor("");
    setFolderStructure("");
    setOptionalFiles([]);
    setDependencies([]);
    setDevDependencies([]);
  };

  const getDependencyWithVersion = async (dependency) => {
    const response = await axios.get(VERSIONURL + dependency);

    if (response.data != null) {
      return {
        name: response.data.name,
        version: response.data["dist-tags"].latest,
      };
    } else return {};
  };

  return (
    <div className="min-h-screen w-full bg-black p-8">
      <header className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-white drop-shadow-sm">
          Express Initializr
        </h1>
        <p className="text-lg text-white mt-2">
          Scaffold your backend project effortlessly
        </p>
        <div className="mt-12 text-center text-black">
          <p className="text-xl font-semibold tracking-wide">
            Created by Anuj Anthwal
          </p>

          <div className="flex justify-center items-center gap-6 mt-3">
            <a
              href="https://github.com/Anujanthwal-dotcom"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-white hover:text-blue-800 transition-colors"
            >
              <FaGithub size={20} />
              <span className="underline">GitHub</span>
            </a>

            <a
              href="https://www.linkedin.com/in/anuj-anthwal/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-white hover:text-blue-800 transition-colors"
            >
              <FaLinkedin size={20} />
              <span className="underline">LinkedIn</span>
            </a>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 h-full">
        {/* Left Section */}
        <section className="bg-gray-700 shadow-md rounded-xl p-8 border-4 border-white flex flex-col justify-between">
          <div className="space-y-6">
            <div>
              <label className="block text-white font-medium mb-2">
                Project Name
              </label>
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full px-4 py-3 border-2 border-white text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder=""
                required
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2">
                Description
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 border-2 border-white text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder=""
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2">
                Author
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-4 py-3 border-2 border-white text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder=""
              />
            </div>
          </div>

          {/* Folder Structure Selector */}
          <div className="mt-10">
            <label className="block text-white font-semibold mb-3">
              Choose Folder Structure
            </label>
            <div className="flex gap-4">
              {["Basic", "MVC", "MMVC"].map((structure, idx) => (
                <label key={idx} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="folderStructure"
                    value={structure}
                    className="accent-blue-600"
                    checked={folderStructure === structure}
                    onChange={(e) => setFolderStructure(e.target.value)}
                  />
                  <span className="text-white">{structure}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Optional Files */}
          <div className="mt-8">
            <label className="block text-gray-700 font-semibold mb-3">
              Optional Files to Include
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[".env", ".gitignore", "README.md", "Dockerfile"].map(
                (file, idx) => (
                  <label key={idx} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      value={file}
                      className="accent-green-600"
                      checked={optionalFiles.includes(file)}
                      onChange={() => handleOptionalFileChange(file)}
                    />
                    <span className="text-white">{file}</span>
                  </label>
                )
              )}
            </div>
          </div>
        </section>

        {/* Right Section */}
        <section className="bg-gray-700 shadow-md rounded-xl p-8 border-4 border-white flex flex-col justify-between">
          <div className="space-y-10">
            <div>
              <h2 className="text-xl font-semibold text-white mb-3 border-b pb-2 border-gray-300">
                Common Dependencies
              </h2>
              <div className="flex flex-wrap gap-3">
                {commonDependencies.map((dep, idx) => (
                  <span
                    key={idx}
                    className={`${
                      dependencies.includes(dep)
                        ? "bg-blue-300 text-blue-800"
                        : "bg-blue-100 text-blue-800"
                    } px-4 py-2 rounded-full text-sm font-medium border border-blue-300 hover:bg-blue-300 hover:cursor-pointer transition`}
                    onClick={() => handleDependencyChange(dep)}
                  >
                    {dep}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold text-white mb-3 border-b pb-2 border-gray-300">
                Common Dev Dependencies
              </h2>
              <div className="flex flex-wrap gap-3">
                {commonDevDependencies.map((dep, idx) => (
                  <span
                    key={idx}
                    className={`${
                      devDependencies.includes(dep)
                        ? "bg-green-300 text-green-800"
                        : "bg-green-100 text-green-800"
                    } px-4 py-2 rounded-full text-sm font-medium border border-green-300 hover:bg-green-200 hover:cursor-pointer transition`}
                    onClick={() => handleDevDependencyChange(dep)}
                  >
                    {dep}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Floating Create Project Button */}
      <div className="w-full flex justify-center mt-12">
        <button
          onClick={(e) => handleCreateProject(e)}
          className="bg-gray-500 hover:bg-white hover:cursor-pointer hover:text-black text-white text-lg px-6 py-3 rounded-full shadow-xl transition font-semibold"
          style={{ minWidth: "180px" }}
        >
          <span
            className="flex items-center justify-center w-full"
            style={{ minHeight: "24px" }}
          >
            {loading ? (
              <ClipLoader color="#fff" size={24} />
            ) : (
              <span>"Create Project"</span>
            )}
          </span>
        </button>
      </div>
    </div>
  );
}

export default App;

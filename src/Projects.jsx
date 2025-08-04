/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import "./ProjectStyles.css";
import videoSrc from "/MC TRAILER.mp4";
import figImg from "/MedAssessmentForm_preview.jpg";

export default function Projects({ setInputLocked }) {
  const [data, setData] = useState(null);
  const [selected, setSelected] = useState(0);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (setInputLocked) setInputLocked(true);
    return () => setInputLocked(false);
  }, [setInputLocked]);

  useEffect(() => {
    fetch("./all_project_code.json")
      .then((res) => res.json())
      .then(setData)
      .catch((err) => console.error("Failed to load project code:", err));
  }, []);

  const projectsMeta = [
    {
      key: "AOOP_Project",
      name: "AOOP_Project",
      description:
        "a banking system simulation featuring classes for customers, accounts, transactions, and ATM interface logic.",
      tools: "Java, IntelliJ",
      download: "/AOOP_Project.zip",
    },
    {
      key: "K00300249",
      name: "K00300249",
      description:
        "a prototype personal portfolio website exploring scroll-based transitions, layout responsiveness, and identity themes.",
      tools: "HTML, CSS, JS",
      download: "/K00300249.zip",
    },
    {
      key: "OOP_Project",
      name: "OOP_Project",
      description:
        "a structured Java application using interfaces and inheritance to demonstrate object-oriented programming concepts.",
      tools: "Java, Interfaces",
      download: "/OOP_Project.zip",
    },
    {
      key: "Snake",
      name: "Snake",
      description:
        "a classic snake game recreation in Java, complete with increasing difficulty and keyboard controls.",
      tools: "Java",
      download: "/Snake.zip",
    },
    {
      key: "MedAssessmentForm",
      name: "MedAssessmentForm",
      description:
        "a Figma-based interactive wireframe of a medical assessment interface, focusing on layout and clarity.",
      tools: "Figma",
      download: "/MedAssessmentForm.fig",
    },
    {
      key: "MC_TRAILER",
      name: "MC_TRAILER",
      description:
        "a trailer for a media concept project, edited with layered audio and video to build suspense and tone.",
      tools: "Premiere Pro, Audio Design",
      download: "/MC TRAILER.mp4",
    },
  ];

  const ProjectView = ({ proj, code }) => (
    <div className="project-glitch glitch-in">
      <h2>{proj.name}()</h2>
      <p className="meta">// built with {proj.tools}</p>
      <p className="summary">// {proj.description}</p>
      <div className="project-content">
        {proj.key === "MedAssessmentForm" && (
          <img src={figImg} alt="figma preview" className="fig-preview" />
        )}
        {proj.key === "MC_TRAILER" && (
          <video
            src={videoSrc}
            controls
            width="100%"
            style={{ marginTop: "1rem" }}
          />
        )}
        {code?.[proj.key]?.map((file, i) => (
          <div className="code-block" key={i}>
            <p className="code-header">// {file.name}</p>
            <pre>
              <code>{file.content}</code>
            </pre>
          </div>
        ))}
      </div>
      <a href={proj.download} className="download-link" download>
        ⇩ download({proj.name})
      </a>
    </div>
  );

  useEffect(() => {
    const handleKey = (e) => {
      if (expanded && e.key === "Escape") {
        setExpanded(false);
      } else if (!expanded && e.key === "ArrowDown") {
        setSelected((prev) => (prev + 1) % projectsMeta.length);
      } else if (!expanded && e.key === "ArrowUp") {
        setSelected(
          (prev) => (prev - 1 + projectsMeta.length) % projectsMeta.length
        );
      } else if (!expanded && e.key === "Enter") {
        setExpanded(true);
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [expanded]);

  if (!data) return <p className="loading-dots">loading projects...</p>;

  return (
    <div className="projects-menu">
      {!expanded ? (
        <>
          <h2>// select a project with ⬆ / ⬇ and press ⏎</h2>
          <ul className="menu-list">
            {projectsMeta.map((proj, i) => (
              <li
                key={proj.key}
                className={i === selected ? "menu-selected" : ""}
              >
                {i === selected ? "> " : "  "}
                {proj.name}()
                <span className="meta"> // {proj.description}</span>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <ProjectView proj={projectsMeta[selected]} code={data} />
      )}
    </div>
  );
}

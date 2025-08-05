import { useEffect } from "react";
import "./Info.css";

export default function Info({ setInputLocked }) {
  // Lock console history while Info is displayed
  useEffect(() => {
    if (setInputLocked) setInputLocked(true);
    return () => setInputLocked(false);
  }, [setInputLocked]);

  return (
    <div className="info-page">
      <h2>About This Site</h2>
      <p>
        This interactive portfolio is built with React and Vite. You navigate it
        by typing commands into a stylised console:
      </p>
      <ul>
        <li>
          <code>run(whoami)</code>: Learn who I am and my background.
        </li>
        <li>
          <code>render(Projects)</code>: Browse my projects menu.
        </li>
        <li>
          <code>contact()</code>: Get in touch via email or LinkedIn.
        </li>
        <li>
          <code>info()</code>: (you’re here!) See how this site works.
        </li>
        <li>
          <code>help()</code>: List all available commands.
        </li>
      </ul>
      <p>
        Under the hood, it uses:
        <br />• React hooks for state &amp; navigation • Plain CSS for glitch
        animations • Fetch to load project data from{" "}
        <code>all_project_code.json</code>• Netlify/Vercel for hosting
      </p>
      <p className="tip">
        // Tip: press <kbd>Esc</kbd> to exit any page and return to the console.
      </p>
      <p>
        The ampersand (&) originated from the Latin word et, meaning "and," as a
        shorthand ligature combining the letters 'e' and 't'. Used by scribes as
        early as the 1st century CE, it became standardized during the Middle
        Ages. Its name, "ampersand," evolved from the phrase "and per se and,"
        recited by students to denote '&' as its own character at the end of the
        alphabet. Today, the ampersand is fascinating both for its visual
        elegance and symbolic versatility, bridging language, typography,
        design, and digital culture, embodying connectivity, collaboration, and
        stylistic creativity.
      </p>
      <p>
        I chose the ampersand (&) as my personal branding because it reflects
        how I naturally approach design and coding. In programming, the
        ampersand connects ideas, references memory, and clarifies logical
        relationships—things I value in technical work. Visually, it's simple
        but versatile, representing the thoughtful, creative approach I aim for
        in design. Using '&' shows my interest in the intersection of coding &
        design, logic & creativity, and highlights my goal to keep learning how
        these areas come together.
      </p>
    </div>
  );
}

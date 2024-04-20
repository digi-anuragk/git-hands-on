import React, { useState } from "react";
import Admonition from "@theme/Admonition";
import MDXContent from "@theme/MDXContent";

const index = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div>
      <button
        className={"px-2 py-3 rounded-lg mb-4"}
        onClick={() => {
          setIsOpen((state) => !state);
        }}
      >
        {isOpen ? "Hide Solution" : "Show Solution"}
      </button>
      {isOpen && (
        <Admonition type="info" icon="😎" title="Solution">
          <MDXContent>{children}</MDXContent>
        </Admonition>
      )}
    </div>
  );
};

export default index;

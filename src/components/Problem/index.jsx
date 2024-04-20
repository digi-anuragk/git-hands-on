import React, { useState } from "react";
import Admonition from "@theme/Admonition";
import MDXContent from "@theme/MDXContent";

const index = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Admonition type="note" icon="🤔" title="Problem">
      <MDXContent>{children}</MDXContent>
    </Admonition>
  );
};

export default index;

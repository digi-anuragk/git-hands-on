import React from "react";
// Import the original mapper
import MDXComponents from "@theme-original/MDXComponents";
import Solution from "../components/Solution";
import Problem from "../components/Problem";
import Footgun from "../components/Footgun";
import Mermaid from '@theme/Mermaid';
export default {
  // Re-use the default mapping
  ...MDXComponents,
  // Map the "<Highlight>" tag to our Highlight component
  // `Highlight` will receive all props that were passed to `<Highlight>` in MDX
  Solution,
  Problem,
  Footgun,
  Mermaid,
};

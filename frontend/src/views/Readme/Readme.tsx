import React, {useState, useEffect} from 'react';
import { fetchReadme } from 'services/static';
import {remark} from 'remark';
import remarkPresetLintMarkdownStyleGuide from 'remark-preset-lint-markdown-style-guide';
import remarkParse from 'remark-parse';
import remarkMath from 'remark-math';
import remarkRehype from 'remark-rehype';
import rehypeMathjax from 'rehype-mathjax';
import rehypeReact from 'rehype-react';


const Readme: React.FC = () => {

  const [markdown, setMarkDown] = useState<string>("Loading…");
  const [content, setContent] = useState(<div>{markdown}</div>);

  useEffect(() => {
    fetchReadme()
    .then(setMarkDown)
    .catch((e) => {
      const msg = `**Could not fetch markdown content**. Error: ${e.toString()}`;
      const markdownExample = 
        "# Markdown test\n" +
        "\n" +
        "Paragraph 1\n" +
        "\n" +
        "Inline math $\\frac{a}{b}$\n" +
        "\n" +
        "Display math\n" +
        "\n" +
        "$$\n" +
        "\\frac{a}{b}\n" +
        "$$\n"
      console.log(msg);
      setMarkDown(msg + "\n\n" + markdownExample);
    });
  }, [setMarkDown]);

  useEffect(() => {
    remark()
      .use(remarkPresetLintMarkdownStyleGuide)
      .use(remarkParse)
      .use(remarkMath)
      .use(remarkRehype)
      .use(rehypeMathjax)
      .use(rehypeReact, {createElement: React.createElement})
      .process(markdown)
      .then((file) => {
        for (const msg of file.messages) {
          console.log(`Markdown linter: ${msg.name}: ${msg.message}`);
        }
        setContent(file.result)
      });
    }, [markdown, setContent]);

  return (
    <div className="markdown-input">
      {content}
    </div>
  );
};

export default Readme;

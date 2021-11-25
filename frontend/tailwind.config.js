module.exports = {
  // Purging the css will break the style for the markdown files that are 
  // displayed at compile time. See 
  // https://tailwindcss.com/docs/optimizing-for-production#safelisting-specific-classes 
  // and 
  // https://tailwindcss.com/docs/optimizing-for-production#transforming-content
  // for solutions
  purge: [],
  // purge: {
  //   content: [
  //     './src/**/*.{js,jsx,ts,tsx}',
  //     './public/index.html',
  //     '../static/*.md'],
  //   transform : {
  //     md: (content) => {
  //       return remark()
  //         .use(remarkParse)
  //         .use(remarkMath)
  //         .use(remarkRehype)
  //         .use(rehypeMathjax)
  //         .use(rehypeReact, {createElement: React.createElement})
  //         .process(content)
  //     }
  //   }
  // },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}

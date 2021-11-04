
Readme.html: Readme.md
	pandoc --toc --standalone --mathjax=https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js -f markdown -t html Readme.md -o Readme.html

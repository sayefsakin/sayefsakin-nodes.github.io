rm resume.html
cp ../../sayefsakin.github.io/sayefsakin.github.io/assets/data/resume.json .
cd ../../jsonresume-theme-sayef-academic/jsonresume-theme-sayef-academic/
sudo npm install -g .
cd ../../sayefsakin-nodes.github.io/public/
resumed render -t jsonresume-theme-sayef-academic -o resume.html
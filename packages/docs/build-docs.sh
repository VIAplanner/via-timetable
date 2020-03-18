rm -rf docs; 
mkdir docs; 
rm -rf ../../docs; 
vuepress build; 
cp -r ./docs ../..;
echo uoftcoursetools.tech > ../../docs/CNAME

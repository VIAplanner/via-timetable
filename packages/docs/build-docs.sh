# Clean old docs
rm -rf docs; 
mkdir docs; 
rm -rf ../../docs; 

# Build docs
vuepress build; 

# Build storybook and copy over to docs
npm run build:storybook --prefix ../app
rm ./docs/ui-components/index.html
cp -r ../app/storybook-static/* ./docs/ui-components

# Copy contents from built docs over to the serving directory
cp -r ./docs ../..;

# Add CNAME record
echo uoftcoursetools.tech > ../../docs/CNAME

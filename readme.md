To publish your package, create and push a new tag:
git tag v1.0.0
git push origin v1.0.0


To use your package in another project, you'll need to authenticate with GitLab's npm registry. In the project where you want to use this component, create a .npmrc file with:

@your-gitlab-username:registry=https://gitlab.com/api/v4/packages/npm/
//gitlab.com/api/v4/packages/npm/:_authToken=<your-gitlab-access-token>

Then you can install your package with:

npm install @your-gitlab-username/my-react-component
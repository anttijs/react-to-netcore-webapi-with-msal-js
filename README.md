# react-to-netcore-webapi-with-msal-js

The frontend is developed in Visual Studio Code using React functional components, hooks and TypeScript. For the UI, React-Bootstrap, React-Fontawesome and cogo-toast libraries are used.
Axios handles the webapi calls and React-router the routing.

react-aad-msal / Msal.js libraries are used to implement OAuth 2.0 / OpenID Connect standards to sign in to Azure B2C, 
from where jwt id and access tokens are obtained and used to gain access to the backend webapi.

Grid columns and form fields are dynamically created based on schema received from the backend. 
There is only one grid view and Add/Edit view for all three entity types. The views are customized by using the schema.

The backend is developed in Visual Studio 2019 using .Net Core 3 WebApi.
EntityFrameWork Core is used for object/relational mapping. 
EF Core code first approach generates the database creation scripts for SQL Server database.
AutoMapper handles mappings between dto and datamodel classes. 

The backend uses jwt token authentication to protect the delete endpoints. Other endpoints (get, put, post) are public for testing purposes.
The backend uses reflection and attributes to generate a schema describing the object properties.
The schema is passed to the frontend, which uses it to generate the UI.

Both frontend and backend are hosted in the same Microsoft Azure AppService. 
The database is an Azure Sql database. IIS has rewrite rules for SPA. 
Both frontend and backend are registered applications in Azure AD B2C.
The backend exposes an api and the frontend is granted access for the api.
Google is set up as an external identity provider or the user can sign up with a verified e-mail account.

Microsoft Devops is used for deploying the application to Azure.
GIT is used for version control. I have put the sources to GitHub. 
Check out the <a href="https://github.com/anttijs/react-to-netcore-webapi-with-msal-js" target="_blank" rel="noopener noreferrer">frontend</a> and 
the <a href="https://github.com/anttijs/schemagenerator-for-react" target="_blank" rel="noopener noreferrer">backend.</a>


This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

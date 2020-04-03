import React from 'react'
import Card from 'react-bootstrap/Card'
import CardDeck from 'react-bootstrap/CardDeck'
import imgAzure from './assets/azure.png'
import imgReact from './assets/react.png'
import imgNetCore from './assets/netcore.png'
const Home:React.FC = () => {
return (
<>
<br/>
<CardDeck>
  <Card>
  <Card.Img  variant="top" src={imgReact} />
    <Card.Body>
      <Card.Title>Frontend</Card.Title>
      <Card.Text>
      <p>
        The frontend is developed in Visual Studio Code using React functional components, hooks and TypeScript. For the UI, React-Bootstrap, React-Fontawesome and cogo-toast libraries are used.
        Axios handles the webapi calls and React-router the routing.
      </p>
      <p>
        react-aad-msal / Msal.js libraries are used to implement OAuth 2.0 / OpenID Connect standards to sign in to Azure B2C, 
        from where jwt id and access tokens are obtained and used to gain access to the backend webapi.
      </p>
      <p>
        Grid columns and form fields are dynamically created based on schema received from the backend. 
        There is only one grid view and Add/Edit view for all three entity types. The views are customized by using the schema.
      </p>
      </Card.Text>
    </Card.Body>
  </Card>
  <Card>
  <Card.Img  variant="top" src={imgNetCore} />
    <Card.Body>
      <Card.Title>Backend</Card.Title>
      <Card.Text>
        <p>
        The backend is developed in Visual Studio 2019 using .Net Core 3 WebApi.
        EntityFrameWork Core is used for object/relational mapping. 
        EF Core code first approach generates the database creation scripts for SQL Server database.
        AutoMapper handles mappings between dto and datamodel classes. 
      </p>
      <p>
        The backend uses jwt token authentication to protect the delete endpoints. Other endpoints (get, put, post) are public for testing purposes.
      </p>
      <p>
        Backend uses reflection and attributes to generate a schema describing the object properties.
        The schema is passed to the frontend, which uses it to generate the UI.
      </p>
      </Card.Text>
    </Card.Body>
  </Card>
  <Card>
  <Card.Img  variant="top" src={imgAzure} />
    <Card.Body>
      <Card.Title>Hosting</Card.Title>
      <Card.Text>
      <p>
        Both frontend and backend are hosted in the same Microsoft Azure AppService. 
        The database is an Azure Sql database. IIS has rewrite rules for SPA. 
      </p>
      <p>
        Both frontend and backend are registered applications in Azure AD B2C.
        The backend exposes an api and the frontend is granted access for the api.
        Google is set up as an external identity provider or the user can sign up with a verified e-mail account.
      </p>
      <p>
        Microsoft Devops is used for deploying the application to Azure.
        GIT is used for version control. I have put the sources to GitHub. 
        Check out the <a href="https://github.com/anttijs/react-to-netcore-webapi-with-msal-js" target="_blank" rel="noopener noreferrer">frontend</a> and 
        the <a href="https://github.com/anttijs/schemagenerator-for-react" target="_blank" rel="noopener noreferrer">backend.</a>
      </p>
      </Card.Text>
    </Card.Body>
  </Card>
</CardDeck>
</> 
)
}
export default Home


import { GraphQLClient, gql } from "graphql-request";
import React from "react";
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CardHeader from '@mui/material/CardHeader';
import credentials from "./credentials.json";

const Pinned_to_card = async () => {
  const name1 = credentials.name;
  const token = credentials.token;
  const list_length = credentials.list_length;
  const endpoint = "https://api.github.com/graphql";
  const graphQLClient = new GraphQLClient(endpoint, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });
  const query = gql`
  query{
    repositoryOwner(login: "${name1}") {
      ... on User {
        pinnedItems(first: ${list_length}) {
          edges {
            node {
              ... on Repository {
              name
              __typename
              description
                primaryLanguage{
                  name
                }resourcePath
              }... on Gist{
                name
                __typename
                description
                resourcePath
              }
            }
          }
        }
      }
    }
  }
`;
  var d = await graphQLClient.request(query); 
  var s=JSON.stringify(d, undefined, 2);
  var k=await parseToMui(s);
  return <div>{k}</div>;
}

const parseToMui = async(data) => {
  const obj = JSON.parse(data);
  const project_edges = obj.repositoryOwner.pinnedItems.edges;
  const projects = project_edges.map(project_edge => project_edge.node);
  const project_cards = projects.map(function(project){
    if(project.__typename=="Repository"){
      return <Card sx={{width: 400,height: 200}}>
        <CardHeader title={project.name} subheader={project.primaryLanguage.name}/>
        <CardContent>
          <Typography variant="body2" component="p">
            {project.description}
          </Typography>
        </CardContent>
        <CardActions>
      <Button size="small" color="primary" onClick={onClickUrl(project.resourcePath)}>Go to Repo</Button>
          </CardActions>
          </Card>
    }
    else if(project.__typename=="Gist"){
      return <Card sx={{ maxWidth: 345 }}>
        <CardHeader title={project.name}  />
        <CardContent>
          <Typography variant="body2" component="p">
            {project.description}
          </Typography>
        </CardContent>
        <CardActions>
      <Button size="small" color="primary" onClick={onClickUrl(project.resourcePath)}>Go to Gist</Button>
          </CardActions>
          </Card>
    }
  });
  
  return project_cards;
  
}

const openInNewTab = (url) => {
  const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
  if (newWindow) newWindow.opener = null
}

const onClickUrl = (url) => {
  return () => openInNewTab("https://github.com/"+url);
}




export default Pinned_to_card;

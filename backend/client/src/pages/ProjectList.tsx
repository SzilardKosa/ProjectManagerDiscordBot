import React from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';

import { Link, useLocation } from 'react-router-dom';
import useDataApi from 'use-data-api';

const useStyles = makeStyles({
  table: {
    minWidth: 400,
  },
  link: {
    textDecoration: 'none',
  },
  box: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

interface Project {
  _id: string;
  name: string;
  deadline: Date;
  status: string;
  groupDiscordId: string;
}

const ProjectList = () => {
  const classes = useStyles();
  const location = useLocation();
  const [{ data, isLoading, isError }] = useDataApi<Project[]>(location.pathname, []);

  const rows = data?.map((project) => (
    <TableRow key={project._id}>
      <TableCell>{project.name}</TableCell>
      <TableCell>{project.deadline}</TableCell>
      <TableCell>{project.status}</TableCell>
      <TableCell>{project.groupDiscordId}</TableCell>
      <TableCell align="right">
        <Link to={`/subtasks/${project.groupDiscordId}/${project.name}`} className={classes.link}>
          <Button variant="contained" color="primary">
            View subtasks
          </Button>
        </Link>
      </TableCell>
    </TableRow>
  ));

  let title: string;
  if (location.pathname === '/projects') {
    title = 'All projects';
  } else {
    title = `Projects in group[${location.pathname.split('/')[2]}]`;
  }

  return (
    <Container>
      <Box paddingBottom={3}>
        <Typography variant="h4">{title}</Typography>
      </Box>
      {isError && <div>Something went wrong ...</div>}
      {isLoading ? (
        <Box className={classes.box}>
          <CircularProgress color="secondary" />
        </Box>
      ) : (
        !isError && (
          <TableContainer component={Paper} className={classes.table}>
            <Table aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Project name</TableCell>
                  <TableCell>Deadline</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Group Discord Id</TableCell>
                  <TableCell align="right">Subtasks</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{rows}</TableBody>
            </Table>
          </TableContainer>
        )
      )}
    </Container>
  );
};

export default ProjectList;

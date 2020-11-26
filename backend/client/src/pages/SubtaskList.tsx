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
import CircularProgress from '@material-ui/core/CircularProgress';

import { useLocation } from 'react-router-dom';
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

interface Subtask {
  _id: string;
  name: string;
  deadline: Date;
  weight: number;
  status: number;
  groupDiscordId: string;
  projectName: string;
  ownerDiscordId: string;
}

const SubtaskList = () => {
  const classes = useStyles();
  const location = useLocation();
  const [{ data, isLoading, isError }] = useDataApi<Subtask[]>(location.pathname, []);

  const rows = data?.map((subtask) => (
    <TableRow key={subtask._id}>
      <TableCell>{subtask.name}</TableCell>
      <TableCell>{subtask.deadline}</TableCell>
      <TableCell align="center">{subtask.weight}</TableCell>
      <TableCell align="center">{subtask.status}</TableCell>
      <TableCell>{subtask.groupDiscordId}</TableCell>
      <TableCell>{subtask.projectName}</TableCell>
      <TableCell>{subtask.ownerDiscordId}</TableCell>
    </TableRow>
  ));

  let title: string;
  if (location.pathname === '/subtasks') {
    title = 'All subtasks';
  } else {
    title = `Subtasks in project[${location.pathname.split('/')[3]}] in group[${
      location.pathname.split('/')[2]
    }]`;
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
                  <TableCell>Name</TableCell>
                  <TableCell>Deadline</TableCell>
                  <TableCell align="center">Weight</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell>Group Id</TableCell>
                  <TableCell>Project name</TableCell>
                  <TableCell>Owner Id</TableCell>
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

export default SubtaskList;

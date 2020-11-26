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

interface Group {
  _id: string;
  discordId: string;
  serverDiscordId: string;
}

const GroupList = () => {
  const classes = useStyles();
  const location = useLocation();
  const [{ data, isLoading, isError }] = useDataApi<Group[]>(location.pathname, []);

  const rows = data?.map((group) => (
    <TableRow key={group._id}>
      <TableCell>{group.discordId}</TableCell>
      <TableCell>{group.serverDiscordId}</TableCell>
      <TableCell align="right">
        <Link to={`/projects/${group.discordId}`} className={classes.link}>
          <Button variant="contained" color="primary">
            View projects
          </Button>
        </Link>
      </TableCell>
      <TableCell align="right">
        <Link to={`/members/${group.discordId}`} className={classes.link}>
          <Button variant="contained" color="secondary">
            View members
          </Button>
        </Link>
      </TableCell>
      <TableCell align="right">
        <Link to={`/meetings/${group.discordId}`} className={classes.link}>
          <Button variant="contained">View meetings</Button>
        </Link>
      </TableCell>
    </TableRow>
  ));

  let title: string;
  if (location.pathname === '/groups') {
    title = 'All registered discord channels';
  } else {
    title = `Discord channels in server[${location.pathname.split('/')[2]}]`;
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
                  <TableCell>Channel Discord Id</TableCell>
                  <TableCell>Server Discord Id</TableCell>
                  <TableCell align="right">Projects</TableCell>
                  <TableCell align="right">Members</TableCell>
                  <TableCell align="right">Meetings</TableCell>
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

export default GroupList;

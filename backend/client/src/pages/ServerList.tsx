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

import { Link } from 'react-router-dom';
import useDataApi from 'use-data-api';

const useStyles = makeStyles({
  table: {
    minWidth: 200,
    maxWidth: 400,
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

interface Server {
  _id: string;
  discordId: string;
}

const ServerList = () => {
  const classes = useStyles();
  const [{ data, isLoading, isError }] = useDataApi<Server[]>('/servers', []);

  const rows = data?.map((server) => (
    <TableRow key={server._id}>
      <TableCell>{server.discordId}</TableCell>
      <TableCell align="right">
        <Link to={`/groups/${server.discordId}`} className={classes.link}>
          <Button variant="contained" color="secondary">
            View groups
          </Button>
        </Link>
      </TableCell>
    </TableRow>
  ));

  return (
    <Container>
      <Box paddingBottom={3}>
        <Typography variant="h4">All registered discord servers</Typography>
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
                  <TableCell>Discord Id</TableCell>
                  <TableCell align="right">Groups</TableCell>
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

export default ServerList;

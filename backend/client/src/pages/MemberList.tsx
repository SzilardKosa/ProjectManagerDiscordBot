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

interface Member {
  _id: string;
  discordId: string;
  groupDiscordId: string;
  userName: string;
}

const MemberList = () => {
  const classes = useStyles();
  const location = useLocation();
  const [{ data, isLoading, isError }] = useDataApi<Member[]>(location.pathname, []);

  const rows = data?.map((member) => (
    <TableRow key={member._id}>
      <TableCell>{member.discordId}</TableCell>
      <TableCell>{member.userName}</TableCell>
      <TableCell>{member.groupDiscordId}</TableCell>
    </TableRow>
  ));

  let title: string;
  if (location.pathname === '/members') {
    title = 'All members';
  } else {
    title = `Members in group[${location.pathname.split('/')[2]}]`;
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
                  <TableCell>Member Discord Id</TableCell>
                  <TableCell>Username</TableCell>
                  <TableCell>Group Discord Id</TableCell>
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

export default MemberList;

import React, { useEffect } from 'react';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import LaunchIcon from '@material-ui/icons/Launch';
import IconButton from '@material-ui/core/IconButton';
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import { connect } from 'react-redux';
import { NavLink, withRouter } from 'react-router-dom';
import { fetchPosts, updatePost } from '../actions';

// Credit to example in Material-UI table Section
// Modified the sample to fit my case.

// function createData(name, tag, owner, link) {
//   return {
//     name, tag, owner, link,
//   };
// }

// const rows = [
//   createData('Cupcake', '1', '2', '100'),
//   createData('Dupcake', '2', '1', '100'),
// ];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: 'favorite', alignRight: false, disablePadding: false, label: 'Fav', sortable: false,
  },
  {
    id: 'name', alignRight: false, disablePadding: true, label: 'Title', sortable: true,
  },
  {
    id: 'tag', alignRight: false, disablePadding: false, label: 'Tag', sortable: true,
  },
  {
    id: 'owner', alignRight: false, disablePadding: false, label: 'Owner', sortable: true,
  },
  {
    id: 'link', alignRight: false, disablePadding: false, label: 'Link', sortable: false,
  },
  {
    id: 'more', alignRight: true, disablePadding: false, label: 'More  ', sortable: false,
  },
];

function EnhancedTableHead(props) {
  const {
    classes, order, orderBy, onRequestSort,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.alignRight ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.sortable ? (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={headCell.sortable ? createSortHandler(headCell.id) : null}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <span className={classes.visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </span>
                ) : null}
              </TableSortLabel>
            ) : headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    {
      color: theme.palette.secondary.main,
      backgroundColor: lighten(theme.palette.secondary.light, 0.3),
    },
  title: {
    flex: '1 1 100%',
  },
}));

const EnhancedTableToolbar = () => {
  const classes = useToolbarStyles();

  return (
    <Toolbar>
      <Typography className={classes.title} variant="h5" id="tableTitle" component="div">
        Saved Webpages!
      </Typography>

    </Toolbar>
  );
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: '95%',
    margin: 'auto',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
}));

function DataTable(props) {
  const classes = useStyles();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('name');
  const [page, setPage] = React.useState(0);
  const [favCheck, setFav] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  // eslint-disable-next-line array-callback-return
  const rows = [];
  if (props.data.length !== 0) {
    props.data.forEach((d) => {
      const splitData = d.tags.split(',');

      // eslint-disable-next-line no-empty
      if (splitData[0] === 'true' && d.author.email !== props.email) {
        return;
      }

      if (!favCheck) {
        rows.push({
          name: d.title,
          tag: splitData[2],
          owner: d.author ? d.author.email : null,
          link: d.coverUrl,
          fav: splitData[0] === 'true',
          id: d.id,
          key: d.id,
        });
      } else if (splitData[1] === '1') {
        rows.push({
          name: d.title,
          tag: splitData[2],
          owner: d.author ? d.author.email : null,
          link: d.coverUrl,
          fav: splitData[0] === 'true',
          id: d.id,
          key: d.id,
        });
      }
    });
  }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleClick = (event, row) => {
    let newTag = '';
    if (!props.auth) {
      return;
    }
    newTag = `${!row.fav},0,${row.tag}`;
    props.updatePost({ tags: newTag, id: row.id }, true);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeFav = (event) => {
    setFav(event.target.checked);
  };

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  useEffect(() => {
    props.fetchPosts();
  }, []);

  return (
    <div className={classes.root}>
      <div className="switchContainer">
        <FormControlLabel
          control={<Switch checked={favCheck} onChange={handleChangeFav} />}
          label="Show Favorites"
        />
      </div>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size="medium"
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = row.fav;
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.id}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          onClick={(event) => handleClick(event, row)}
                          checked={isItemSelected}
                          inputProps={{ 'aria-labelledby': labelId }}
                          checkedIcon={<FavoriteIcon />}
                          icon={<FavoriteBorder />}
                        />
                      </TableCell>
                      <TableCell component="th" id={labelId} scope="row" padding="none">
                        {row.name}
                      </TableCell>
                      <TableCell align="left">{row.tag}</TableCell>
                      <TableCell align="left">{row.owner}</TableCell>
                      <TableCell align="left"><a href={row.link} target="_blank" rel="noreferrer">{row.link}</a></TableCell>
                      <TableCell align="right" padding="checkbox">
                        <IconButton>
                          <NavLink to={`/posts/${row.id}`}>
                            <LaunchIcon />
                          </NavLink>
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}

const mapStateToProps = (state) => (
  {
    data: state.posts.all,
    email: state.auth.email,
    auth: state.auth.authenticated,
  }
);

// react-redux glue -- outputs Container that know state in props
// also with an optional HOC withRouter
export default withRouter(connect(mapStateToProps, { fetchPosts, updatePost })(DataTable));

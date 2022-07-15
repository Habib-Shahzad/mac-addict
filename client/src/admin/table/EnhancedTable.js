import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@mui/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import { countryObj, provinceObj, cityObj, categoryObj, subCategoryObj, furtherSubCategoryObj, brandObj, productObj, colorObj, sizeObj, userObj, orderObj } from '../../db';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';
import { Typography } from '@mui/material';
import {
  useLocation,
} from "react-router-dom";
import { EnhancedTableHead, EnhancedTableToolbar, DeleteConfirmModal } from '../components'
import { useParams } from 'react-router';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import TableHead from '@mui/material/TableHead';
import Box from '@mui/material/Box';
// import { Row, Col, Container } from 'react-bootstrap';
import LinearProgress from '@mui/material/LinearProgress';
import './EnhancedTable.scss';

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

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

EnhancedTableToolbar.propTypes = {
  selected: PropTypes.array.isRequired,
};

const useStyles = makeStyles((theme) => ({
  alert: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
    marginBottom: 15
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
  img: {
    width: 200,
    paddingTop: 15,
    paddingBottom: 15
  },
  checkIcon: {
    color: 'green',
  },
  crossIcon: {
    color: 'red',
  },
}));



// function CollapsibleTable() {
//   return (
//     <TableContainer component={Paper}>
//       <Table aria-label="collapsible table">
//         <TableHead>
//           <TableRow>
//             <TableCell />
//             <TableCell>Dessert (100g serving)</TableCell>
//             <TableCell align="right">Calories</TableCell>
//             <TableCell align="right">Fat&nbsp;(g)</TableCell>
//             <TableCell align="right">Carbs&nbsp;(g)</TableCell>
//             <TableCell align="right">Protein&nbsp;(g)</TableCell>
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {rows.map((row) => (
//             <Row key={row.name} row={row} />
//           ))}
//         </TableBody>
//       </Table>
//     </TableContainer>
//   );
// }

export default function EnhancedTable(props) {
  const { model } = useParams();

  const location = useLocation();
  let tableFetch = {};


  if (model === 'country') tableFetch = countryObj;
  else if (model === 'province') tableFetch = provinceObj;
  else if (model === 'city') tableFetch = cityObj;
  else if (model === 'category') tableFetch = categoryObj;
  else if (model === 'sub-category') tableFetch = subCategoryObj;
  else if (model === 'further-sub-category') tableFetch = furtherSubCategoryObj;
  else if (model === 'brand') tableFetch = brandObj;
  else if (model === 'product') tableFetch = productObj;
  else if (model === 'color') tableFetch = colorObj;
  else if (model === 'size') tableFetch = sizeObj;
  else if (model === 'user') tableFetch = userObj;
  else if (model === 'order') tableFetch = orderObj;
  else tableFetch = {};

  const classes = useStyles();
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState(tableFetch['ordering']);
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [originalTableRows, setOriginalTableRows] = React.useState([]);
  const [tableRows, setTableRows] = React.useState([]);
  const [alertOpen, setAlertOpen] = React.useState(false);
  const [alertText, setAlertText] = React.useState('');
  const [loading, setLoading] = React.useState(true);

  const [open, setOpen] = React.useState([]);
  const [searchState, setSearchState] = React.useState('');

  useEffect(() => {
    try {
      if (location.state.content.data === 'success') {
        if (location.state.length === 1) {
          setAlertText('1 element has been deleted.');
        } else {
          setAlertText(`${location.state.length} elements have been deleted.`);
        }
        setAlertOpen(true);
        setTimeout(() => {
          setAlertOpen(false);
        }, 5000);
      }
    } catch (error) {

    }
  }, [location]);

  const apiURL = tableFetch.apiTable;
  const createTableData = tableFetch.createTableData;

  useEffect(() => {
    (
      async () => {
        // if (!reload) {
        setTableRows([]);
        setOriginalTableRows([]);
        setOpen([]);
        setLoading(true);
        setSelected([]);
        setPage(0);
        const rows = [];
        const response = await fetch(apiURL, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          withCredentials: true
        });
        const content = await response.json();

        content.data.forEach(element => {
          rows.push(createTableData(element));
        });
        setTimeout(() => {
          setTableRows(rows);
          setOriginalTableRows(rows);
          const openRows = new Array(rows.length).fill(false);
          setOpen(openRows);
          setLoading(false);
        }, 1000)
      })();
  }, [apiURL, createTableData]);

  const handleSetOpen = index => {
    const openRows = [...open];
    openRows[index] = !openRows[index];
    setOpen(openRows)
  }

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };


  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = tableRows.map((n) => n[tableFetch['checkboxSelection']]);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };
  const searchTableRows = event => {
    const { value } = event.target;
    setSearchState(value);
    const rows = originalTableRows.filter(obj => obj[`${tableFetch.searchField}`].toLowerCase().trim().includes(value.toLowerCase().trim()));
    setTableRows(rows);
    const openRows = new Array(rows.length).fill(false);
    setOpen(openRows);
  }

  const handleClick = (event, value) => {
    const selectedIndex = selected.indexOf(value);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, value);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (value) => selected.indexOf(value) !== -1;


  const [openModal, setOpenModal] = React.useState(false);
  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const [deleteLoading, setDeleteLoading] = React.useState(false);



  if (Object.keys(tableFetch).length === 0) {
    return <div>No data</div>;
  }

  const deleteAction = async (selected, setTableRows, setOriginalTableRows) => {
    let rows = [];
    const del_api = tableFetch.deleteApi;

    const response = await fetch(del_api, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      withCredentials: true,
      body: JSON.stringify({ data: selected })
    });
    const content = await response.json();
    content.data.forEach(element => {
      rows.push(tableFetch.createTableData(element));
    });
    setTableRows(rows);
    setOriginalTableRows(rows);
  }

  // console.log(tableFetch);
  const deleteObjects = async () => {
    setDeleteLoading(true);
    await deleteAction(selected, setTableRows, setOriginalTableRows);
    setDeleteLoading(false);
    handleCloseModal();
    setSelected([]);
  }

  return (
    <div id='data' className="table-admin">
      <DeleteConfirmModal
        loading={deleteLoading}
        open={openModal}
        handleClose={handleCloseModal}
        yesButtonPressed={deleteObjects}
      />
      {loading ? (
        <LinearProgress color="secondary" />
      ) : null}
      <div className={classes.alert}>
        <Collapse in={alertOpen}>
          <Alert
            action={
              <IconButton
                aria-label="close"
                color="inherit"
                size="small"
                onClick={() => {
                  setAlertOpen(false);
                }}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            }
          >
            {alertText}
          </Alert>
        </Collapse>
      </div>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar
          modelName={tableFetch.modelName}
          searchTableRows={searchTableRows}
          searchState={searchState}
          editAllowed={tableFetch.editAllowed}
          deleteAllowed={tableFetch.deleteAllowed}
          addAllowed={tableFetch.addAllowed}
          setOriginalTableRows={setOriginalTableRows}
          setTableRows={setTableRows}
          startAction={tableFetch.startAction}
          actionOptions={tableFetch.actionOptions}
          selected={selected}
          deleteObjects={handleOpenModal}
        />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={tableRows.length}
              headCells={tableFetch.headCells}
              tableType={tableFetch.type}
            />
            <TableBody>
              {stableSort(tableRows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row[tableFetch['checkboxSelection']]);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  const tableRow = [];
                  let order_data = null;

                  let c = 0;

                  for (const key in row) {
                    let textPosition = '';
                    if (tableFetch.rightAllign.includes(key)) textPosition = 'right';


                    if (key === 'order_data') {
                      order_data = row[key];
                    }

                    else if (key === '_id') {
                      tableRow.push(
                        <TableCell style={{ display: 'none' }} key={c}>{row[key]}</TableCell>
                      );
                    } else if (key === 'name') {
                      tableRow.push(
                        <TableCell key={c} component="th" id={labelId} scope="row" padding="none">
                          {row[key]}
                        </TableCell>
                      );
                    } else if (key === 'image') {
                      tableRow.push(
                        <TableCell key={c} component="th" id={labelId} scope="row" padding="none">
                          <img className={classes.img} src={row[key]} alt="Preview"></img>
                        </TableCell>
                      );
                    } else if (key === 'hexCode') {
                      tableRow.push(
                        <TableCell key={c} component="th" id={labelId} scope="row" padding="none">
                          <div style={{ backgroundColor: row[key] }} className="circle-db"></div>
                        </TableCell>
                      );
                    } else if (row[key] === false || row[key] === '') {
                      tableRow.push(
                        <TableCell key={c}><CloseIcon className={classes.crossIcon} color="secondary" /></TableCell>
                      );
                    } else if (row[key] === true) {
                      tableRow.push(
                        <TableCell key={c}><CheckIcon className={classes.checkIcon} color="primary" /></TableCell>
                      );
                    }
                    else if (key === "orderDate") {
                      var options_date = { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric' };
                      var date_order = new Date(row[key]).toLocaleDateString('en-GB', options_date);
                      tableRow.push(
                        <TableCell style={{ textAlign: textPosition }} key={c}>{date_order}</TableCell>
                      );
                    }

                    else {
                      tableRow.push(
                        <TableCell style={{ textAlign: textPosition }} key={c}>{row[key]}</TableCell>
                      );
                    }

                    if (key !== 'order_data') {
                      c += 1;
                    }
                  }

                  return (
                    <React.Fragment
                      key={row[tableFetch['checkboxSelection']]}
                    >
                      {
                        tableFetch.type !== 'collapse' ? (

                          <TableRow
                            hover
                            onClick={(event) => handleClick(event, row[tableFetch['checkboxSelection']])}
                            role="checkbox"
                            aria-checked={isItemSelected}
                            tabIndex={-1}
                            selected={isItemSelected}
                          >
                            <TableCell padding="checkbox">
                              <Checkbox
                                checked={isItemSelected}
                                inputProps={{ 'aria-labelledby': labelId }}
                              />
                            </TableCell>

                            {tableRow}
                          </TableRow>)
                          : (
                            <>
                              {
                                order_data !== null ? (
                                  <>
                                    <TableRow
                                      aria-checked={isItemSelected}
                                      tabIndex={-1}
                                      selected={isItemSelected}
                                    >
                                      <TableCell padding="checkbox">
                                        <Checkbox
                                          onClick={(event) => handleClick(event, row[tableFetch['checkboxSelection']])}
                                          checked={isItemSelected}
                                          inputProps={{ 'aria-labelledby': labelId }}
                                        />
                                      </TableCell>
                                      {tableRow}
                                      <TableCell>
                                        <IconButton aria-label="expand row" size="small" onClick={() => handleSetOpen(index)}>
                                          {open[index] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                        </IconButton>
                                      </TableCell>
                                    </TableRow>

                                    <TableRow>
                                      <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
                                        <Collapse in={open[index]} timeout="auto" unmountOnExit>
                                          <Box sx={{ margin: 1 }}>
                                            <Typography variant="h6" gutterBottom component="div">
                                              Order Items
                                            </Typography>

                                            <Table size="small" aria-label="purchases">
                                              <TableHead>
                                                <TableRow>
                                                  <TableCell>Name</TableCell>
                                                  <TableCell>Brand</TableCell>
                                                  <TableCell>Size</TableCell>
                                                  <TableCell>Color</TableCell>
                                                  <TableCell>Quantity</TableCell>
                                                  <TableCell>Total Price</TableCell>
                                                </TableRow>
                                              </TableHead>
                                              <TableBody>
                                                {order_data?.orderItems?.map((item, index) => (
                                                  <TableRow key={index}>
                                                    <TableCell component="th" scope="row">
                                                      {item.name}
                                                    </TableCell>

                                                    <TableCell component="th" scope="row">
                                                      {item.brand.name}
                                                    </TableCell>

                                                    <TableCell component="th" scope="row">
                                                      {item.size.name}
                                                    </TableCell>

                                                    <TableCell component="th" scope="row">
                                                      {item.color.name}
                                                    </TableCell>

                                                    <TableCell component="th" scope="row">
                                                      {item.quantity}
                                                    </TableCell>

                                                    <TableCell component="th" scope="row">
                                                      {item.price * item.quantity}
                                                    </TableCell>

                                                  </TableRow>
                                                ))}
                                              </TableBody>
                                            </Table>

                                            <Typography style={{ marginTop: '1rem' }} variant="h6" gutterBottom component="div">
                                              Delivery Address
                                            </Typography>

                                            <Typography variant="body2" gutterBottom>
                                              {order_data.deliveryAddress.firstName} {order_data.deliveryAddress.lastName}
                                            </Typography>
                                            <Typography variant="body2" gutterBottom>
                                              {order_data.customer.email1}
                                            </Typography>

                                            <Typography variant="body2" gutterBottom>
                                              {order_data.deliveryAddress.contactNumber}
                                            </Typography>

                                            <Typography variant="body2" gutterBottom>
                                              {order_data.deliveryAddress.addressLine1}
                                            </Typography>

                                            <Typography variant="body2" gutterBottom>
                                              {order_data.deliveryAddress.addressLine2}
                                            </Typography>


                                            <Typography variant="body2" gutterBottom>
                                              Landmark: {order_data.deliveryAddress.landmark ? order_data.deliveryAddress.landmark : '-'}
                                            </Typography>

                                            <Typography variant="body2" gutterBottom>
                                              {order_data.deliveryAddress.area}
                                            </Typography>


                                            <Typography variant="body2" gutterBottom>
                                              {order_data.deliveryAddress.city.name}, {order_data.deliveryAddress.city.province.name}, {order_data.deliveryAddress.city.province.country.name}
                                            </Typography>

                                          </Box>
                                        </Collapse>
                                      </TableCell>
                                    </TableRow>
                                  </>
                                ) :
                                  (
                                    null
                                  )
                              }
                            </>
                          )
                      }

                    </React.Fragment>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={tableRows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
}
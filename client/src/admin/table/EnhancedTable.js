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
import { countryObj, provinceObj, cityObj, areaObj, categoryObj, subCategoryObj, furtherSubCategoryObj, brandObj, productObj, colorObj, sizeObj } from '../../db';
import IconButton from '@mui/material/IconButton';
import Collapse from '@mui/material/Collapse';
// import Button from '@mui/material/Button';
import CloseIcon from '@mui/icons-material/Close';
import Alert from '@mui/lab/Alert';
import CheckIcon from '@mui/icons-material/Check';
import {
  useLocation,
} from "react-router-dom";
import { EnhancedTableHead, EnhancedTableToolbar } from '../components'
import { useParams } from 'react-router';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import TableHead from '@mui/material/TableHead';
import Box from '@mui/material/Box';
import { Row, Col, Container } from 'react-bootstrap';
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

export default function EnhancedTable(props) {
  const { model } = useParams();
  const location = useLocation();
  let tableFetch = {};
  if (model === 'country') tableFetch = countryObj;
  else if (model === 'province') tableFetch = provinceObj;
  else if (model === 'city') tableFetch = cityObj;
  else if (model === 'area') tableFetch = areaObj;
  else if (model === 'category') tableFetch = categoryObj;
  else if (model === 'sub-category') tableFetch = subCategoryObj;
  else if (model === 'further-sub-category') tableFetch = furtherSubCategoryObj;
  else if (model === 'brand') tableFetch = brandObj;
  else if (model === 'product') tableFetch = productObj;
  else if (model === 'color') tableFetch = colorObj;
  else if (model === 'size') tableFetch = sizeObj;

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

  // const history = useHistory();

  // history.listen((location, action) => {
  //   setTableRows([]);
  //   setOriginalTableRows([]);
  //   setOpen([]);
  //   setLoading(true);
  //   setSelected([]);
  // });

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
  return (
    <div id='data' className="table-admin">
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
          selected={selected} />
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
                  // const tableRow123 = [
                  //   <TableCell component="th" id={labelId} scope="row" padding="none">
                  //       {row.name}
                  //     </TableCell>,
                  //     <TableCell align="right">{row.calories}</TableCell>,
                  //     <TableCell align="right">{row.fat}</TableCell>,
                  //     <TableCell align="right">{row.carbs}</TableCell>,
                  //     <TableCell align="right">{row.protein}</TableCell>,
                  // ]
                  const tableRow = [];
                  let c = 0;
                  let recieptData = null;
                  for (const key in row) {
                    let textPosition = '';
                    if (tableFetch.rightAllign.includes(key)) textPosition = 'right';
                    if (key === '_id') {
                      tableRow.push(
                        <TableCell style={{ display: 'none' }} key={c}>{row[key]}</TableCell>
                      );
                    } else if (key === 'name') {
                      tableRow.push(
                        <TableCell key={c} component="th" id={labelId} scope="row" padding="none">
                          {row[key]}
                        </TableCell>
                      );
                    } else if (key === 'imagePath') {
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
                    } else if (typeof row[key] === "object") {
                      recieptData = row[key];
                    } else {
                      tableRow.push(
                        <TableCell style={{ textAlign: textPosition }} key={c}>{row[key]}</TableCell>
                      );
                    }
                    c += 1;
                  }
                  // console.log(recieptData.items);
                  const subTotalPrices = [];
                  if (tableFetch.type === 'collapse' && recieptData) {
                    var dateOptions = { year: 'numeric', month: 'short', day: 'numeric' };
                    var orderDate = new Date(recieptData.orderDate).toLocaleDateString('en-GB', dateOptions);
                    var orderRows = [];
                    let rowIndex = 1;
                    let discountPercentageNotBill = 0;
                    if (recieptData.discount) {
                      discountPercentageNotBill = recieptData.discount.discountPercentage;
                    }
                    for (const key in recieptData.items) {
                      if (Object.hasOwnProperty.call(recieptData.items, key)) {
                        const value = recieptData.items[key];
                        let discountedPriceHTML = <></>;
                        let subtotal = 0;
                        let classLine = '';
                        if (value.type === 'diy' && recieptData.discount && recieptData.discount.type === 'DIY') {
                          let newPrice = ((100 - discountPercentageNotBill) / 100) * value.item.price;
                          subtotal = newPrice * value.count
                          discountedPriceHTML = <><br /><span style={{ color: 'rgb(177, 0, 0)' }}>{newPrice}</span> ({discountPercentageNotBill}% off)</>
                          classLine = 'line-through';
                        } else if (value.type === 'product' && recieptData.discount && recieptData.discount.type === 'Product') {
                          const discObj = recieptData.discount.products.find(prod => value.item.name === prod.item.name);
                          // console.log(value)
                          if (discObj) {
                            console.log(discObj)
                            let newPrice = ((100 - discObj.discountPercentage) / 100) * value.item.price;
                            subtotal = newPrice * value.count
                            discountedPriceHTML = <><br /><span style={{ color: 'rgb(177, 0, 0)' }}>{newPrice}</span> ({discObj.discountPercentage}% off)</>
                            classLine = 'line-through';
                          } else subtotal = value.totalPrice;
                        } else subtotal = value.totalPrice;
                        subTotalPrices.push(subtotal);
                        let paraText = <TableCell className="reciept-table-cell table-cell-description">{value.item.description}
                        </TableCell>
                        if (value.type === 'diy') {
                          const flowers = value.item.flowers.map((element, index) => {
                            return element.name;
                          }).join(', ');
                          const addons = value.item.addons.map((element, index) => {
                            return element.name;
                          }).join(', ');
                          paraText = (
                            <TableCell className="reciept-table-cell table-cell-description text-capatalize margin-bottom-0">
                              <p><strong>Size: </strong>{value.item.size}</p>
                              <p><strong>Base: </strong>{value.item.base}</p>
                              <p><strong>Color: </strong>{value.item.color}</p>
                              <p><strong>Flowers: </strong>{flowers}</p>
                              {
                                value.item.addons.length === 0 ? (
                                  <p><strong>Addons: </strong>No Addons</p>
                                ) : (
                                  <p><strong>Addons: </strong>{addons}</p>
                                )
                              }
                            </TableCell>
                          )
                        }
                        orderRows.push(
                          <TableRow key={key}>
                            <TableCell className="reciept-table-cell table-cell-no" component="th" scope="row" align="right">
                              {rowIndex}
                            </TableCell>
                            <TableCell className="reciept-table-cell table-cell-name">{value.item.name}</TableCell>
                            {paraText}
                            <TableCell className="reciept-table-cell table-cell-price" align="right">
                              <span className={classLine}>{value.item.price}</span>{discountedPriceHTML}
                            </TableCell>
                            <TableCell className="reciept-table-cell table-cell-qty" align="right">{value.count}</TableCell>
                            <TableCell className="reciept-table-cell table-cell-total-price" align="right">{subtotal}</TableCell>
                          </TableRow>
                        )
                        rowIndex += 1;
                      }
                    }
                  }
                  const finalSubtotalPrice = subTotalPrices.reduce((a, b) => a + b, 0);
                  let discountPercentage = 0;
                  if (recieptData && recieptData.discount && recieptData.discount.type === 'Bill') {
                    discountPercentage = recieptData.discount.discountPercentage;
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
                          </TableRow>
                        ) : (
                          <>
                            {
                              recieptData !== null ? (
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
                                        <Box className="order-container">
                                          <Container>
                                            <Row className="justify-content-between">
                                              <Col md={4}>
                                                <p className="order-no">
                                                  Order No. {recieptData.orderNumber}
                                                </p>
                                                <p className="order-date">
                                                  Order Date: {orderDate}
                                                </p>
                                              </Col>
                                              <Col md={4}>
                                                <p className="order-no">
                                                  {recieptData.status}
                                                </p>
                                                <p className="order-date">
                                                  Payment method: {recieptData.paymentMethod}
                                                </p>
                                              </Col>
                                            </Row>
                                            <Row className="order-contact justify-content-between">
                                              <Col md={4}>
                                                <p>
                                                  {recieptData.firstName} {recieptData.lastName}
                                                </p>
                                                <p>
                                                  {recieptData.email}
                                                </p>
                                                <p>
                                                  {recieptData.phoneNumber}
                                                </p>
                                                <br />
                                                <p>
                                                  <strong>Delivery Date:</strong>
                                                </p>
                                                <p>
                                                  {recieptData.deliveryDate}
                                                </p>
                                              </Col>
                                              <Col md={4}>
                                                <p>
                                                  {recieptData.firstName1} {recieptData.lastName1}
                                                </p>
                                                <p>
                                                  {recieptData.email1}
                                                </p>
                                                <p>
                                                  {recieptData.phoneNumber1}
                                                </p>
                                                <p>
                                                  {recieptData.addressLine1}
                                                </p>
                                                <p>
                                                  {recieptData.addressLine2}
                                                </p>
                                                <p>
                                                  Near {recieptData.landmark}
                                                </p>
                                                <p>
                                                  {recieptData.area.name}
                                                </p>
                                              </Col>
                                            </Row>
                                            <Table size="small" aria-label="purchases">
                                              <TableHead>
                                                <TableRow>
                                                  <TableCell className="reciept-table-cell table-cell-no" align="right">No.</TableCell>
                                                  <TableCell className="reciept-table-cell table-cell-name">Name</TableCell>
                                                  <TableCell className="reciept-table-cell table-cell-description">Description</TableCell>
                                                  <TableCell className="reciept-table-cell table-cell-price" align="right">Price</TableCell>
                                                  <TableCell className="reciept-table-cell table-cell-qty" align="right">Quantity</TableCell>
                                                  <TableCell className="reciept-table-cell table-cell-total-price" align="right">Sub-Total</TableCell>
                                                </TableRow>
                                              </TableHead>
                                              <TableBody>
                                                {orderRows}
                                                <TableRow>
                                                  <TableCell rowSpan={4} />
                                                  <TableCell rowSpan={4} />
                                                  <TableCell rowSpan={4} />
                                                  <TableCell colSpan={2}>Sub-Total</TableCell>
                                                  <TableCell align="right">{finalSubtotalPrice}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                  <TableCell colSpan={2}>Discount (%)</TableCell>
                                                  <TableCell align="right">{discountPercentage}</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                  <TableCell colSpan={2}>Delivery Fee</TableCell>
                                                  <TableCell align="right">100</TableCell>
                                                </TableRow>
                                                <TableRow>
                                                  <TableCell colSpan={2}>Grand Total (PKR)</TableCell>
                                                  <TableCell align="right">{((((100 - discountPercentage) / 100) * finalSubtotalPrice) + 100)}</TableCell>
                                                </TableRow>
                                              </TableBody>
                                            </Table>
                                            <Row style={{ marginTop: '2rem' }}>
                                              <Col md={6}>
                                                <strong><p style={{ marginBottom: 0 }}>Message:</p></strong>
                                                <p>{recieptData.message}</p>
                                                <strong><p style={{ marginBottom: 0 }}>Call me incase of unavailable items:</p></strong>
                                                <p>{recieptData.callMe}</p>
                                              </Col>
                                            </Row>
                                          </Container>
                                        </Box>
                                      </Collapse>
                                    </TableCell>
                                  </TableRow>
                                </>
                              ) : null
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
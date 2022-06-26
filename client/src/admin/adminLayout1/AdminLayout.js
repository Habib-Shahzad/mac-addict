import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Drawer, AppBar, Toolbar, CssBaseline, Typography, Divider, IconButton, Menu, ListItemIcon, MenuItem } from '@mui/material';
import { makeStyles, useTheme } from '@mui/styles'
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MoreIcon from '@mui/icons-material/MoreVert';
import WebIcon from '@mui/icons-material/Web';
import LockIcon from '@mui/icons-material/Lock';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
// import AssignmentIcon from '@mui/icons-material/Assignment';
// import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
// import BlockIcon from '@mui/icons-material/Block';
// import BusinessIcon from '@mui/icons-material/Business';
import {
  // BrowserRouter as Router,
  Switch as RouterSwitch,
  Link,
} from "react-router-dom";
import api from '../../api';
import InvertColorsIcon from '@mui/icons-material/InvertColors';
import { StyledTreeItem } from '../components';
import TreeView from '@mui/lab/TreeView';
import DeleteIcon from '@mui/icons-material/Delete';
import Label from '@mui/icons-material/Label';
import InfoIcon from '@mui/icons-material/Info';
import ForumIcon from '@mui/icons-material/Forum';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import './AdminLayout.scss';

StyledTreeItem.propTypes = {
  bgColor: PropTypes.string,
  color: PropTypes.string,
  labelIcon: PropTypes.elementType.isRequired,
  labelInfo: PropTypes.string,
  labelText: PropTypes.string.isRequired,
};


const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  tree: {
    height: 264,
    flexGrow: 1,
    maxWidth: 400,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  title: {
    flexGrow: 1
  },
  listItemIcon: {
    //   minWidth: 40,
    paddingLeft: 10
  }
}));


function AdminLayout(props) {
  const classes = useStyles();
  const theme = useTheme();
  const [openDrawer, setOpenDrawer] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openMenu = Boolean(anchorEl);
  // let color = 'white';
  // if (!props.darkState) color = 'black';

  const handleThemeChange = async () => {
    // console.log(!props.darkState)
    props.setDarkState(!props.darkState);
    // console.log(props.darkState)
    // await fetch('http://localhost:4000/api/set-darktheme', {
    //   method: 'POST',
    //   headers: {'Content-Type': 'application/json'},
    //   credentials: 'include',
    //   withCredentials: true,
    //   body: JSON.stringify({darkState:!props.darkState})
    // }); 
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDrawerOpen = () => {
    setOpenDrawer(true);
  };

  const handleDrawerClose = () => {
    setOpenDrawer(false);
  };

  const handleLogout = async e => {
    // console.log(123);
    e.preventDefault();
    await fetch(`${api}/users/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      withCredentials: true,
    });
    props.user.setUserState(null);
  }

  return (
    // <ThemeProvider theme={darkTheme}>
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: openDrawer,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: openDrawer,
            })}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title} noWrap>
            MAC Addict Admin
          </Typography>
          {/* <Switch checked={props.darkState} onChange={handleThemeChange} /> */}
          <IconButton
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleThemeChange}
          >
            <InvertColorsIcon
            />
          </IconButton>
          <IconButton
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <MoreIcon />
          </IconButton>
          <Menu
            // className={classes.root}
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={openMenu}
            onClose={handleClose}
          >
            <MenuItem onClick={_ => window.location.pathname = '/'}>
              <ListItemIcon className={classes.listItemIcon}>
                <WebIcon fontSize="small" />
              </ListItemIcon>
              <Typography variant="body2">Go to website</Typography>
            </MenuItem>
            <MenuItem>
              <ListItemIcon className={classes.listItemIcon}>
                <LockIcon fontSize="small" />
              </ListItemIcon>
              <Typography variant="body2">Change password</Typography>
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon className={classes.listItemIcon}>
                <ExitToAppIcon fontSize="small" />
              </ListItemIcon>
              <Typography variant="body2">Logout</Typography>
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: openDrawer,
          [classes.drawerClose]: !openDrawer,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: openDrawer,
            [classes.drawerClose]: !openDrawer,
          }),
        }}
      >
        <div className={classes.toolbar}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </div>
        <Divider />
        <TreeView
          className={classes.tree}
          defaultExpanded={['3']}
          defaultCollapseIcon={<ArrowDropDownIcon />}
          defaultExpandIcon={<ArrowRightIcon />}
          defaultEndIcon={<div style={{ width: 24 }} />}
        >
          <Link to="/admin">
            <StyledTreeItem nodeId="1" labelText="Dashboard" labelIcon={DashboardIcon} />
          </Link>
          <Link>
            <StyledTreeItem nodeId="2" labelText="Trash" labelIcon={DeleteIcon} />
          </Link>
          <StyledTreeItem nodeId="3" labelText="Categories" labelIcon={Label}>
            <StyledTreeItem
              nodeId="5"
              labelText="Social"
              labelIcon={SupervisorAccountIcon}
              labelInfo="90"
              color="#1a73e8"
              bgColor="#e8f0fe"
            />
            <StyledTreeItem
              nodeId="6"
              labelText="Updates"
              labelIcon={InfoIcon}
              labelInfo="2,294"
              color="#e3742f"
              bgColor="#fcefe3"
            />
            <StyledTreeItem
              nodeId="7"
              labelText="Forums"
              labelIcon={ForumIcon}
              labelInfo="3,566"
              color="#a250f5"
              bgColor="#f3e8fd"
            />
            <StyledTreeItem
              nodeId="8"
              labelText="Promotions"
              labelIcon={LocalOfferIcon}
              labelInfo="733"
              color="#3c8039"
              bgColor="#e6f4ea"
            />
          </StyledTreeItem>
          <StyledTreeItem nodeId="4" labelText="History" labelIcon={Label} />
        </TreeView>
        {/* <List>
          <Link style={{ color: color, textDecoration: 'none' }} to={'/admin'}>
            <ListItem button key='Dashboard'>
              <ListItemIcon className={classes.listItemIcon}><DashboardIcon /></ListItemIcon>
              <ListItemText primary='Dashboard' />
            </ListItem>
          </Link>
          <Link style={{ color: color, textDecoration: 'none' }} to={'/admin/user'}>
            <ListItem button key='User'>
              <ListItemIcon className={classes.listItemIcon}><SupervisorAccountIcon /></ListItemIcon>
              <ListItemText primary='User' />
            </ListItem>
          </Link>
          <Link style={{ color: color, textDecoration: 'none' }} to={'/admin/order'}>
            <ListItem button key='Order'>
              <ListItemIcon className={classes.listItemIcon}><ReceiptIcon /></ListItemIcon>
              <ListItemText primary='Order' />
            </ListItem>
          </Link>
          <Link style={{ color: color, textDecoration: 'none' }} to={'/admin/discount'}>
            <ListItem button key='Discount'>
              <ListItemIcon className={classes.listItemIcon}><MoneyOffIcon /></ListItemIcon>
              <ListItemText primary='Discount' />
            </ListItem>
          </Link>
          <Link style={{ color: color, textDecoration: 'none' }} to={'/admin/product'}>
            <ListItem button key='product'>
              <ListItemIcon className={classes.listItemIcon}><LocalFloristIcon /></ListItemIcon>
              <ListItemText primary='Product' />
            </ListItem>
          </Link>
          <Link style={{ color: color, textDecoration: 'none' }} to={'/admin/addons'}>
            <ListItem button key='addons'>
              <ListItemIcon className={classes.listItemIcon}><PlusOneIcon /></ListItemIcon>
              <ListItemText primary='Addon' />
            </ListItem>
          </Link>
          <Link style={{ color: color, textDecoration: 'none' }} to={'/admin/colors'}>
            <ListItem button key='colors'>
              <ListItemIcon className={classes.listItemIcon}><ColorLensIcon /></ListItemIcon>
              <ListItemText primary='Color' />
            </ListItem>
          </Link>
          <Link style={{ color: color, textDecoration: 'none' }} to={'/admin/flowers'}>
            <ListItem button key='flowers'>
              <ListItemIcon className={classes.listItemIcon}><FilterVintageIcon /></ListItemIcon>
              <ListItemText primary='Flower' />
            </ListItem>
          </Link>
          <Link style={{ color: color, textDecoration: 'none' }} to={'/admin/sizes'}>
            <ListItem button key='sizes'>
              <ListItemIcon className={classes.listItemIcon}><HeightIcon /></ListItemIcon>
              <ListItemText primary='Size' />
            </ListItem>
          </Link>
          <Link style={{ color: color, textDecoration: 'none' }} to={'/admin/bases'}>
            <ListItem button key='bases'>
              <ListItemIcon className={classes.listItemIcon}><CheckBoxOutlineBlankIcon /></ListItemIcon>
              <ListItemText primary='Base' />
            </ListItem>
          </Link>
          <Link style={{ color: color, textDecoration: 'none' }} to={'/admin/areas'}>
            <ListItem button key='bases'>
              <ListItemIcon className={classes.listItemIcon}><LocationOnIcon /></ListItemIcon>
              <ListItemText primary='Area' />
            </ListItem>
          </Link>
        </List> */}
        <Divider />
        {/* <List>
            {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
              <ListItem button key={text}>
                <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            {['All mail', 'Trash', 'Spam'].map((text, index) => (
              <ListItem button key={text}>
                <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
                <ListItemText primary={text} />
              </ListItem>
            ))}
          </List> */}
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {/* <Router> */}
        {/* <TransitionGroup>
            <CSSTransition
              key={location.key}
              classNames="fade"
              timeout={300}
            > */}
        <RouterSwitch>
          {/* <Route path="/admin/orders" children={<OrdersTable />} /> */}
          {/* <Route path="/admin/:model/edit/:id" children={<AdminForm />} />
          <Route path="/admin/:model/add" children={<AdminForm />} />
          <Route path="/admin/:model/delete" children={<DeleteConfirmation />} /> */}
          {/* <Route path="/admin/:model" children={<EnhancedTable />} /> */}
        </RouterSwitch>
        {/* </CSSTransition>
          </TransitionGroup> */}
        {/* </Router> */}
      </main>
    </div>
    // </ThemeProvider>
  );
}

export default AdminLayout;
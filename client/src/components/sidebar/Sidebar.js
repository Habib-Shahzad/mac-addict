import React, { Component, Fragment } from "react";
import classNames from "classnames";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import './Sidebar.scss';

class Sidebar extends Component {
  constructor() {
    super();
    this.state = {
      activeTab: []
    };
    this.handleTabClick = this.handleTabClick.bind(this);
    this.handleBackdropClick = this.handleBackdropClick.bind(this);
    this.handleBackClick = this.handleBackClick.bind(this);
  }

  handleBackdropClick() {
    const { onToggle, onClose, persist } = this.props;

    onToggle(false);
    onClose && onClose();
    if (!persist) {
      setTimeout(() => {
        this.setState({ activeTab: [] });
      }, 501);
    }
  }

  handleTabClick(tabData) {
    if (!!tabData.disabled) {
      return;
    }
    const { onItemClick } = this.props;

    if (tabData.children) {
      let data = [...this.state.activeTab];
      data.push(tabData.id);
      this.setState({ activeTab: data });
    } else if (tabData.to) {
        this.handleBackdropClick();
    }
    onItemClick && onItemClick(tabData);
  }

  handleBackClick(tabData) {
    const { onBackClick } = this.props;

    if (tabData) {
      let data = [...this.state.activeTab];
      let index = data.findIndex(id => id === tabData.id);
      data.splice(index, 1);
      this.setState({ activeTab: data });
    } else {
      this.setState({ activeTab: [] });
    }
    onBackClick && onBackClick();
  }

  getParentHeight() {
    let parent = document.querySelector("#sidebar-parent");
    return parent ? parent.scrollHeight : "100vh";
  }

  renderSecondChildren(parent, list) {
    const { wrapperClassName } = this.props;
    const { activeTab } = this.state;

    return (
      <SidebarContent
        {...this.props}
        sidebarProps={{
          className: classNames("sidebar-main second", {
            show: activeTab.includes(list.id),
            [wrapperClassName]: wrapperClassName
          }),
          style: { height: this.getParentHeight() }
        }}
        headerContent={
          <Fragment>
            <div
              className="first-back-btn"
              onClick={() => this.handleBackClick()}
            >
              <AngleLeft />
              <span>{parent.name}</span>
            </div>
            <div
              className="second-back-btn"
              onClick={() => this.handleBackClick(list)}
            >
              <AngleLeft />
              <span>{list.name}</span>
            </div>
          </Fragment>
        }
        options={list.children}
        handleTabClick={this.handleTabClick}
      ></SidebarContent>
    );
  }

  renderFirstChildren(list) {
    const { wrapperClassName } = this.props;
    const { activeTab } = this.state;

    return (
      <SidebarContent
        {...this.props}
        sidebarProps={{
          className: classNames("sidebar-main second", {
            show: activeTab.includes(list.id),
            [wrapperClassName]: wrapperClassName
          }),
          style: { height: this.getParentHeight() }
        }}
        headerContent={
          <div
            className="first-back-btn"
            onClick={() => this.handleBackClick()}
          >
            <AngleLeft />
            <span>{list.name}</span>
          </div>
        }
        options={list.children}
        handleTabClick={this.handleTabClick}
      >
        {data => data.children && this.renderSecondChildren(list, data)}
      </SidebarContent>
    );
  }

  render() {
    const {
      open,
      wrapperClassName,
      headerClassName,
      header,
      options
    } = this.props;
    return (
      <div id="react-sidebar" className="slidebar">
        <div
          className={classNames("sidebar-backdrop", { show: open })}
          onClick={this.handleBackdropClick}
        ></div>
        <SidebarContent
          {...this.props}
          sidebarProps={{
            id: "sidebar-parent",
            className: classNames("sidebar-main", {
              show: open,
              [wrapperClassName]: wrapperClassName
            })
          }}
          headerContent={
            typeof header === "string" ? (
              <div
                className={`sidebar-header ${classNames({
                  [headerClassName]: headerClassName
                })}`}
              >
                {header}
              </div>
            ) : (
              <div
                className={classNames({
                  [headerClassName]: headerClassName
                })}
              >
                {header}
              </div>
            )
          }
          options={options}
          handleTabClick={this.handleTabClick}
          handleBackdropClick={this.handleBackdropClick}
        >
          {list => list.children && this.renderFirstChildren(list)}
        </SidebarContent>
      </div>
    );
  }
}

Sidebar.propTypes = {
  open: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  header: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.element,
    PropTypes.node
  ]),
  persist: PropTypes.bool,
  wrapperClassName: PropTypes.string,
  headerClassName: PropTypes.string,
  onClose: PropTypes.func,
  onItemClick: PropTypes.func,
  onBackClick: PropTypes.func
};

Sidebar.defaultProps = {
  persist: false
};

export default Sidebar;

const SidebarContent = props => {
  const {
    sidebarProps,
    headerContent,
    options,
    children,
    handleTabClick,
    handleBackdropClick
  } = props;
  return (
    <div {...sidebarProps}>
      <div className="sidebar-main-content">
        {headerContent}
        <div className="sidebar-body">
          {options.map((data, index) => {
            return (
              <Fragment key={index}>
                {!(!!data.hideBorder || index === 0) && (
                  <hr className="section-seprator" />
                )}
                {data.title && (
                  <div className="section-heading">
                    {data.titleIcon && data.titleIcon}
                    <span className={classNames({ text: data.titleIcon })}>
                      {data.title}
                    </span>
                  </div>
                )}
                <ul>
                  {data.content.map((list, index) => {
                    return (
                      <Fragment key={index}>
                        {list.to && !list.children && !list.disabled ? (
                          <Link onClick={handleBackdropClick} to={list.to}>
                            <li
                              className={classNames({
                                disabled: list.disabled
                              })}
                              onClick={() => handleTabClick(list)}
                            >
                              <span className="flex-align-center">
                                {list.icon && list.icon}
                                <span>{list.name}</span>
                              </span>
                              {children && list.children && <AngleRight />}
                            </li>
                          </Link>
                        ) : (
                          <li
                            className={classNames({ disabled: list.disabled })}
                            onClick={() => handleTabClick(list)}
                          >
                            <span className="flex-align-center">
                              {list.icon && list.icon}
                              <span>{list.name}</span>
                            </span>
                            {children && list.children && <AngleRight />}
                          </li>
                        )}
                        {children && children(list)}
                      </Fragment>
                    );
                  })}
                </ul>
              </Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const AngleRight = props => (
  <AiOutlineArrowRight />
);

const AngleLeft = props => (
  <AiOutlineArrowLeft className="margin-global-right-05" />
);

import React, {Component} from 'react';
import { Link } from 'react-router-dom';

class Navbar extends Component {
  handleClick = () => this.props.onClick(this.props.index)

  render() {
    return (
        <Link to={`/${this.props.name}`}>
          <li
            className={this.props.isActive ? 'active' : ''}
            onClick={this.handleClick}>
            {this.props.name}
          </li>
        </Link>
    );
  }
}

export default Navbar;
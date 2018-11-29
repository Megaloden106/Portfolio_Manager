import React from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import Input from './Text';
import Select from './Select';
import { getExchanges } from '../../../service/portfolio';
import styles from '../../../styles/Portfolio/Card/Form';

class Form extends React.Component {
  constructor(props) {
    super(props);
    const { prefill } = this.props;
    this.state = {
      name: prefill ? prefill.name : '',
      exchange: prefill ? prefill.exchange : 'Select an Exchange',
      type: prefill ? prefill.type : 'Select a Type',
      category: prefill ? prefill.category : 'Select a Category',
      exchanges: [],
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    getExchanges()
      .then(({ data }) => this.setState({
        exchanges: ['Select an Exchange'].concat(data.sort((a, b) => a.localeCompare(b))),
      })).catch(error => console.error(error));
  }

  handleChange(event) {
    this.setState({ [event.target.id.toLowerCase()]: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { handleSubmit, history } = this.props;
    handleSubmit(this.state, history);
  }

  render() {
    const {
      name,
      exchange,
      exchanges,
      type,
      category,
    } = this.state;
    const { form, handleCancel } = this.props;
    const types = ['Select a Type', 'Personal', 'Retirement', 'Education', 'Health'];
    const categories = ['Select a Category'];
    if (type === 'Personal') {
      categories.push('Personal');
    } else if (type === 'Retirement') {
      categories.push('Retirement');
    } else if (type === 'Education' || type === 'Health') {
      categories.push(...['Personal', 'Retirement', 'Other']);
    }
    const selects = [
      { id: 'Exchange', value: exchange, options: exchanges },
      { id: 'Type', value: type, options: types },
      { id: 'Category', value: category, options: categories },
    ];

    return (
      <form
        className={styles.form}
        onSubmit={this.handleSubmit}
      >
        <Input
          id="Name"
          styles={styles}
          value={name}
          handleChange={this.handleChange}
        />
        {selects.map(({ id, value, options }) => (
          <Select
            key={id}
            id={id}
            options={options}
            styles={styles}
            value={value}
            handleChange={this.handleChange}
          />
        ))}
        <div className={styles.button}>
          <input
            type="submit"
            value={form === 'add' ? 'Add' : 'Save'}
            className={styles.addButton}
            disabled={!name
              || exchange.includes('Select')
              || type.includes('Select')
              || category.includes('Select')
            }
          />
          <input
            type="button"
            value="Cancel"
            className={styles.cancelButton}
            onClick={handleCancel}
          />
        </div>
      </form>
    );
  }
}

export default withRouter(Form);

Form.propTypes = {
  form: PropTypes.string.isRequired,
  prefill: PropTypes.shape({
    exchange: PropTypes.string,
    exchange_id: PropTypes.number,
    id: PropTypes.number,
    name: PropTypes.string,
  }),
  history: PropTypes.shape({
    action: PropTypes.string.isRequired,
    block: PropTypes.func.isRequired,
    createHref: PropTypes.func.isRequired,
    go: PropTypes.func.isRequired,
    goBack: PropTypes.func.isRequired,
    goForward: PropTypes.func.isRequired,
    length: PropTypes.number.isRequired,
    listen: PropTypes.func.isRequired,
    location: PropTypes.shape({
      hash: PropTypes.string.isRequired,
      key: PropTypes.string.isRequired,
      pathname: PropTypes.string.isRequired,
      search: PropTypes.string.isRequired,
    }),
    push: PropTypes.func.isRequired,
    replace: PropTypes.func.isRequired,
  }).isRequired,
  handleSubmit: PropTypes.func.isRequired,
  handleCancel: PropTypes.func.isRequired,
};

Form.defaultProps = {
  prefill: null,
};
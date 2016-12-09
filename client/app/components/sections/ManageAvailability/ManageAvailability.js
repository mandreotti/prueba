import { Component, PropTypes } from 'react';
import r, { button, div } from 'r-dom';
import classNames from 'classnames';
import { t } from '../../../utils/i18n';
import SideWinder from '../../composites/SideWinder/SideWinder';
import ManageAvailabilityHeader from '../../composites/ManageAvailabilityHeader/ManageAvailabilityHeader';
import ManageAvailabilityCalendar from '../../composites/ManageAvailabilityCalendar/ManageAvailabilityCalendar';

import css from './ManageAvailability.css';

const CALENDAR_RENDERING_TIMEOUT = 100;

const SaveButton = (props) => button({
  className: classNames({
    [css.saveButton]: true,
    [css.saveButtonVisible]: props.isVisible,
  }),
  disabled: props.isDisabled,
  onClick: props.onClick,
}, t('web.listings.save_and_close_availability_editing'));

SaveButton.propTypes = {
  isVisible: PropTypes.bool.isRequired,
  isDisabled: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

class ManageAvailability extends Component {
  constructor(props) {
    super(props);
    this.state = { renderCalendar: false };

    this.clickHandler = this.clickHandler.bind(this);
  }

  componentWillMount() {
    this.props.calendar.onMonthChanged(this.props.calendar.initialMonth);
  }

  componentDidMount() {
    // react-dates calendar height is often calculated incorrectly in
    // Safari when the SideWinder is shown. Rendering it
    // asynchronously allows the calendar to calculate the height
    // properly.
    // See: https://github.com/airbnb/react-dates/issues/46
    window.setTimeout(() => {
      this.setState({ renderCalendar: true }); // eslint-disable-line react/no-set-state
    }, CALENDAR_RENDERING_TIMEOUT);

    document.getElementById(this.props.availability_link_id)
      .addEventListener('click', this.clickHandler);
  }

  componentWillUnmount() {
    document.getElementById(this.props.availability_link_id)
      .removeEventListener('click', this.clickHandler);
  }

  clickHandler(e) {
    e.preventDefault();
    this.props.onOpen();
  }

  render() {
    const showCalendar = this.props.winder.isOpen && this.state.renderCalendar;
    return div([
      r(SideWinder, this.props.winder, [
        div({ className: css.content }, [
          r(ManageAvailabilityHeader, this.props.header),
          showCalendar ? r(ManageAvailabilityCalendar, {
            ...this.props.calendar,
            extraClasses: css.calendar,
          }) : null,
          r(SaveButton, {
            isVisible: this.props.hasChanges,
            isDisabled: this.props.saveInProgress,
            onClick: this.props.onSave,
          }),
        ]),
      ]),
    ]);
  }
}

ManageAvailability.propTypes = {
  availability_link_id: PropTypes.string.isRequired,
  hasChanges: PropTypes.bool.isRequired,
  saveInProgress: PropTypes.bool.isRequired,
  onOpen: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  winder: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  header: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  calendar: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
};

export default ManageAvailability;

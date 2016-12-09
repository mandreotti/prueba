import { PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import r from 'r-dom';
import ManageAvailability from './ManageAvailability';
import * as availabilityReducer from '../../../reducers/ManageAvailabilityReducer';
import * as ManageAvailabilityActions from '../../../actions/ManageAvailabilityActions';
import * as cssVariables from '../../../assets/styles/variables';

const ManageAvailabilityContainer = ({
  availability_link,
  header,
  actions,
  isOpen,
  visibleMonth,
  hasChanges,
  reservedDays,
  blockedDays,
}) =>
      r(ManageAvailability, {
        hasChanges,
        onOpen: actions.openEditView,
        onSave: actions.saveChanges,
        winder: {
          wrapper: document.querySelector('#sidewinder-wrapper'),
          width: cssVariables['--ManageAvailability_width'],
          isOpen,
          onClose: actions.closeEditView,
        },
        availability_link,
        header,
        calendar: {
          initialMonth: visibleMonth,
          blockedDays,
          reservedDays,
          onDayAllowed: actions.allowDay,
          onDayBlocked: actions.blockDay,
          onMonthChanged: actions.changeMonth,
        },
      });

const { arrayOf, bool, func, object, shape } = PropTypes;

/* eslint-disable react/forbid-prop-types */

ManageAvailabilityContainer.propTypes = {
  // from ManageAvailabilityApp
  availability_link: object,
  header: object.isRequired,

  // actions
  actions: shape({
    openEditView: func.isRequired,
    saveChanges: func.isRequired,
    closeEditView: func.isRequired,
    allowDay: func.isRequired,
    blockDay: func.isRequired,
    changeMonth: func.isRequired,
  }).isRequired,

  // from mapStateToProps
  isOpen: bool.isRequired,
  visibleMonth: object.isRequired,
  hasChanges: bool.isRequired,
  reservedDays: arrayOf(object).isRequired,
  blockedDays: arrayOf(object).isRequired,
};

/* eslint-enable react/forbid-prop-types */

const mapStateToProps = ({ manageAvailability }) => ({
  isOpen: manageAvailability.get('isOpen'),
  visibleMonth: manageAvailability.get('visibleMonth'),
  hasChanges: availabilityReducer.hasChanges(manageAvailability),
  reservedDays: manageAvailability.get('reservedDays').toJS(),
  blockedDays: availabilityReducer.blockedDays(manageAvailability).toJS(),
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(ManageAvailabilityActions, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ManageAvailabilityContainer);

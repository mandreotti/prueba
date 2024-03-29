/* eslint-disable react/no-set-state, no-console, no-alert */

import { Component } from 'react';
import r from 'r-dom';
import moment from 'moment';
import { isSameDay } from 'react-dates';
import withProps from '../../Styleguide/withProps';
import ManageAvailability from './ManageAvailability';
import * as cssVariables from '../../../assets/styles/variables';

const IS_OPEN_INITIALLY = false;
const MOMENTJS_LOCALE = 'en';
const now = Date.now();
const day1 = moment(now + 24 * 60 * 60 * 1000);
const day2 = moment(now + 2 * 24 * 60 * 60 * 1000);

const { storiesOf } = storybookFacade;

class ManageAvailabilityWrapper extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visibleMonth: moment().startOf('month'),
      blockedDays: [],
      reservedDays: [day1, day2],
      isOpen: IS_OPEN_INITIALLY,
      hasChanges: false,
    };

    // Set the Moment.js locale globally for react-dates to apply i18n
    // to react-dates.
    moment.locale(MOMENTJS_LOCALE);
  }
  render() {

    const allow = (d) => {
      this.setState({
        blockedDays: this.state.blockedDays.filter((day) => !isSameDay(d, day)),
        hasChanges: true,
      });
    };

    const block = (d) => {
      this.setState({
        blockedDays: this.state.blockedDays.concat(d),
        hasChanges: true,
      });
    };

    return r(ManageAvailability, {
      onOpen: () => {
        this.setState({ isOpen: true });
      },
      hasChanges: this.state.hasChanges,
      onSave: () => {
        console.log('Saving availability changes');
        this.setState({ hasChanges: false, isOpen: false });
      },
      winder: {
        wrapper: document.querySelector('#root'),
        isOpen: this.state.isOpen,
        width: cssVariables['--ManageAvailability_width'],
        onClose: () => {
          if (!this.state.hasChanges) {
            console.log('No availability changes to save');
            this.setState({ isOpen: false });
          } else if (confirm('You have unsaved changes, close anyways?')) {
            console.log('Closing with availability changes');
            this.setState({ hasChanges: false, isOpen: false });
          } else {
            console.log('Continue editing availability changes');
          }
        },
      },
      header: {
        backgroundColor: '347F9D',
        imageUrl: 'https://placehold.it/1024x1024',
        title: `Pelago San Sebastian, in very good condition in Kallio${this.state.hasChanges ? '*' : ''}`,
        height: cssVariables['--ManageAvailabilityHeader_height'],
      },
      calendar: {
        initialMonth: this.state.visibleMonth,
        blockedDays: this.state.blockedDays,
        reservedDays: this.state.reservedDays,
        onDayAllowed: allow,
        onDayBlocked: block,
        onMonthChanged: (m) => {
          this.setState({ visibleMonth: m });
        },
      },
    });
  }
}

storiesOf('Availability')
  .add('ManageAvailability', () =>
       withProps(ManageAvailabilityWrapper, {}));

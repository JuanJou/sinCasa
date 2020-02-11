/* TODO: REFACTOR */
import React, {Component} from 'react';
import {View, Text, TimePickerAndroid, StyleSheet} from 'react-native';
import DateService from '../services/date';
import TimeStamp from './Time';
import {
  AlertsService,
  Clock,
  MessagesService,
  ToasterService,
} from '../../shared';
import AttendanceService from '../services/attendance';
import {PropTypes} from 'prop-types';
import {TouchableHighlight} from 'react-native-gesture-handler';
export default class Assistance extends Component {
  dateService;
  attendanceService;
  alertService;
  messageService;
  toasterService;

  constructor(props) {
    super(props);
    this.dateService = DateService.getInstance();
    this.attendanceService = AttendanceService.getInstance();
    this.alertService = AlertsService.getInstance();
    this.messageService = MessagesService.getInstance();
    this.toasterService = ToasterService.getInstance();
    this.state = {
      endTime: null,
      startTime: null,
    };
  }

  render() {
    return (
      <View style={style.assistance}>
        <Text style={[style.titleText]}>¿Cuándo vas a asistir?</Text>
        <View style={style.timePicker}>
          <View style={style.timeStamps}>
            <Clock onPress={this.openTimePicker('startTime')}>
              <Text style={[style.robotoRegular, style.marginBottom]}>
                Desde
              </Text>
            </Clock>
            <TimeStamp
              titleText="Desde"
              date={this.state.startTime?.toLocaleDateString()}
              time={this.state.startTime?.toLocaleTimeString()}></TimeStamp>
          </View>
          <View style={style.timeStamps}>
            <Clock
              onPress={this.openTimePicker('endTime')}
              disabled={this.state.startTime === null}>
              <Text style={[style.robotoRegular, style.marginBottom]}>
                Hasta
              </Text>
            </Clock>
            <TimeStamp
              titleText="Hasta"
              date={this.state.endTime?.toLocaleDateString()}
              time={this.state.endTime?.toLocaleTimeString()}></TimeStamp>
          </View>
        </View>
        <TouchableHighlight
          style={
            this.shouldDisableButton
              ? [style.registerButton, style.disabled]
              : style.registerButton
          }
          onPress={this.registerAssistance}
          disabled={this.shouldDisableButton}>
          <Text style={style.registerButtonText}>Registrar</Text>
        </TouchableHighlight>
      </View>
    );
  }

  get shouldDisableButton() {
    return !this.state.startTime || !this.state.endTime;
  }

  registerAssistance = async () => {
    this.alertService.showConfirmationDialog(
      'Registrar asistencia',
      this.getAlertMessage(),
      async () =>
        this.attendanceService
          .registerAttendance(
            this.props.item.id,
            this.state.startTime,
            this.state.endTime,
          )
          .then(() =>
            this.toasterService.showToaster('Asistencia registrada con exito'),
          ),
    );
  };

  getAlertMessage = () => {
    return this.messageService.getRegistrationMessage(
      this.props.item.name,
      this.state.startTime,
      this.state.endTime,
    );
  };

  openTimePicker = openClock => time => {
    if (time.action !== TimePickerAndroid.dismissedAction)
      this.setState(previousState => {
        return {
          [openClock]: this.dateService.validateTime(
            openClock,
            previousState.startTime,
            time,
          ),
        };
      });
  };
}

Assistance.propTypes = {
  item: PropTypes.object,
};

const style = StyleSheet.create({
  assistance: {
    flex: 1,
    justifyContent: 'space-evenly',
  },
  disabled: {
    opacity: 0.5,
  },
  marginBottom: {
    marginBottom: 5,
  },
  registerButton: {
    alignSelf: 'center',
    backgroundColor: '#3378e0',
    borderRadius: 8,
    paddingBottom: 16,
    paddingLeft: 64,
    paddingRight: 64,
    paddingTop: 16,
  },
  registerButtonText: {
    color: 'white',
    fontFamily: 'Roboto-Regular',
    fontSize: 16,
  },
  robotoRegular: {
    fontFamily: 'Roboto-Regular',
  },
  timePicker: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  timeStamps: {
    alignItems: 'center',
    flex: 1,
  },
  titleText: {
    fontFamily: 'Roboto-Light',
    fontSize: 32,
    marginBottom: 15,
    textAlign: 'center',
  },
});

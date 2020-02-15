import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { compose, withSafeAreaView, withHeader, Loader } from '../../components';
import axios from 'axios';
import { SCHEDULE_URL } from '../../config/properties';

const ScheduleScreen = () => {
  const [ scheduleLoading, setScheduleLoading ] = useState(true);
  const [ schedule, setSchedule ] = useState([]);

  const _getSchedule = async () => {
    try {
      const response = await axios.get(SCHEDULE_URL);

      console.log(response.data);
      setScheduleLoading(false);
    } catch (err) {
      setScheduleLoading(false);
      console.log(err);
    }
  };

  useEffect(
    () => {
      _getSchedule();
    },
    [ scheduleLoading ]
  );

  if (scheduleLoading) {
    return <Loader />;
  }

  return (
    <View>
      <Text>Schedule</Text>
    </View>
  );
};

export default compose(withSafeAreaView, withHeader)(ScheduleScreen);

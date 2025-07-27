import React, { useState } from 'react';
import { View, Text, Modal, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Calendar } from 'react-native-calendars';

const CalendarModal = ({ visible, onClose, onSave }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const timeSlots = [
    '7:00 AM - 8:30 AM',
    '9:00 AM - 11:30 AM',
    '12:00 PM - 1:30 PM',
    '2:00 PM - 3:30 PM',
    '4:00 PM - 5:30 PM',
    '6:00 PM - 7:30 PM',
    '8:00 PM - 9:30 PM',
  ];

  const handleSave = () => {
    if (selectedDate && selectedTime) {
      const [startTime, endTime] = selectedTime.split(' - ');

      // Combine date and time into valid ISO datetime strings

      const buildDate = (dateStr, timeStr) => {
      const [hours, minutesPart] = timeStr.split(':');
      const [minutes, meridian] = minutesPart.split(' ');

      let h = parseInt(hours, 10);
      const m = parseInt(minutes, 10);

      if (meridian === 'PM' && h !== 12) h += 12;
      if (meridian === 'AM' && h === 12) h = 0;

      const [year, month, day] = dateStr.split('-'); // example: 2025-07-22
      return new Date(year, month - 1, day, h, m); // local time (no UTC)
    };

    const startDateObj = buildDate(selectedDate, startTime);
    const endDateObj = buildDate(selectedDate, endTime);

    // ⚠️ Send local datetime string, NOT UTC
    onSave(startDateObj.toString(), endDateObj.toString());
          }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <Calendar
            onDayPress={(day) => {
              setSelectedDate(day.dateString);
              setSelectedTime(''); // reset time if switching date
            }}
            markedDates={{
              [selectedDate]: { selected: true, selectedColor: '#add8e6' },
              '2025-05-27': { marked: true, dotColor: '#90ee90' },
              '2025-05-22': { marked: true, dotColor: '#f08080' },
            }}
          />

          <View style={styles.legend}>
            <Text style={styles.legendBoxLightBlue}>Current Date</Text>
            <Text style={styles.legendBoxLightGreen}>Available</Text>
            <Text style={styles.legendBoxLightRed}>Fully Reserved</Text>
          </View>

          {selectedDate ? (
            <>
              <Text style={styles.slotTitle}>Available Time Slots</Text>
              <ScrollView style={{ maxHeight: 200 }}>
                {timeSlots.map((slot) => (
                  <TouchableOpacity
                    key={slot}
                    style={[styles.slot, selectedTime === slot && styles.slotSelected]}
                    onPress={() => setSelectedTime(slot)}
                  >
                    <Text style={styles.slotText}>{slot}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </>
          ) : (
            <Text style={{ fontStyle: 'italic', color: '#555', marginTop: 10 }}>
              Select a date to view time slots.
            </Text>
          )}

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={{ color: '#fff' }}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={{ color: '#fff' }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const boxStyle = {
  paddingHorizontal: 10,
  paddingVertical: 4,
  borderRadius: 6,
  marginHorizontal: 5,
  fontSize: 12,
  color: '#fff',
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: '#00000099',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
  },
  legend: {
    flexDirection: 'row',
    marginVertical: 10,
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  legendBoxLightBlue: {
    backgroundColor: '#add8e6',
    ...boxStyle,
  },
  legendBoxLightGreen: {
    backgroundColor: '#90ee90',
    ...boxStyle,
  },
  legendBoxLightRed: {
    backgroundColor: '#f08080',
    ...boxStyle,
  },
  slotTitle: {
    fontWeight: 'bold',
    marginVertical: 10,
  },
  slot: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginVertical: 4,
    backgroundColor: '#eee',
    borderRadius: 6,
    alignItems: 'center',
  },
  slotSelected: {
    backgroundColor: '#f8c200',
  },
  slotText: {
    fontSize: 14,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 15,
    gap: 10,
  },
  saveBtn: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
  },
  cancelBtn: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 8,
  },
});

export default CalendarModal;

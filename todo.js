import React from 'react';
import { List, IconButton, TouchableOpacity } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';

function Todo({ id, title, complete, onDelete }) {
  async function toggleComplete() {
    await firestore()
      .collection('todos')
      .doc(id)
      .update({
        complete: !complete,
      });
  }

  return (
    <List.Item
      title={title}
      onPress={() => toggleComplete()}
      left={(props) => (
        <List.Icon {...props} icon={complete ? 'check' : 'cancel'} />
      )}
      right={() => (
        <IconButton
          icon="delete"
          onPress={() => onDelete(id)}
        />
      )}
    />
  );
}

export default Todo;

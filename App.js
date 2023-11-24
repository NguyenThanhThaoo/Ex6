import React from 'react';
import firestore from '@react-native-firebase/firestore';
import { FlatList, View, ScrollView, Text } from 'react-native';
import { Appbar, TextInput, Button } from 'react-native-paper';
import Todo from './todo'
function App() {
  const [todo, setTodo] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [todos, setTodos] = React.useState([]);
  const ref = firestore().collection('todos');
  async function addTodo() {
    await ref.add({
      title: todo,
      complete: false,
    });
    setTodo('');
    loadData();
  }
  async function loadData() {
    const querySnapshot = await ref.get();
    const list = [];
    querySnapshot.forEach(doc => {
      const { title, complete } = doc.data();
      list.push({
        id: doc.id,
        title,
        complete,
      });
    });
    setTodos(list);
  }
  async function Delete(id){
    await ref.doc(id).delete();
    loadData();
  }

  // mục đích useEffect để quản lý vòng đời của của một component voi react-hood
  React.useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await ref.get();
      const list = [];
      querySnapshot.forEach(doc => {
        const { title, complete } = doc.data();
        list.push({
          id: doc.id,
          title,
          complete,
        });
      });
    
      setTodos(list);
      if (loading) {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  if (loading) {
    return null; // or a spinner
  }
  return (
    <View style={{ flex: 1 }}>
     
    <Appbar>
        <Appbar.Content title={'TODOs List'} />
      </Appbar>
      <FlatList
        style={{ flex: 1 }}
        data={todos}
        keyExtractor={(item) => item.id}
        // renderItem={({ item }) => <Todo {...item} />}
        renderItem={({ item }) => <Todo {...item} onDelete={() => Delete(item.id)} />}
      />
      <TextInput label={'New Todo'} value={todo} onChangeText={(text) => setTodo(
        text)} />
      <Button onPress={addTodo}>Add TODO</Button> 
    </View>
  );
}
export default App;


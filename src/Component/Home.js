import React from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native';
import firebase from 'react-native-firebase';
const appConfig = {
  apiKey: 'AIzaSyA8oJZYWb2E99eCWugvH92VqaJU4Kqw8_8',
  clientId:
    '307682658570-64g3irkfpku66pfo4u0kqasg47ce89fb.apps.googleusercontent.com',
  appId: '1:307682658570:ios:9dc247bb9e409e13',
  databaseURL: 'https://reactnativefirebase-f3367.firebaseio.com',
  storageBucket: 'reactnativefirebase-f3367.appspot.com',
  messagingSenderId: '307682658570',
  projectId: 'reactnativefirebase-f3367'
};
firebase.initializeApp(appConfig);
export default class Home extends React.Component {
  constructor() {
    super();
    this.state = {
      task: '',
      tasks: [],
      loading: false
    };
    this.ref = firebase.database().ref('Tasks');
  }
  componentDidMount() {
    // lắng nghe tất cả các sự kiện database thay đổi
    this.ref.on('value', childSnapShot => {
      const tasks = [];
      childSnapShot.forEach(element => {
        tasks.push({
          key: element.key,
          task: element.toJSON().task
        });
        this.setState({
          tasks: tasks,
          loading: false
        });
      });
    });
  }

  addTask = () => {
    if (this.state.task.trim() === '') {
      Alert.alert('Ban chua dien thong tin task');
      return;
    }
    this.ref.push({
      task: this.state.task
    });
  };
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <TextInput
          style={style.input}
          onChangeText={text => {
            this.setState({ task: text });
          }}
          value={this.state.task}
          placeholder="task"
        />
        <TouchableOpacity
          style={[style.button, { backgroundColor: 'red' }]}
          onPress={this.addTask}
        >
          <Text>Add Task</Text>
        </TouchableOpacity>

        <FlatList
          style={{ flex: 1, marginTop: 20 }}
          data={this.state.tasks}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item, index }) => (
            <View style={{ flexDirection: 'row' }}>
              <Text style={{ fontSize: 20, fontWeight: 'bold' }}>
                {item.task}
              </Text>
            </View>
          )}
        />
      </View>
    );
  }
}
const style = StyleSheet.create({
  button: {
    marginTop: 10,
    height: 30,
    width: 100,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  input: {
    height: 30,
    width: 300,
    backgroundColor: 'transparent',
    marginTop: 10,
    borderWidth: 1
  }
});

import React, { useState, useEffect, useContext, useCallback } from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Button,
  Alert,
  Modal,
  Dimensions,
  TouchableWithoutFeedback
} from 'react-native';

import {
  Card,
  Title,
  Paragraph
} from 'react-native-paper';

import { useFocusEffect } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import moment from 'moment';
import API from '../../API';
import SessionContext from '../../components/SessionContext';

export default function HomeScreen() {

  const { session: { user: { _id } } } = useContext(SessionContext);

  const [state, updateState] = useState({
    posts: [],
    likes: '',
    requests: '',

    confirmRequest: false,
    reqPost: ''
  });

  function setState(nextState) {
    updateState(prevState => ({
      ...prevState,
      ...nextState
    }))
  }

  const [refreshing, setRefreshing] = useState(false);

  function handleLike(post_id) {
    let like = state.likes;
    like[post_id] = true;
    setState({ likes: like });

    let reqBody = {
      _User: _id,
      _Blog: post_id
    }

    API.post(`like`, reqBody)
      .then(res => {
        const success = res.data.success;
        if (!success) {
          let like = state.likes;
          like[post_id] = false;
          setState({ likes: like });
        }
      });
  }

  function handleUnlike(post_id) {
    let like = state.likes;
    like[post_id] = false;
    setState({ likes: like });

    let reqBody = {
      _User: _id,
      _Blog: post_id
    }

    API.post(`unlike`, reqBody)
      .then(res => {
        const success = res.data.success;
        if (!success) {
          let like = state.likes;
          like[post_id] = true;
          setState({ likes: like });
        };
      });
  }

  function handleRequest() {
    let request = state.requests;
    request[state.reqPost] = true;

    setState({
      requests: request,
      confirmRequest: false
    });

    let reqBody = {
      _User: _id,
      _Blog: state.reqPost
    }

    API.post(`requests`, reqBody)
      .then(res => {
        const success = res.data.success;
        if (!success) {
          let request = state.requests;
          request[state.reqPost] = false;
          setState({ requests: request, reqPost: '' });
        }
      });

  }

  let lastTap = null;
  function handleDoubleTap(post_id) {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;
    if (lastTap && (now - lastTap) < DOUBLE_PRESS_DELAY) {

      state.likes[post_id] == true ?
        handleUnlike(post_id) :
        handleLike(post_id);

    } else {
      lastTap = now;
    }
  }

  function fetchData() {
    API.get(`blogs`)
      .then(res => {
        const success = res.data.success;
        if (success) {
          const blogs = res.data.result;
          setState({ posts: blogs });
          API.get(`likes`)
            .then(res => {
              const success = res.data.success;
              if (success) {
                const likes = res.data.result;
                let likeArr = {};
                blogs.map(b => {
                  let isLiked = likes.find(l => l._Blog == b._id);
                  isLiked ? likeArr[b._id] = true : likeArr[b._id] = false;
                });
                setState({ likes: likeArr });
              }
            });
          API.get(`getBySender/${_id}`)
            .then(res => {
              const success = res.data.success;
              if (success) {
                const requests = res.data.result;
                let reqArr = {};
                blogs.map(b => {
                  let isRequest = requests.find(r => b._id == r._Blog._id);
                  isRequest ? reqArr[b._id] = true : reqArr[b._id] = false;
                  setState({ requests: reqArr });
                })
              }
            });
        }
      });
  }

  // const onRefresh = useCallback(() => {
  //   setRefreshing(true);

  //   wait(2000).then(() => setRefreshing(false));
  // }, []);


  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView>
        {!state.posts.length ?
          <Text>no result</Text>
          :
          state.posts.map(post =>
            <Card
              key={post._id}
              style={styles.cartStyle}
            >

              <Card.Content>
                <Title>{post.animal} &nbsp; {post.kind}</Title>
                <Paragraph>Published on {moment(post.date).fromNow()}</Paragraph>
              </Card.Content>

              <TouchableWithoutFeedback onPress={() => handleDoubleTap(post._id)}>
                <Image
                  style={{ width: width, height: width }}
                  source={{ uri: `http://192.168.43.79:8000/uploads/${post.photo}` }}
                />
              </TouchableWithoutFeedback>

              <Card.Content>
                <Card.Content>
                  <View>
                    <Text>Name : {post.name}</Text>
                    <Text>Gender : {post.gender}</Text>
                    <Text>Age : {post.age}</Text>
                    <Text>Color : </Text>
                    <View
                      style={{
                        backgroundColor: post.color,
                        height: 15,
                        width: 30,
                        borderRadius: 10,
                        borderWidth: 1,
                        borderColor: post.color == '#FFFFFF' ? '#D2B48C' : 'transparent'
                      }}
                    />
                    <Text>{post.description}</Text>
                  </View>
                </Card.Content>
              </Card.Content>

              {state.likes[post._id] ?
                < FontAwesome
                  name='heart'
                  size={24}
                  color='#D2B48C'
                  onPress={() => handleUnlike(post._id)}
                />
                :
                <FontAwesome
                  name='heart-o'
                  size={24}
                  color='#D2B48C'
                  onPress={() => handleLike(post._id)}
                />
              }

              {post._User == _id ? null :
                state.requests[post._id] ?
                  <Text>Request sent!</Text>
                  :
                  <FontAwesome
                    name='send'
                    size={24}
                    color='#D2B48C'
                    onPress={() => setState({ reqPost: post._id, confirmRequest: true })}
                  />
              }
            </Card>
          )
        }

        <Modal
          animationType="slide"
          transparent={true}
          visible={state.confirmRequest}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setState({ confirmRequest: !state.confirmRequest });
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Send Request?</Text>

              <View
                style={[{
                  width: width / 2,
                  margin: 5,
                }]}
              >
                <Button
                  title='Send'
                  color='#D2B48C'
                  onPress={handleRequest}
                />
              </View>

              <View style={[{ width: width / 2, margin: 5 }]}>
                <Button
                  title='Cancel'
                  color='#D2B48C'
                  onPress={() => setState({ confirmRequest: false })}
                />
              </View>

            </View>
          </View>
        </Modal>
      </ScrollView >

    </View >
  )
}

const { width } = Dimensions.get("screen");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  cartStyle: {
    shadowOffset: { width: 10, height: 10 },
    width: width,
    borderRadius: 5,
    alignSelf: 'center',
    marginBottom: 15
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontWeight: 'bold',
    fontSize: 15
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  heart: {}
});
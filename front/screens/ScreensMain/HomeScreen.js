import React, { useState, useEffect, useContext, useCallback } from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Button,
  Modal,
  Dimensions,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';

import {
  Card,
  Title,
  Paragraph
} from 'react-native-paper';

import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/Ionicons';
import { useFocusEffect } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import moment from 'moment';
import API from '../../API';
import SessionContext from '../../components/SessionContext';

export default function HomeScreen({ navigation }) {

  const { session: { user: { _id } } } = useContext(SessionContext);

  const [state, updateState] = useState({
    posts: [],
    likes: '',
    reports: '',
    requests: '',

    confirm: false,
    confirmReport: false,
    confirmRequest: false,
    reqPost: ''
  });

  function setState(nextState) {
    updateState(prevState => ({
      ...prevState,
      ...nextState
    }))
  }

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

  function handleReport() {
    let report = state.reports;
    report[state.reqPost] = true;

    setState({
      reports: report,
      confirmReport: false
    });

    let reqBody = {
      _User: _id,
      _Blog: state.reqPost
    }

    API.post(`reports`, reqBody)
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
          API.post(`getBySender/${_id}`)
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
          API.post(`getByReporter`, { _Reporter: _id })
            .then(res => {
              const success = res.data.success;
              if (success) {
                const reports = res.data.result;
                let reqArr = {};
                blogs.map(b => {
                  let isReport = reports.find(r => b._id == r._Blog);
                  isReport ? reqArr[b._id] = true : reqArr[b._id] = false;
                  setState({ reports: reqArr });
                })
              }
            });
        }
      });
  }

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [])
  );

  useEffect(() => {
    fetchData();
  }, []);

  return (
    !state.posts.length ?
      <Animatable.View
        style={styles.containerViewEmpty}
        animation="pulse"
        easing="ease-out"
        iterationCount="infinite"
      >
        <Icon
          name='search'
          size={25}
          style={styles.icon}
        />
        <Text
          style={[styles.icon, { fontSize: 24 }]}
        >
          &nbsp; &nbsp; Loading
        </Text>
      </Animatable.View>
      :
      <View style={styles.container}>
        <ScrollView>
          {state.posts.map(post =>
            <Card
              key={post._id}
              style={styles.cartStyle}
            >

              <Card.Content>
                <Title>{post.animal} &nbsp; {post.kind}</Title>
                <Paragraph>Published on {moment(new Date(post.date)).fromNow()}</Paragraph>
              </Card.Content>

              <TouchableWithoutFeedback onPress={() => handleDoubleTap(post._id)}>
                <Image
                  style={{ width: width, height: width }}
                  source={{ uri: `http://192.168.43.79:8000/uploads/${post.photo}` }}
                />
              </TouchableWithoutFeedback>

              <Card.Content>
                <Card.Content>
                  <View style={{ marginBottom: 10 }}>
                    <View style={styles.flexRowView}>
                      <Text style={styles.boldTextStyle}>Name : </Text>
                      <Text>{post.name}</Text>
                    </View>

                    <View style={styles.flexRowView}>
                      <Text style={styles.boldTextStyle}>Gender : </Text>
                      <Text>{post.gender}</Text>
                    </View>

                    <View style={styles.flexRowView}>
                      <Text style={styles.boldTextStyle}>Age : </Text>
                      <Text>{post.age} months</Text>
                    </View>

                    <View style={styles.flexRowView}>
                      <Text style={styles.boldTextStyle}>Color : </Text>
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
                    </View>

                    <Text>{post.description}</Text>
                  </View>
                  {state.likes[post._id] ?
                    <Icon
                      name='paw'
                      size={35}
                      color='#D11A2A'
                      onPress={() => handleUnlike(post._id)}
                      style={styles.likeStyle}
                    />
                    :
                    <Icon
                      name='paw-outline'
                      size={35}
                      color='#D2B48C'
                      onPress={() => handleLike(post._id)}
                      style={styles.likeStyle}
                    />
                  }
                </Card.Content>
              </Card.Content>

              {post._User == _id ? null :
                state.confirm ? null :
                  <View style={styles.viewMoreOption}>
                    <TouchableOpacity
                      style={styles.moreOption}
                      onPress={() => setState({ reqPost: post._id, confirm: true })}
                    >
                      <FontAwesome
                        name='ellipsis-v'
                        size={25}
                        color='#D2B48C'

                      />
                    </TouchableOpacity>
                  </View>
              }
            </Card>
          )
          }

          <Modal
            animationType="slide"
            transparent={true}
            visible={state.confirm}
            onRequestClose={() => {
              setState({ confirm: false, reqPost: '' })
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>Manage Post</Text>

                <View
                  style={[{
                    width: width / 2,
                    margin: 5,
                  }]}
                >
                  <Button
                    title='Send Request'
                    color='#D2B48C'
                    onPress={() => setState({ confirm: false, confirmRequest: true })}
                  />
                </View>

                <View
                  style={[{
                    width: width / 2,
                    margin: 5,
                  }]}
                >
                  <Button
                    title='Report Post'
                    color='#D2B48C'
                    onPress={() => setState({ confirm: false, confirmReport: true })}
                  />
                </View>

                <View style={[{ width: width / 2, margin: 5 }]}>
                  <Button
                    title='Cancel'
                    color='#D2B48C'
                    onPress={() => setState({ confirm: false, reqPost: '' })}
                  />
                </View>

              </View>
            </View>
          </Modal>

          <Modal
            animationType="slide"
            transparent={true}
            visible={state.confirmReport}
            onRequestClose={() => {
              setState({ confirmReport: false, reqPost: '' })
            }}
          >
            <View style={styles.centeredView}>
              {state.reports[state.reqPost] ?
                <View style={styles.modalView}>
                  <Text style={styles.modalText}>Report!</Text>
                  <Text>We got your report</Text>
                  <Text>Thank you!</Text>
                  <View style={[{ width: width / 2, margin: 5 }]}>
                    <Button
                      title='Ok'
                      color='#D2B48C'
                      onPress={() => setState({ confirmReport: false, reqPost: '' })}
                    />
                  </View>
                </View>
                :
                <View style={styles.modalView}>
                  <Text style={styles.modalText}>Send Report?</Text>
                  <View
                    style={[{
                      width: width / 2,
                      margin: 5,
                    }]}
                  >
                    <Button
                      title='Send'
                      color='#D2B48C'
                      onPress={handleReport}
                    />
                  </View>

                  <View style={[{ width: width / 2, margin: 5 }]}>
                    <Button
                      title='Cancel'
                      color='#D2B48C'
                      onPress={() => setState({ confirmReport: false, reqPost: '' })}
                    />
                  </View>
                </View>
              }
            </View>
          </Modal>

          <Modal
            animationType="slide"
            transparent={true}
            visible={state.confirmRequest}
            onRequestClose={() => {
              setState({ confirmRequest: false, reqPost: '' })
            }}
          >
            <View style={styles.centeredView}>
              {state.requests[state.reqPost] ?
                <View style={styles.modalView}>
                  <Text style={styles.modalText}>Request!</Text>
                  <Text>You sent a request</Text>
                  <Text>Please check your request list</Text>
                  <Text>Thank you!</Text>
                  <View style={[{ width: width / 2, margin: 5 }]}>
                    <Button
                      title='List Request'
                      color='#D2B48C'
                      onPress={() => navigation.navigate('requests')}
                    />
                  </View>

                  <View style={[{ width: width / 2, margin: 5 }]}>
                    <Button
                      title='Ok'
                      color='#D2B48C'
                      onPress={() => setState({ confirmRequest: false, reqPost: '' })}
                    />
                  </View>
                </View>
                :
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
                      onPress={() => setState({ confirmRequest: false, reqPost: '' })}
                    />
                  </View>

                </View>
              }
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
  containerViewEmpty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
  },
  icon: {
    backgroundColor: 'transparent',
    color: 'rgba(0,0,0,0.3)',
    fontSize: 35.
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
  moreOption: {
  },
  viewMoreOption: {
    position: 'absolute',
    top: 30,
    right: 15,
  },
  flexRowView: {
    flexDirection: 'row',
  },
  boldTextStyle: {
    fontWeight: 'bold',
    marginRight: 5
  },
  likeStyle: {
    position: 'absolute',
    top: 15,
    right: 0
  }
});
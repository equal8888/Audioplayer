import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Vibration,
  Switch,
  FlatList, 
  Image,
  ActivityIndicator,
} from 'react-native';

import {
  Slider,
  List, 
  ListItem, 
  SearchBar
} from 'react-native-elements';
import Button from 'react-native-button';

// audio player repos
import {
    Player,
    Pause,
    MediaStates,
} from 'react-native-audio-toolkit';

// search music repos
 import MusicFiles from 'react-native-get-music-files';
import { NativeModules, DeviceEventEmitter } from 'react-native';
const SongsCollection = NativeModules.SongsCollection;
// Search music


class AudioPlayer01 extends React.Component {
  constructor() {
    super();
  state = {selected: (new Map(): Map<string, boolean>)};

  _keyExtractor = (item, index) => item.title;

    this.state = {
      data: [],
      playPauseButton: 'Select song...',
 
      stopButtonDisabled: true,
      playButtonDisabled: true,

      loopButtonStatus: false,
      progress: 0,

      error: null,

      loading: false,
      data: [],
      page: 1,
      seed: 1,
      error: null,
      refreshing: true,
      test: null,
      filename: null
    };
  }
    
      onPressItem01 = (test, id) => {
      let filename = ''+test+''
//          console.log(test, id);
          this._reloadPlayer(filename)
//          this._playPause()
  }

  Loader = () => {
        const { page, seed } = this.state;
        this.setState({ loading: true })

        MusicFiles.get(
          (XXX) => {
        console.log(XXX)
         
        this.setState({
          data: page === 1 ? XXX : [...this.state.data, ...XXX],
          error: XXX.error || null,
          loading: false,
          refreshing: false
        })
          },
          (error) => {
            console.log(error);
          }
        );
      };

  componentDidMount() {
    this.Loader();
  }

//    handleRefresh = () => {
//    this.setState(
//      {
//        page: 1,
//        seed: this.state.seed + 1,
//        refreshing: true
//      },
//      () => {
//        this.Loader();
//      }
//    );
//  };

//  handleLoadMore = () => {
//    this.setState(
//      {
//        page: this.state.page + 1
//      },
//      () => {
//        this.Loader();
//      }
//    );
//  };
//
// End of flatlist
  
  componentWillMount() {
  //  this.player = null;
    this.lastSeek = 0;
          this._progressInterval = setInterval(() => {
      if (this.player && this._shouldUpdateProgressBar()) {// && !this._dragging) {
        this.setState({progress: Math.max(0, this.player.currentTime) / this.player.duration});
      }
    }, 100);
  }

  componentWillUnmount() {
    clearInterval(this._progressInterval);
  }

  _shouldUpdateProgressBar() {
    // Debounce progress bar update by 200 ms
    return Date.now() - this.lastSeek > 200;
  }

  _updateState(err) {
    this.setState({
      playPauseButton:      this.player    && this.player.isPlaying,  // ? 'Pause' : 'Play',

      playButtonDisabled:   this.player   && !this.player.canPlay,

      stopButtonDisabled:   this.player   && !this.player.isPlaying 
    });
  }

  _playPause() {
    this.player.playPause((err, playing) => {
      if (err) {
        this.setState({
          error: err.message
        });
      }
      this._updateState();
    });
  }

  _stop() {
    this.player.stop(() => {
      this._updateState();
    });
  }

  _seek(percentage) {
    if (!this.player) {
      return;
    }

    this.lastSeek = Date.now();

    let position = percentage * this.player.duration;

    this.player.seek(position, () => {
      this._updateState();
    });
  }

  _reloadPlayer(filename) {    
    if (this.player) {
      this.player.destroy();
    }
    this.player = new Player(filename, {
      autoDestroy: false
    }).prepare((err) => {
      if (err) {
        console.log('error at _reloadPlayer():');
        console.log(err);
      } else {
        this.player.looping = this.state.loopButtonStatus;
      }
      this._updateState();
    });

    this._updateState();

    this.player.on('ended', () => {
      // here next song ?
      this._updateState();
    });
    this.player.on('pause', () => {
      this._updateState();
    });
  }

  _toggleLooping(value) {
    this.setState({
      loopButtonStatus: value
    });
    if (this.player) {
      this.player.looping = value;
    }
  }

    _getsongs() {
    this.player.stop(() => {
      this._updateState();
});
}
    
  render() {
        return (
        <View style={styles.background01}>
          
        <Text style={styles.title}>Audio Player</Text>

        <List style={styles.flatlist}>
        <FlatList
          data={this.state.data}
          renderItem={({ item }) => (

      <TouchableHighlight style={styles.renderHeader} 

      avatar={require('./android/app/src/main/res/raw/noteicon.png')}

      containerStyle={{ borderBottomWidth: 0 }}
      onPress={() => this.onPressItem01(item.path)}>

      <View style={styles.flatlistcontent} >
        <Image
          style={{width: 70, height: 70, marginTop: "1%", marginBottom: "1%"}}
          source={require('./android/app/src/main/res/raw/noteicon.png')}
        />
      <Text style={{fontSize: 24, marginLeft: "19%", marginTop: "-16%"}}>{item.author}</Text>
      <Text style={{fontSize: 20, marginLeft: "19%", marginBottom: "1%"}}>{item.title}</Text>
      <Text style={{
    borderBottomWidth: 1 }}></Text>
      </View>
    </TouchableHighlight>
  )}
          keyExtractor={item => item.path}
          ItemSeparatorComponent={this.renderSeparator}
          ListHeaderComponent={this.renderHeader}
          ListFooterComponent={this.renderFooter}
          onRefresh={this.handleRefresh}
          refreshing={this.state.refreshing}
          onEndReachedThreshold={50}
          />
        </List>
     
        <View  style={styles.slider}>
          <Slider 
            thumbTintColor='#0000f4'
            thumbTouchSize={{width: 80, height: 70}}
            step={0.0001} 
            onValueChange={(percentage) => this._seek(percentage)} value={this.state.progress}/>
        </View>

        <View style={styles.buttonContainer}>
          <Button  
            disabled={this.state.playButtonDisabled} 
            style={styles.button}  
            onPress={() => this._playPause()}>
            {this.state.playPauseButton}
            &#9208;/ &#9658;
          </Button>
          
          <Button 
            disabled={this.state.stopButtonDisabled} 
            style={styles.button} 
            onPress={() => this._stop()}>
            &#9724;
          </Button>

          <View style={styles.ToggleLoopingStyle}>
          <Text> Toggle Looping </Text>
          <Switch
          disabled={this.state.playButtonDisabled}           
          onValueChange={(value) => this._toggleLooping(value)}
          value={this.state.loopButtonStatus} />
          <Text>OFF / ON</Text>

        </View>
        </View>
        </View>
    );
  }
}

// styles flatlist

var styles = StyleSheet.create({

    background01: {
    backgroundColor: 'black',
//    width: 412,
//    height: 660
  },
    flatlist: {
      margin: 1, 
 //   paddingBottom: 500,
//    paddingTop: 0,
    justifyContent: 'space-between',
    borderRadius: 5,
    borderWidth: 1,
  //  borderBottomWidth: 200,
//    backgroundColor: 'black',
//    width: 412,
 //    height: 455
     height: 500
  },
flatlistcontent: {
  //  margin: 10, 
//    height: 1,
//    width: "86%",
    paddingBottom: 1,
    paddingTop: 1,
    backgroundColor: "#CED0CE",
    backgroundColor: 'white',
//    paddingVertical: 20,
//    borderTopWidth: 1,
    borderColor: "#CED0CE"
  //  borderBottomWidth: 200,
//    width: 412,
  },
    Liststyle01: {
    margin: 20,
    backgroundColor: 'white'
  },
    item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  button: {
    fontSize: 25,
    padding: 15,
    color: 'blue'
  },
  slider: {
 //   flex: 1,
 //   thumbTintColor:'blue' ,
    alignContent: 'flex-end',
    justifyContent: 'space-between',
    paddingBottom: 1,
    paddingTop: 1,
    justifyContent: 'space-between',
    margin: 1,
    marginHorizontal: 20
  },
  buttonContainer: {
    alignContent: 'flex-end',
    paddingBottom: 1,
    paddingTop: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 4,
    borderWidth: 0.5,
    borderColor: '#d6d7da',
    backgroundColor: '#F5FCFF',
    alignItems: 'center'
  },
  ToggleLoopingStyle: {
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#d6d7da',
    alignItems: 'center'
  },
  title: {
    fontSize: 19,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 10,
    color: 'white',
    backgroundColor: '#0000f4'
  },
  errorMessage: {
    fontSize: 15,
    textAlign: 'center',
    padding: 10,
    color: 'red'
  },
  text: {
    marginLeft: 12,
    fontSize: 16
  },
   container: {
   flex: 1,
 //  paddingTop: 22
  },
  sectionHeader: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    fontSize: 14,
    fontWeight: 'bold',
    backgroundColor: 'white'
  },
});
AppRegistry.registerComponent('AudioPlayer01', () => AudioPlayer01);
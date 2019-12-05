import "isomorphic-fetch";
import Layout from "../components/Layout";
import ChannelGrid from "../components/ChannelGrid";
import PodcastList from "../components/PodcastList";
import Error from "./_error";
import PodcastListWithClick from "../components/PodcastListWithClick";
import PodcastPlayer from "../components/PodcastPlayer";
export default class extends React.Component {

  constructor(props){
    super(props);
    this.state = {openPodcast: null}
  }
  //El server guarda el query argument
  static async getInitialProps({ res, query }) {
    try{
      let id = query.id;
      // let reqChannel = await fetch(`https://api.audioboom.com/channels/${id}`);
      // let dataChannel = await reqChannel.json();
      // let channel = dataChannel.body.channel;
  
      // let reqAudio = await fetch(
      //   `https://api.audioboom.com/channels/${id}/audio_clips`
      // );
      // let audioChannel = await reqAudio.json();
      // let audioclips = audioChannel.body.audio_clips;
  
      // let reqSeries = await fetch(
      //   `https://api.audioboom.com/channels/${id}/child_channels`
      // );
      // let dataSeries = await reqSeries.json();
      // let series = dataSeries.body.channels;
  
      // return { channel, audioclips, series };
  
      /// Fetchs aun mas optimos
  
      let [reqChannel, reqAudio, reqSeries] = await Promise.all([
          fetch(`https://api.audioboom.com/channels/${id}`),
          fetch(`https://api.audioboom.com/channels/${id}/audio_clips`),
          fetch(`https://api.audioboom.com/channels/${id}/child_channels`)
      ]);

      if(reqChannel.status >= 400){
        res.statusCode = reqChannel.status;
        return {channel:null, audioclips:null, series:null, statusCode:reqChannel.status}
      }
  
      let dataChannel = await reqChannel.json();
      let channel = dataChannel.body.channel;
  
      let audioChannel = await reqAudio.json();
      let audioclips = audioChannel.body.audio_clips;
  
      let dataSeries = await reqSeries.json();
      let series = dataSeries.body.channels;
  
      return { channel, audioclips, series, statusCode:200 };

    }catch(e){
      res.statusCode = 503;
      return {channel:null, audioclips:null, series:null, statusCode:503}
    }

  }

  openPodcast = (event, podcast) => {
    if ( event.metaKey || event.ctrlKey || event.shiftKey || (event.nativeEvent && event.nativeEvent.which === 2) ) {
      // Si está haciendo Ctrl+Click o Cmd+Click, dejamos que el click suceda normalmente
      return
    }

    event.preventDefault()
    this.setState({
      openPodcast: podcast
    })
  }

  closePodcast = (event) => {
    event.preventDefault()
    this.setState({
      openPodcast: null
    })
  }

  render() {
    const { channel, audioclips, series, statusCode } = this.props;
    const {openPodcast} = this.state;

    

    if( statusCode !== 200 ) {
      return <Error statusCode={ statusCode } />
    }
    return (
      <Layout title={channel.title}>
       { openPodcast && 
        <div className="modal">
          <PodcastPlayer clip={ openPodcast } onClose={ this.closePodcast } />
        </div>
      }

      <div className="banner" style={{ backgroundImage: `url(${channel.urls.banner_image.original})` }} />
      
      <h1>{ channel.title }</h1>

      { series.length > 0 &&
        <div>
          <h2>Series</h2>
          <ChannelGrid channels={ series } />
        </div>
      }

      <h2>Ultimos Podcasts</h2>
      <PodcastListWithClick podcasts={ audioclips }  onClickPodcast={this.openPodcast}/>

      <style jsx>{`
        .banner {
          width: 100%;
          padding-bottom: 25%;
          background-position: 50% 50%;
          background-size: cover;
          background-color: #aaa;
        }
        h1 {
          font-weight: 600;
          padding: 15px;
        }
        h2 {
          padding: 15px;
          font-size: 1.2em;
          font-weight: 600;
          margin: 0;
        }
        .modal{
          position:fixed;
          top:0;
          left:0;
          right:0;
          bottom:0;
          z-index:9999;
          background-color:red;
        }
      `}</style>
    </Layout>
    );
  }
}

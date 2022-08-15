import React, { Fragment, useEffect, useState } from 'react';
import Axios from 'axios';
import Card from 'react-bootstrap/Card';
import Loading from '../../assets/loading.gif'


const Lyrics = (props) => {
  const [artist, setArtist] = useState(props.artist);
  const [song, setSong] = useState(props.song);
  const [lyrics, setLyrics] = useState(0);

  console.log(props);

  useEffect(() => {
    const getLyrics = async() => {
      await Axios.get(`https://api.lyrics.ovh/v1/${artist}/${song}`).then(res => {
        let rawData = res.data.lyrics;
        let result = rawData.replace('/s', '&');
        setLyrics(result);
      });
    }

    console.log('getting lyrics...');
    getLyrics().catch(console.log);
  }, [])

  if(lyrics === 0) {
    return(
      <Fragment>
        <Card>
          <Card.Img variant='bottom' src={Loading}/>
            <Card.Body>
              <Card.Text>fetching lyrics...</Card.Text>
            </Card.Body>
        </Card>
      </Fragment>
    );
  } else {
    return(
      <Fragment>
        <Card className='text-center'>
          <Card.Body>
            <Card.Title>lyrics</Card.Title>
            <Card.Text><pre>{lyrics}</pre></Card.Text>
          </Card.Body>
        </Card>
      </Fragment>
    );
  }
}


export default Lyrics;
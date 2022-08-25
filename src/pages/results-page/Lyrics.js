import React, { Fragment, useEffect, useState } from 'react';
import Axios from 'axios';
import Card from 'react-bootstrap/Card';
import Loading from '../../assets/loading.gif';
import LlamaSVG from '../../assets/llama.svg';

let musicInfo = require('music-info');

const Lyrics = (props) => {
  const [artist, setArtist] = useState(props.artist);
  const [song, setSong] = useState(props.song);
  const [lyrics, setLyrics] = useState(0);
  const [cardImage, setCardImage] = useState(Loading);
  const [cardTitle, setCardTitle] = useState('getting lyrics...');
  const [cardText, setCardText] = useState('');

  useEffect(() => {
    const getLyrics = async() => {
      musicInfo.searchLyrics(
        {
          title: `${song}`,
          artist: `${artist}`
        }, 5000
      ).catch(() => {
        setLyrics(-1);
      }).then((value) => {
          if (value !== undefined) {
            let rawData = value.lyrics;
            // let result = rawData.replace(/[\n]+/gm, '\n');
            setLyrics(rawData);
          }
      });
    }

    getLyrics();
  }, []);

  useEffect(() => {
    switch (lyrics) {
      case -1:
        setCardTitle('oops! lyrics not found');
        setCardText('');
        setCardImage(LlamaSVG);
        break;
      case 0:
        setCardText('');
        break;
      default:
        setCardTitle('lyrics');
        setCardImage('');
        setCardText(lyrics);
        break;
    }
  }, [lyrics]);

  // styles 
  const titleText = {color: 'black', fontFamily: 'Courier New', fontSize: 22, fontWeight: 800, textDecoration: 'underline'};
  const bodyText = {color: 'black', fontFamily: 'Courier New', fontSize: 16, fontWeight: 500, overflowWrap: 'anywhere'};
  
  return(
    <Fragment>
      <Card className='text-center'>
        <Card.Img className='mt-4' variant='top' src={cardImage} style={{width: '10rem', alignSelf: 'center'}}/>
        <Card.Body>
          <Card.Title style={titleText}>{cardTitle}</Card.Title>
          <Card.Text style={bodyText}>
              <p style={{
                whiteSpace: 'pre-wrap'
              }}>{cardText}</p>
          </Card.Text>
        </Card.Body>
      </Card>
    </Fragment>
  );
}


export default Lyrics;
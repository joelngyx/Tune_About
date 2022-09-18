import React, { Fragment, useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Loading from '../../assets/loading.gif';
import LlamaSVG from '../../assets/llama.svg';
import LinkTo from './LinkTo';


const Lyrics = (props) => {
  // eslint-disable-next-line
  const [artist, setArtist] = useState(props.artist);
  // eslint-disable-next-line
  const [song, setSong] = useState(props.song);
  const [lyrics, setLyrics] = useState(0);
  const [cardImage, setCardImage] = useState(Loading);
  const [cardTitle, setCardTitle] = useState('getting lyrics...');
  const [cardText, setCardText] = useState('');

  useEffect(() => {
    const getLyrics = async() => {
      await fetch(`https://some-random-api.ml/lyrics/?title=${song}${artist}`)
        .then(
          res => {
            if (res.status !== 200 || res.error) {
              setLyrics(-1);
            } else {
              res.json().then(data => {
                setLyrics(data.lyrics);
              })
            }
          }
        )
      }

    getLyrics();
  }, [song, artist]);

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
          <div className='mt-5' p-0>
            <h1 style={titleText}>find the meaning of these lyrics from these websites:</h1>
            <LinkTo artist={artist} song={song} website={'genius'}/>
            <LinkTo artist={artist} song={song} website={'lyrics-mode'}/>
            <LinkTo artist={artist} song={song} website={'song-meanings'}/>
          </div>
        </Card.Body>
      </Card>
    </Fragment>
  );
}


export default Lyrics;
import React, { Fragment, useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import { useLocation, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import LlamaSVG from '../../assets/llamaWhite.svg';

let musicInfo = require('music-info');

const Album = (props) => {
  const [artist, setArtist] = useState(props.artist);
  const [song, setSong] = useState(props.song);
  const [album, setAlbum] = useState('what album?');
  const [cover, setCover] = useState(LlamaSVG);

  const navigate = useNavigate();

  const backBtn = () => {
    try {
      navigate('../');
    } catch (e) {
      console.log(e);
    }
  }

  useEffect(() => {
    const getAlbum = async() => {
      console.log(song, artist)
      musicInfo.searchSong(
        {title: `${song}`, artist: `${artist}`}, 
        1000
      ).then((value) => {
          setSong(song.toLowerCase());
          setAlbum(' by ' + value.artist.toLowerCase() + 'from ' + value.album.toLowerCase());
          setCover(value.artwork);
        }
      );
    }
  
    getAlbum();
  }, [album]);

  // styles
  const btnText = {color: "black", fontFamily: "Courier New", fontSize: 16, fontWeight: 800, backgroundColor: '#8A5656', border: '0px'};
  const titleText = {color: 'white', fontFamily: 'Courier New', fontSize: 22, fontWeight: 800};
  const bodyText = {color: 'white', fontFamily: 'Courier New', fontSize: 16, fontWeight: 800};

  return(
    <Fragment>
      <Card className='text-center p-4' style={{backgroundColor: 'black', color: 'white'}}>
        <Card.Img variant='top' src={cover} style={{width: '10rem', alignSelf: 'center'}}/>
        <Card.Body>
          <Card.Title style={titleText}>
            {song}
          </Card.Title>
          <Card.Text style={bodyText}>
            {album}
          </Card.Text>
          <Button onClick={backBtn} style={btnText}>search for another song</Button>
        </Card.Body>
      </Card>
    </Fragment>
  )
}

export default Album;
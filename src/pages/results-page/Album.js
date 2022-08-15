import React, { Fragment, useState } from 'react';
import Card from 'react-bootstrap/Card';

let musicInfo = require('music-info');

const Album = (props) => {
  const [artist, setArtist] = useState(props.artist);
  const [song, setSong] = useState(props.song);
  const [album, setAlbum] = useState(0);
  const [cover, setCover] = useState(0);

  console.log(props);

  function getAlbum() {
    musicInfo.searchSong(
      {
        title: `${song}`,
        artist: `${artist}`
      }, 1000
    ).then((value) => {
      console.log('hey!')
      console.log(value);
      setSong(song.toLowerCase());
      setArtist(value.artist.toLowerCase());
      setAlbum(value.album.toLowerCase());
      setCover(value.artwork);
    });
  }

  getAlbum();

  return(
    <Fragment>
      <Card className='text-center p-3' style={{backgroundColor: 'black', color: 'white'}}>
        <Card.Img variant='top' src={cover}/>
        <Card.Body>
          <Card.Title>
            {song}
          </Card.Title>
          <Card.Text>
            from {album} by {artist}
          </Card.Text>
        </Card.Body>
      </Card>
    </Fragment>
  )
}

export default Album;
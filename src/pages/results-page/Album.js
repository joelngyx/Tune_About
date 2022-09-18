import React, { Fragment, useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import LlamaSVG from '../../assets/llamaWhite.svg';
import LinkTo from './LinkTo';


const Album = (props) => {
  // eslint-disable-next-line
  const [artist, setArtist] = useState(props.artist);
  const [song, setSong] = useState(props.song);
  const [album, setAlbum] = useState('no album found :(');
  const [year, setYear] = useState('');
  const [genre, setGenre] = useState('');
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
    const fetchDataFromITunes = async() => {
      let queryArtist = artist.toLowerCase();
      let querySong = song.toLowerCase();
      let searchString = `https://itunes.apple.com/search?term=${querySong}+${queryArtist}&limit=7&entity=song`;
      await fetch(searchString).then(
        res => {
          if (res.status !== 200) {
            setArtist('');
          } else {
            res.json().then(data => {
              let results = data.results;
              for(let count = 0; count < results.length; count ++) {
                // check if the result's artist is the same as the value of the artist passed in the search
                let resultArtistName = results[count].artistName.toLowerCase();
                if(resultArtistName === queryArtist) {
                  setSong(results[count].trackName.toLowerCase());
                  setArtist(`artist: ${results[count].artistName.toLowerCase()}`);
                  setAlbum(`album: ${results[count].collectionName.toLowerCase()}`);
                  setYear(`year released: ${results[count].releaseDate.substring(0, 4)}`);
                  setGenre(`genre: ${results[count].primaryGenreName.toLowerCase()}`);
                  setCover(results[count].artworkUrl100.replace(/100x100/, `900x900`));
                  break;
                }
              }
            })
          }
        }
      )
    }
  
    fetchDataFromITunes();
    // eslint-disable-next-line
  }, [album]);

  // styles
  const btnText = {color: "white", fontFamily: "Courier New", fontSize: 16, fontWeight: 800, backgroundColor: '#336671', border: '0px'};
  const titleText = {color: 'white', fontFamily: 'Courier New', fontSize: 22, fontWeight: 800};
  const bodyText = {color: 'white', fontFamily: 'Courier New', fontSize: 16, fontWeight: 800};

  return(
    <Fragment>
      <Card className='text-center p-5' style={{backgroundColor: 'black', color: 'white'}}>
        <Card.Img variant='top' src={cover} style={{width: '15rem', alignSelf: 'center'}}/>
        <Card.Body className='mt-3 p-0' style={{alignSelf: 'center'}}>
          <Card.Title style={titleText}>
            {song}
          </Card.Title>
          <Card.Text style={bodyText}>
            {artist} <br/>
            {album} <br/>
            {year} <br/>
            {genre}
          </Card.Text>
          <LinkTo artist={artist} song={song} website='youtube'/>
          <Button className='mt-2' onClick={backBtn} style={btnText}>make another search</Button>
        </Card.Body>
      </Card>
    </Fragment>
  )
}

export default Album;